import * as JsCookies from "js-cookie";
import { IUser } from "../../app/types/index";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";
export const REDIRECT_PATH_KEY = "redirectPath";

// TODO: Default value of 1 here, represents the 1 day value placed in the Django server code
// for auth token expiry. Would be great to not define this in both places...
export function setUser(user: IUser, expires: number = 1) {
  JsCookies.set(USER_KEY, user, { expires });
}

export function getUser(): IUser {
  return JsCookies.getJSON(USER_KEY) as IUser;
}

export function removeUser() {
  JsCookies.remove(USER_KEY);
}

export function setToken(token: string, expires: number = 1) {
  JsCookies.set(TOKEN_KEY, token, { expires });
}

export function getToken(): string {
  return JsCookies.get(TOKEN_KEY);
}

export function removeToken() {
  JsCookies.remove(TOKEN_KEY);
}

export function setRedirectPath(redirectPath: string) {
  return JsCookies.set(REDIRECT_PATH_KEY, redirectPath);
}

export function getRedirectPath() {
  return JsCookies.get(REDIRECT_PATH_KEY);
}

export function removeRedirectPath() {
  JsCookies.remove(REDIRECT_PATH_KEY);
}
