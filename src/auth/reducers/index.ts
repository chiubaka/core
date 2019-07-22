import { Action } from "redux";
import { isNullOrUndefined } from "util";
import { ActionTypes, ICompleteLogin, ISetRedirect, ISuccessfulGetUserDetails } from "../actions/index";
import { DEFAULT_AUTH_STATE, IAuthInnerState, LoginState } from "../model/AuthenticationState";
import * as Cookies from "../utils/storage";

export function auth(state: IAuthInnerState | undefined = DEFAULT_AUTH_STATE, action: Action) {
  switch (action.type) {
    case ActionTypes.START_LOGIN:
      return {...state, loginState: LoginState.LoggingIn};
    case ActionTypes.COMPLETE_LOGIN:
      const token = (action as ICompleteLogin).token;
      Cookies.setToken(token);
      return {...state, loginState: !isNullOrUndefined(token) ? LoginState.LoggedIn : LoginState.NotLoggedIn, token};
    case ActionTypes.SUCCESSFUL_GET_USER_DETAILS:
      const user = (action as ISuccessfulGetUserDetails).user;
      Cookies.setUser(user);
      return {...state, user};
    case ActionTypes.START_LOGOUT:
      return {...state, loginState: LoginState.LoggingOut};
    case ActionTypes.FAIL_LOGIN:
    case ActionTypes.COMPLETE_LOGOUT:
      Cookies.removeToken();
      Cookies.removeUser();
      return {...state, token: undefined, user: undefined, loginState: LoginState.NotLoggedIn};
    case ActionTypes.SET_REDIRECT:
      const redirectPath = (action as ISetRedirect).redirectPath;
      Cookies.setRedirectPath(redirectPath);
      return {...state, redirectPath};
    case ActionTypes.CLEAR_REDIRECT:
      Cookies.removeRedirectPath();
      return {...state, redirectPath: undefined};
    default:
      return state;
  }
}
