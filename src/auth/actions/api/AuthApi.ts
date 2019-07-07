
import { Api } from "../../../api/actions/Api";
import { IAuthState } from "../../model/AuthenticationState";
import { startLogin } from "../creators";
import { AuthDispatch as Dispatch, IAuthApiAdapter } from "../types";
import { RestApiAdapter } from "./adapters/RestApiAdapter";

export class AuthApi extends Api<IAuthApiAdapter> {
  constructor(adapter: IAuthApiAdapter = RestApiAdapter.getInstance()) {
    super(adapter);
  }

  public login(username: string, password: string) {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
      const adapter = this.getAdapter();
      if (adapter.socialLoginAccessToken == null) {
        this.unimplementedError("login");
        return;
      }
      
      dispatch(startLogin());
      return adapter.login(username, password, dispatch, getState().auth);
    };
  }

  public socialLogin(provider: string, code: string, redirectUri: string) {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
      const adapter = this.getAdapter();
      if (adapter.socialLoginAccessToken == null) {
        this.unimplementedError("socialLogin");
        return;
      }
      
      dispatch(startLogin());
      return adapter.socialLogin(provider, code, redirectUri, dispatch, getState().auth);
    };
  }

  public socialLoginAccessToken(provider: string, token: string) {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
      const adapter = this.getAdapter();
      if (adapter.socialLoginAccessToken == null) {
        this.unimplementedError("socialLoginAccessToken");
        return;
      }

      dispatch(startLogin());
      return adapter.socialLoginAccessToken(provider, token, dispatch, getState().auth);
    }
  }

  public logout() {
    return (dispatch: Dispatch, getState: () => IAuthState) => {
      return this.getAdapter().logout(dispatch, getState().auth);
    };
  }

  private unimplementedError(methodName: string) {
    console.error(`AuthApi adapter does not implement ${methodName}! Implement this method or use a different adapter.`);
  }
}
