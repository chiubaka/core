
import { Api } from "../../../api/actions/Api";
import { IAuthState } from "../../model/AuthenticationState";
import { startLogin } from "../creators";
import { AuthDispatch as Dispatch, IAuthApiAdapter } from "../types";
import { RestApiAdapter } from "./RestApiAdapter";

export class AuthApi extends Api<IAuthApiAdapter> {
  constructor(adapter: IAuthApiAdapter = RestApiAdapter.getInstance()) {
    super(adapter);
  }

  public login(username: string, password: string) {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
      dispatch(startLogin());
      return this.getAdapter().login(username, password, dispatch, getState().auth);
    };
  }

  public socialLogin(provider: string, code: string, redirectUri: string) {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
      dispatch(startLogin());
      this.getAdapter().socialLogin(provider, code, redirectUri, dispatch, getState().auth);
    };
  }

  public logout() {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
      this.getAdapter().logout(dispatch, getState().auth);
    };
  }
}
