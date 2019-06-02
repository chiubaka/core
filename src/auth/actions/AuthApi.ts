import * as HttpStatus from "http-status-codes";

import { Api } from "../../api/actions/Api";
import { IJwtUserResponse, IUser } from "../../app/types";
import { completeLogoutAndRedirect, IApiError } from "../../index";
import { IAuthState } from "../model/AuthenticationState";
import { completeLogin, failLogin, startLogin, successfulGetUserDetails } from "./index";
import { AuthDispatch as Dispatch } from "./types";

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
      firstName: response.firstName,
      lastName: response.lastName,
    };
  }

  public login(username: string, password: string) {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
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
              return this.getRequest("/api/users/me/", null, dispatch, token)
              .then((userDetailsResponse: IUser) => {
                dispatch(successfulGetUserDetails(userDetailsResponse));
              });
            }
          }
        });
    };
  }

  public socialLogin(provider: string, code: string, redirectUri: string) {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
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

  public logout() {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
      const token = getState().auth.token;
      return this.deleteRequest("/api/logout/jwt/", dispatch, token)
      .then(() => {
        dispatch(completeLogoutAndRedirect());
      });
    };
  }

  protected errorTransformer(_url: string, _error: IApiError): Promise<string> {
    return Promise.reject("Invalid credentials.");
  }

  protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch) {
    super.handleUnsuccessfulRequest(reason, dispatch);
    dispatch(failLogin(reason));
  }

  protected handleApiResponse<T>(dispatch: Dispatch, response: Response): Promise<T | string> {
    switch (response.status) {
      case HttpStatus.OK:
      case HttpStatus.CREATED:
        // Handle pulling the JWT token out of the headers if it appears there.
        const authorizationHeader = response.headers.get("Authorization");
        if (authorizationHeader !== null) {
          const token = authorizationHeader.split(" ")[1];
          dispatch(completeLogin(token));
        }
        return super.handleApiResponse(dispatch, response);
      case HttpStatus.NO_CONTENT:
        return Promise.resolve("Successfully logged out.");
      case HttpStatus.UNAUTHORIZED:
        return Promise.reject("Invalid credentials.");
      default:
        super.handleApiResponse(dispatch, response);
    }

    return super.handleApiResponse(dispatch, response);
  }
}
