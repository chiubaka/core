import { ActionTypes, AuthAction, ICompleteLogin, ISetRedirect } from "../actions/index";
import { DEFAULT_AUTH_STATE, IAuthInnerState, LoginState } from "../model/AuthenticationState";
import Cookies from "../utils/cookies";

const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SECONDS_IN_DAY = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;

export function auth(state: IAuthInnerState = DEFAULT_AUTH_STATE, action: AuthAction) {
  switch (action.type) {
    case ActionTypes.START_LOGIN:
      return {...state, loginState: LoginState.LoggingIn};
    case ActionTypes.COMPLETE_LOGIN:
      const completeLogin = (action as ICompleteLogin);
      // Backend returns expiration in seconds, while front-end cookie framework takes expiration in days
      Cookies.setAccessToken(completeLogin.accessToken, completeLogin.expires / SECONDS_IN_DAY);
      return {...state, loginState: LoginState.LoggedIn, accessToken: completeLogin.accessToken};
    case ActionTypes.FAIL_LOGIN:
      return {...state, loginState: LoginState.NotLoggedIn};
    case ActionTypes.START_LOGOUT:
      return {...state, loginState: LoginState.LoggingOut};
    case ActionTypes.COMPLETE_LOGOUT:
      Cookies.removeAccessToken();
      return {...state, accessToken: undefined, loginState: LoginState.NotLoggedIn};
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
