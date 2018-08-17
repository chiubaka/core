import { push } from "react-router-redux";
import { Action, Dispatch } from "redux";
// This import will remap the typing for Dispatch so it's more tolerant of passing functions
import "redux-thunk";

import { IUser } from "../../app/types/index";
import { IAuthState } from "../model/AuthenticationState";

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
  SUCCESSFUL_GET_USER_DETAILS: type<"SUCCESSFUL_GET_USER_DETAILS">("SUCCESSFUL_GET_USER_DETAILS"),
  FAIL_LOGIN: type<"FAIL_LOGIN">("FAIL_LOGIN"),
  START_LOGOUT: type<"START_LOGOUT">("START_LOGOUT"),
  COMPLETE_LOGOUT: type<"COMPLETE_LOGOUT">("COMPLETE_LOGOUT"),
  SET_REDIRECT: type<"SET_REDIRECT">("SET_REDIRECT"),
  CLEAR_REDIRECT: type<"CLEAR_REDIRECT">("CLEAR_REDIRECT"),
};

export function startLogin() {
  return {
    type: ActionTypes.START_LOGIN,
  };
}

export interface ICompleteLogin extends Action {
  token: string;
}

// Performs the deletion of the JWT token before redirecting the user back out to the login page.
// NOTE: In almost all cases you want AuthApi.getInstance().logout() instead. That method also
// handles hitting the API backend to revoke the JWT token as an extra precaution.
export function completeLogoutAndRedirect() {
  return (dispatch: Dispatch<IAuthState>, getState: () => IAuthState) => {
    dispatch(completeLogout());
    dispatch(push("/auth/login", {
      // TODO: This path should be configurable.
      redirectPath: "/app",
    }));
  };
}

// TODO: rest-social-auth documentation doesn't reference a token expiration parameter, but I should find and set one
export function completeLogin(token: string): ICompleteLogin {
  return {
    type: ActionTypes.COMPLETE_LOGIN,
    token,
  };
}

export interface ISuccessfulGetUserDetails extends Action {
  user: IUser;
}

export function successfulGetUserDetails(user: IUser) {
  return {
    type: ActionTypes.SUCCESSFUL_GET_USER_DETAILS,
    user,
  };
}

export interface IFailLogin extends Action {
  error: string;
}

export function failLogin(error: string): IFailLogin {
  return {
    type: ActionTypes.FAIL_LOGIN,
    error,
  };
}

export function completeLogout(): Action {
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

export function clearRedirect(): Action {
  return {
    type: ActionTypes.CLEAR_REDIRECT,
  };
}
