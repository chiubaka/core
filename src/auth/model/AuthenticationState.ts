import { ISocialLoginProvider, IUser } from "../../app/types/index";
import * as Cookies from "../utils/storage";

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
  token?: string;
  user?: IUser;
  loginState: LoginState;
  oAuth2CallbackBasePath: string;
  providers: ISocialLoginProvider[];
  enableUsernameLogin: boolean;
  redirectPath?: string;
}

export const DEFAULT_AUTH_STATE: IAuthInnerState = {
  enableUsernameLogin: false,
  loginState: LoginState.NotLoggedIn,
  providers: [],
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
    loginState: token ? LoginState.LoggedIn : LoginState.NotLoggedIn,
    redirectPath,
    ...overrideState,
  };
}
