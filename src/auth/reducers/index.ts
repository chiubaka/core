import { Action } from "redux";
import { ActionTypes, ICompleteLogin, ISetRedirect } from "../actions/index";
import { DEFAULT_AUTH_STATE, IAuthInnerState, LoginState } from "../model/AuthenticationState";
import * as Cookies from "../utils/cookies";

export function auth(state: IAuthInnerState = DEFAULT_AUTH_STATE, action: Action) {
  switch (action.type) {
    case ActionTypes.START_LOGIN:
      return {...state, loginState: LoginState.LoggingIn};
    case ActionTypes.COMPLETE_LOGIN:
      const user = (action as ICompleteLogin).user;
      Cookies.setUser(user);
      return {...state, loginState: LoginState.LoggedIn, user};
    case ActionTypes.FAIL_LOGIN:
      return {...state, loginState: LoginState.NotLoggedIn};
    case ActionTypes.START_LOGOUT:
      return {...state, loginState: LoginState.LoggingOut};
    case ActionTypes.COMPLETE_LOGOUT:
      Cookies.removeUser();
      return {...state, user: undefined, loginState: LoginState.NotLoggedIn};
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
