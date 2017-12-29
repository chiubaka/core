import { Action, Dispatch } from "redux";
// This import will remap the typing for Dispatch so it's more tolerant of passing functions
import "redux-thunk";
import { IUser, IUserResponse } from "../../types/index";
import { IAuthState } from "./../model/AuthenticationState";

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

function startLogin() {
  return {
    type: ActionTypes.START_LOGIN,
  };
}

export interface ICompleteLogin extends Action {
  user: IUser;
}

// TODO: rest-social-auth documentation doesn't reference a token expiration parameter, but I should find and set one
function completeLogin(user: IUser): ICompleteLogin {
  return {
    type: ActionTypes.COMPLETE_LOGIN,
    user,
  };
}

export interface IFailLogin extends Action {
  error: string;
}

function failLogin(error: string): IFailLogin {
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

export function login(provider: string, code: string, redirectUri: string) {
  return (dispatch: Dispatch<IAuthState>) => {
    dispatch(startLogin());
    return fetch("/api/login/social/jwt_user/", {
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
      .then((response: IUserResponse) => {
        const user: IUser = {
          id: response.id,
          token: response.token,
          username: response.username,
          email: response.email,
          firstName: response.first_name,
          lastName: response.last_name,
        };
        dispatch(completeLogin(user));
      })
      .catch((error) => {
        // TODO: /auth/login should be a variable somewhere
        return dispatch(failLogin(error));
      });
  };
}
