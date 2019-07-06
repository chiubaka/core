import { Api, IApiError } from "../../api/actions/Api";
import { IAuthState } from "../model/AuthenticationState";
import { AuthDispatch as Dispatch } from "./types";
export declare class AuthApi extends Api {
    static getInstance(): AuthApi;
    private static singleton;
    private static userFromJwtUserResponse;
    login(username: string, password: string): (dispatch: import("redux-thunk").ThunkDispatch<IAuthState, void, import("./types").AuthAction>, getState: () => IAuthState) => Promise<void>;
    socialLogin(provider: string, code: string, redirectUri: string): (dispatch: import("redux-thunk").ThunkDispatch<IAuthState, void, import("./types").AuthAction>, getState: () => IAuthState) => Promise<void>;
    logout(): (dispatch: import("redux-thunk").ThunkDispatch<IAuthState, void, import("./types").AuthAction>, getState: () => IAuthState) => Promise<void>;
    protected errorTransformer(_url: string, _error: IApiError): Promise<string>;
    protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch): void;
    protected handleApiResponse<T>(dispatch: Dispatch, response: Response): Promise<T | string>;
}
