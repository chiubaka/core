import { Action, Dispatch } from "redux";
// This import will remap the typing for Dispatch so it's more tolerant of passing functions
import "redux-thunk";
import { IUser } from "../../types/index";
import { AuthState } from "./../model/AuthenticationState";

const typeCache: { [label: string]: boolean } = {};

function type<T>(label: T | ""): T {
	if (typeCache[label as string]) {
		throw new Error(`Action type "${label}" is not unique`);
	}

	typeCache[label as string] = true;

	return label as T;
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

export type AuthAction = IStartLogin | ICompleteLogin | IStartLogout | ICompleteLogout;

export interface IStartLogin extends Action {}

function startLogin() {
  return {
    type: ActionTypes.START_LOGIN,
  };
}

export interface ICompleteLogin extends Action {
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
    error,
  };
}

export interface IStartLogout extends Action {}

function startLogout(): IStartLogout {
  return {
    type: ActionTypes.START_LOGOUT,
  };
}

export interface ICompleteLogout extends Action {}

export function completeLogout(): ICompleteLogout {
  return {
    type: ActionTypes.COMPLETE_LOGOUT,
  };
}

export interface ISetRedirect extends Action {
  redirectPath: string;
}

export function setRedirect(redirectPath: string): ISetRedirect {
  return {
    type: ActionTypes.SET_REDIRECT,
    redirectPath,
  };
}

export interface IClearRedirect extends Action {}

export function clearRedirect(): IClearRedirect {
  return {
    type: ActionTypes.CLEAR_REDIRECT,
  };
}

export function login(provider: string, code: string, redirectUri: string) {
  return (dispatch: Dispatch<AuthState>) => {
    dispatch(startLogin());
    return fetch("/api/login/social/jwt/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider,
        code,
        redirect_uri: redirectUri,
      }),
    })
      .then((response) => response.json())
      .then((response: IUser) => {
        dispatch(completeLogin(response.token));
      })
      .catch((error) => {
        // TODO: /auth/login should be a variable somewhere
        return dispatch(failLogin(error));
      });
  };
}