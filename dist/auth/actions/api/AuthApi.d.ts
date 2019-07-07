import { Api } from "../../../api/actions/Api";
import { IAuthState } from "../../model/AuthenticationState";
import { IAuthApiAdapter } from "../types";
export declare class AuthApi extends Api<IAuthApiAdapter> {
    constructor(adapter?: IAuthApiAdapter);
    login(username: string, password: string): (dispatch: import("redux-thunk").ThunkDispatch<IAuthState, void, import("../types").AuthAction>, getState: () => IAuthState) => Promise<any>;
    socialLogin(provider: string, code: string, redirectUri: string): (dispatch: import("redux-thunk").ThunkDispatch<IAuthState, void, import("../types").AuthAction>, getState: () => IAuthState) => Promise<any>;
    socialLoginAccessToken(provider: string, token: string): (dispatch: import("redux-thunk").ThunkDispatch<IAuthState, void, import("../types").AuthAction>, getState: () => IAuthState) => Promise<any>;
    logout(): (dispatch: import("redux-thunk").ThunkDispatch<IAuthState, void, import("../types").AuthAction>, getState: () => IAuthState) => Promise<any>;
    private unimplementedError;
}
