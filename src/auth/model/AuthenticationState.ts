import Cookies from "../utils/cookies";

export enum LoginState {
  NotLoggedIn,
  LoggingIn,
  LoggedIn,
  LoggingOut
}

export interface AuthState {
  auth: AuthInnerState;
}

export interface AuthInnerState {
  accessToken?: string;
  loginState: LoginState;
}

export const DEFAULT_AUTH_STATE: AuthInnerState = {
  loginState: LoginState.NotLoggedIn
}

export function getExistingAuthState(): AuthInnerState {
  const accessToken = Cookies.getAccessToken();
  
  return {
    accessToken,
    loginState: accessToken ? LoginState.LoggedIn : LoginState.NotLoggedIn,
  };
}