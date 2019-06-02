import { Action } from "redux";

import { IUser } from "../../app/types/index";
import { ActionTypes, ICompleteLogin, IFailLogin, ISetRedirect, ISuccessfulGetUserDetails } from "./types";

export function startLogin() {
  return {
    type: ActionTypes.START_LOGIN,
  };
}

// TODO: rest-social-auth documentation doesn't reference a token expiration parameter, but I should find and set one
export function completeLogin(token: string): ICompleteLogin {
  return {
    type: ActionTypes.COMPLETE_LOGIN,
    token,
  };
}

export function successfulGetUserDetails(user: IUser): ISuccessfulGetUserDetails {
  return {
    type: ActionTypes.SUCCESSFUL_GET_USER_DETAILS,
    user,
  };
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
