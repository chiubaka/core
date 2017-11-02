import { AuthState } from './../model/AuthenticationState';
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
  START_LOGOUT: type<"START_LOGOUT">("START_LOGOUT"),
  COMPLETE_LOGOUT: type<"COMPLETE_LOGOUT">("COMPLETE_LOGOUT")
};

export type AuthAction = StartLogin | CompleteLogin | StartLogout | CompleteLogout;

export interface StartLogin extends Action {};

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

export interface StartLogout extends Action {};

function startLogout() {
  return {
    type: ActionTypes.START_LOGOUT
  };
}

export interface CompleteLogout extends Action {};

function completeLogout() {
  return {
    type: ActionTypes.COMPLETE_LOGOUT
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
        console.log(response);
        return dispatch(completeLogin(response.token))
      });
  }
}

// TODO: Not sure what the right endpoints on the server are
// export function logout(accessToken: string) {
//   return (dispatch: Dispatch<AuthState>) => {
//     dispatch(startLogout());
//     return fetch("/api/auth/revoke-token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//       },
//       body: `client_id=${OAUTH_CLIENT_ID}&client_secret=${OAUTH_CLIENT_SECRET}&token=${accessToken}`
//     })
//       .then(() => {
//         dispatch(completeLogout());
//       });
//   }
// }