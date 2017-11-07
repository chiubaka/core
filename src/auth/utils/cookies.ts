import * as JsCookies from "js-cookie";

export namespace Cookies {
  export const ACCESS_TOKEN_KEY = "accessToken";
  export const REDIRECT_PATH_KEY = "redirectPath";

  export function setAccessToken(accessToken: string, expires: number) {
    console.log(`Access Token expires in: ${expires}`);
    JsCookies.set(ACCESS_TOKEN_KEY, accessToken, { expires });
  }

  export function getAccessToken() {
    return JsCookies.get(ACCESS_TOKEN_KEY);
  }

  export function removeAccessToken() {
    JsCookies.remove(ACCESS_TOKEN_KEY);
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
}

export default Cookies;
