import * as HttpStatus from "http-status-codes";
import { Dispatch } from "redux";

import { Api } from "../../api/actions";
import { IJwtUserResponse, IUser } from "../../app/types";
import { IApiError } from "../../index";
import { IAuthState } from "../model/AuthenticationState";
import { completeLogin, failLogin, startLogin, successfulGetUserDetails } from "./index";

export class AuthApi extends Api {
    public static getInstance(): AuthApi {
      if (!AuthApi.singleton) {
        AuthApi.singleton = new AuthApi();
      }

      return AuthApi.singleton;
    }

    private static singleton: AuthApi;

    private static userFromJwtUserResponse(response: IJwtUserResponse): IUser {
      return {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.first_name,
        lastName: response.last_name,
      };
    }

    public login(username: string, password: string) {
      return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
        dispatch(startLogin());
        const authState = getState().auth;
        const innerPayload = authState.useEmailAsUsername
          ? { email: username, password }
          : { username, password };

        // Some auth systems expect parameters in the form:
        // {
        //   user: {
        //     email: test@test.com
        //     password: testtest
        //   }
        // }
        const payload = getState().auth.wrapParameters
          ? { user: innerPayload }
          : innerPayload;
        return this.postRequest("/api/login/username/jwt/", payload, dispatch, null)
          .then((response: IJwtUserResponse) => {
            if (response) {
              if (response.token) {
                dispatch(completeLogin(response.token));
              }
              if (response.email) {
                const user = AuthApi.userFromJwtUserResponse(response);
                dispatch(successfulGetUserDetails(user));
              } else {
                // TODO: Should really fix the Django server so that it returns the user details
                // with the tokens--that would allow elimination of this branching code path.
                // Have to grab new state because we've just updated through dispatch, in theory
                const token = getState().auth.token;
                return this.getRequest("/api/users/me/", dispatch, token)
                .then((userDetailsResponse: IUser) => {
                  dispatch(successfulGetUserDetails(userDetailsResponse));
                });
              }
            }
          });
      };
    }

    public socialLogin(provider: string, code: string, redirectUri: string) {
      return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
        dispatch(startLogin());
        const payload = {
          provider,
          code,
          redirect_uri: redirectUri,
        };
        return this.postRequest("/api/login/social/jwt_user/", payload, dispatch, getState().auth.token)
          .then((response: IJwtUserResponse) => {
            const user = AuthApi.userFromJwtUserResponse(response);
            dispatch(completeLogin(response.token));
            dispatch(successfulGetUserDetails(user));
          });
      };
    }

    protected errorTransformer(_url: string, _error: IApiError): Promise<string> {
      return Promise.reject("Invalid credentials.");
    }

    protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch<IAuthState>) {
      super.handleUnsuccessfulRequest(reason, dispatch);
      dispatch(failLogin(reason));
    }

    protected handleApiResponse<T>(dispatch: Dispatch<IAuthState>, response: Response): Promise<T | string> {
      if (response.status === HttpStatus.OK || response.status === HttpStatus.CREATED) {
        // Handle pulling the JWT token out of the headers if it appears there.
        const authorizationHeader = response.headers.get("Authorization");
        if (authorizationHeader !== null) {
          const token = authorizationHeader.split(" ")[1];
          dispatch(completeLogin(token));
        }
      }

      return super.handleApiResponse(dispatch, response);
    }
  }
