import { isNullOrUndefined } from "util";

import { IUser } from "../../app/types/index";
import * as Cookies from "../utils/storage";

export enum LoginState {
  NotLoggedIn,
  LoggingIn,
  LoggedIn,
  LoggingOut,
}

export enum OAuth2ResponseType {
  Code = "code",
  Token = "token",
}

export interface ISocialLoginProvider {
  providerName: string;
  clientId: string;
  responseType: OAuth2ResponseType;
  scope?: string[];
}

export interface IAuthState {
  auth: IAuthInnerState;
}

export interface IAuthInnerState {
  token?: string;
  user?: IUser;
  loginState: LoginState;
  oAuth2CallbackBasePath: string;
  socialProviders: ISocialLoginProvider[];
  enableNonSocialLogin: boolean;
  useEmailAsUsername: boolean;
  wrapParameters: boolean;
  redirectPath?: string;
}

export const DEFAULT_AUTH_STATE: IAuthInnerState = {
  enableNonSocialLogin: false,
  useEmailAsUsername: false,
  wrapParameters: false,
  loginState: LoginState.NotLoggedIn,
  socialProviders: [],
  oAuth2CallbackBasePath: "/auth/login/oauth2/complete/",
};

export function getExistingAuthState(overrideState: Partial<IAuthInnerState>) {
  const token = Cookies.getToken();
  const user = Cookies.getUser();
  const redirectPath = Cookies.getRedirectPath();

  return {
    ...DEFAULT_AUTH_STATE,
    token,
    user,
    loginState: !isNullOrUndefined(token) ? LoginState.LoggedIn : LoginState.NotLoggedIn,
    redirectPath,
    ...overrideState,
  };
}
