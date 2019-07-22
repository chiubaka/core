import { push } from "connected-react-router";

import { IAuthState } from "../model";
import { completeLogout } from "./creators";
import { AuthDispatch as Dispatch } from "./types";

// Performs the deletion of the JWT token before redirecting the user back out to the login page.
// NOTE: In almost all cases you want AuthApi.getInstance().logout() instead. That method also
// handles hitting the API backend to revoke the JWT token as an extra precaution.
export function completeLogoutAndRedirect() {
  return (dispatch: Dispatch, getState: () => IAuthState) => {
    dispatch(completeLogout());
    dispatch(push("/auth/login", {
      // TODO: This path should be configurable.
      redirectPath: "/app",
    }));
  };
}
