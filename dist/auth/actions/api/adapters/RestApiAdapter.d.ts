import { RestClient } from "../../../../api/clients/RestClient";
import { IAuthInnerState } from "../../../model";
import { IAuthApiAdapter } from "../../types";
export declare class RestApiAdapter implements IAuthApiAdapter {
    static getInstance(): RestApiAdapter;
    private static singleton;
    private static userFromJwtUserResponse;
    private client;
    constructor(client?: RestClient);
    login: (username: string, password: string, dispatch: import("redux-thunk").ThunkDispatch<import("../../../model").IAuthState, void, import("../../types").AuthAction>, authState: IAuthInnerState) => Promise<void>;
    socialLogin: (provider: string, code: string, redirectUri: string, dispatch: import("redux-thunk").ThunkDispatch<import("../../../model").IAuthState, void, import("../../types").AuthAction>, authState: IAuthInnerState) => Promise<void>;
    logout: (dispatch: import("redux-thunk").ThunkDispatch<import("../../../model").IAuthState, void, import("../../types").AuthAction>, authState: IAuthInnerState) => Promise<void>;
}
