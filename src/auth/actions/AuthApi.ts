import { Dispatch } from "redux";
import { Api } from "../../api/actions";
import { IJwtResponse, IJwtUserResponse, IUser } from "../../app/types";
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
        const payload = getState().auth.useEmailAsUsername
          ? { email: username, password }
          : { username, password };
        const token = getState().auth.token;
        return this.postRequest("/api/login/username/jwt/", payload, dispatch, token)
          .then((response: IJwtResponse) => {
            dispatch(completeLogin(response.token));
            return this.getRequest("/api/users/me/", dispatch, token);
          })
          .then((response: IUser) => {
            dispatch(successfulGetUserDetails(response));
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

    protected errorTransformer(_url: string, _error: any) {
      return "Invalid credentials.";
    }

    protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch<IAuthState>) {
      super.handleUnsuccessfulRequest(reason, dispatch);
      dispatch(failLogin(reason));
    }
  }
