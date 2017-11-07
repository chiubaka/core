import { AuthState } from './../model/AuthenticationState';
import { push } from "react-router-redux";
import { Action, Dispatch } from "redux";
// This import will remap the typing for Dispatch so it's more tolerant of passing functions
import "redux-thunk";
import { IUser } from "../../types/index";

const typeCache: { [label: string]: boolean } = {};

function type<T>(label: T | ""): T {
	if (typeCache[<string>label]) {
		throw new Error(`Action type "${label}" is not unique`);
	}

	typeCache[<string>label] = true;

	return <T>label;
}

export const ActionTypes = {
  START_LOGIN: type<"START_LOGIN">("START_LOGIN"),
  COMPLETE_LOGIN: type<"COMPLETE_LOGIN">("COMPLETE_LOGIN"),
  FAIL_LOGIN: type<"FAIL_LOGIN">("FAIL_LOGIN"),
  START_LOGOUT: type<"START_LOGOUT">("START_LOGOUT"),
  COMPLETE_LOGOUT: type<"COMPLETE_LOGOUT">("COMPLETE_LOGOUT"),
  SET_REDIRECT: type<"SET_REDIRECT">("SET_REDIRECT"),
  CLEAR_REDIRECT: type<"CLEAR_REDIRECT">("CLEAR_REDIRECT"),
};

export type AuthAction = StartLogin | CompleteLogin | StartLogout | CompleteLogout;

export interface StartLogin extends Action {}

function startLogin() {
  return {
    type: ActionTypes.START_LOGIN
  }
}

export interface CompleteLogin extends Action {
  accessToken: string;
  expires: number;
}

// TODO: rest-social-auth documentation doesn't reference a token expiration parameter, but I should find and set one
function completeLogin(accessToken: string) {
  return {
    type: ActionTypes.COMPLETE_LOGIN,
    accessToken,
  };
}

export interface FailLogin extends Action {
  error: string;
}

function failLogin(error: string): FailLogin {
  return {
    type: ActionTypes.FAIL_LOGIN,
    error
  };
}

export interface StartLogout extends Action {}

function startLogout(): StartLogout {
  return {
    type: ActionTypes.START_LOGOUT
  };
}

export interface CompleteLogout extends Action {}

export function completeLogout(): CompleteLogout {
  return {
    type: ActionTypes.COMPLETE_LOGOUT
  };
}

export interface SetRedirect extends Action {
  redirectPath: string;
}

export function setRedirect(redirectPath: string): SetRedirect {
  return {
    type: ActionTypes.SET_REDIRECT,
    redirectPath
  };
}

export interface ClearRedirect extends Action {}

export function clearRedirect(): ClearRedirect {
  return {
    type: ActionTypes.CLEAR_REDIRECT
  };
}

export function login(provider: string, code: string, redirectUri: string) {
  return (dispatch: Dispatch<AuthState>) => {
    dispatch(startLogin());
    return fetch("/api/login/social/jwt/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        provider,
        code,
        redirect_uri: redirectUri
      })
    })
      .then(response => response.json())
      .then((response: IUser) => {
        dispatch(completeLogin(response.token));
      })
      .catch((error) => {
        // TODO: /auth/login should be a variable somewhere
        return dispatch(failLogin(error));
      });
  }
}

// Since we're using JWT, login/logout state is not held by the server. The logout process
// can be handled entirely client-side by destroying the JWT token and changing the app
// state.
// export function logout() {
//   return (dispatch: Dispatch<AuthState>) => {
//     dispatch(completeLogout());
//     //dispatch(push("/"));
//   };
// }