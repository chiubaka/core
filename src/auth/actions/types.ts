import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { IUser } from "../../app/types";
import { IAuthInnerState, IAuthState } from "../model";

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

export interface ICompleteLogin extends Action {
  token: string;
}

export interface ISuccessfulGetUserDetails extends Action {
  user: IUser;
}

export interface IFailLogin extends Action {
  error: string;
}

export interface ISetRedirect extends Action {
  redirectPath: string;
}

export declare type AuthAction = Action | ICompleteLogin | ISuccessfulGetUserDetails | IFailLogin | ISetRedirect;
export declare type AuthDispatch = ThunkDispatch<IAuthState, void, AuthAction>;

export interface IAuthApiAdapter {
  login?: (username: string, password: string, dispatch: AuthDispatch, authState: IAuthInnerState) => Promise<any>;
  socialLogin?: (
    provider: string,
    code: string,
    redirectUri: string,
    dispatch: AuthDispatch,
    authState: IAuthInnerState,
  ) => Promise<any>;
  socialLoginAccessToken?: (
    provider: string,
    accessToken: string,
    dispatch: AuthDispatch,
    authState: IAuthInnerState,
  ) => Promise<any>;
  logout: (dispatch: AuthDispatch, authState: IAuthInnerState) => Promise<any>;
}
