import * as Cookies from "../utils/cookies";

export enum LoginState {
  NotLoggedIn,
  LoggingIn,
  LoggedIn,
  LoggingOut,
}

export interface IAuthState {
  auth: IAuthInnerState;
}

export interface IAuthInnerState {
  accessToken?: string;
  loginState: LoginState;
  redirectPath?: string;
}

export const DEFAULT_AUTH_STATE: IAuthInnerState = {
  loginState: LoginState.NotLoggedIn,
};

export function getExistingAuthState(): IAuthInnerState {
  const accessToken = Cookies.getAccessToken();
  const redirectPath = Cookies.getRedirectPath();

  return {
    accessToken,
    loginState: accessToken ? LoginState.LoggedIn : LoginState.NotLoggedIn,
    redirectPath,
  };
}
