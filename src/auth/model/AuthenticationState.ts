import { IUser } from "../../types/index";
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
  user?: IUser;
  loginState: LoginState;
  redirectPath?: string;
}

export const DEFAULT_AUTH_STATE: IAuthInnerState = {
  loginState: LoginState.NotLoggedIn,
};

export function getExistingAuthState(): IAuthInnerState {
  const user = Cookies.getUser();
  const redirectPath = Cookies.getRedirectPath();

  return {
    user,
    loginState: user && user.token ? LoginState.LoggedIn : LoginState.NotLoggedIn,
    redirectPath,
  };
}
