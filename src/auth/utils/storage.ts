import * as moment from "moment";
import { isNullOrUndefined } from "util";
import { IUser } from "../../app/types/index";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";
export const REDIRECT_PATH_KEY = "redirectPath";

// TODO: Default value of 1 here, represents the 1 day value placed in the Django server code
// for auth token expiry. Would be great to not define this in both places...
export function setUser(user: IUser, expires: number = 1) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  set(USER_KEY, user, expires);
}

export function getUser(): IUser {
  return get(USER_KEY) as IUser;
}

export function removeUser() {
  remove(USER_KEY);
}

export function setToken(token: string, expires: number = 1) {
  set(TOKEN_KEY, token, expires);
}

export function getToken(): string {
  return get(TOKEN_KEY);
}

export function removeToken() {
  remove(TOKEN_KEY);
}

export function setRedirectPath(redirectPath: string) {
  set(REDIRECT_PATH_KEY, redirectPath);
}

export function getRedirectPath() {
  return get(REDIRECT_PATH_KEY);
}

export function removeRedirectPath() {
  remove(REDIRECT_PATH_KEY);
}

interface IStorageContainer {
  createdAt: string;
  expires: number;
  data: any;
}

function set(key: string, data: any, expires?: number) {
  const container = {
    createdAt: moment().format(),
    expires,
    data,
  };
  localStorage.setItem(key, JSON.stringify(container));
}

function get(key: string): any {
  const item = localStorage.getItem(key);

  if (isNullOrUndefined(item)) {
    return null;
  }

  const container: IStorageContainer = JSON.parse(item);
  // If expired, return null
  const { createdAt, expires, data } = container;
  if (!expires || moment().isBefore(moment(createdAt).add(expires, "days"))) {
    return data;
  } else {
    localStorage.removeItem(key);
    return null;
  }
}

function remove(key: string) {
  localStorage.removeItem(key);
}
