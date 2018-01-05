import { ISocialLoginProvider, IUser } from "../../app/types/index";
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
  oAuth2CallbackBasePath: string;
  providers: ISocialLoginProvider[];
  redirectPath?: string;
}

export const DEFAULT_AUTH_STATE: IAuthInnerState = {
  loginState: LoginState.NotLoggedIn,
  providers: [],
  oAuth2CallbackBasePath: "/auth/login/oauth2/complete/",
};

export function getExistingAuthState(providers: ISocialLoginProvider[] = DEFAULT_AUTH_STATE.providers,
                                     oAuth2CallbackBasePath: string = DEFAULT_AUTH_STATE.oAuth2CallbackBasePath) {
  const user = Cookies.getUser();
  const redirectPath = Cookies.getRedirectPath();

  return {
    user,
    loginState: user && user.token ? LoginState.LoggedIn : LoginState.NotLoggedIn,
    oAuth2CallbackBasePath,
    providers,
    redirectPath,
  };
}
