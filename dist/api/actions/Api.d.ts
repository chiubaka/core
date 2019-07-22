import { ThunkAction } from "redux-thunk";
import { AuthDispatch as Dispatch } from "../../auth/actions/types";
import { IAuthState } from "../../auth/model/AuthenticationState";
export declare type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export declare type ApiSuccessCallback<T> = (dispatch: Dispatch, response: T) => void;
export declare type ApiAction<T> = ThunkAction<Promise<T>, IAuthState, void, any>;
export declare type ResponseTransformer<BackendType, FrontendType> = (response: BackendType) => FrontendType;
export declare type PayloadTransformer<BackendType, FrontendType> = (payload: FrontendType) => BackendType;
export interface IApiError {
    [field: string]: string[];
}
export declare class Api {
    static UNSUCCESSFUL_API_REQUEST_TYPE: string;
    static unsuccessfulRequest(reason: string): {
        type: string;
        reason: string;
    };
    static apiHeaders(accessToken: string, authPrefix?: string): Headers;
    static encodeUrlParams(payload: any): string;
    protected errorTransformer(_url: string, error: IApiError): Promise<string>;
    protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch): void;
    protected actionCreator<FrontendPayloadT, BackendPayloadT = FrontendPayloadT, BackendResponseT = BackendPayloadT, FrontendResponseT = BackendResponseT>(pathname: string, payload: FrontendPayloadT, method: HttpMethod, onSuccess: ApiSuccessCallback<FrontendResponseT>, payloadTransformer?: PayloadTransformer<BackendPayloadT, FrontendPayloadT>, responseTransformer?: ResponseTransformer<BackendResponseT, FrontendResponseT>): ApiAction<FrontendResponseT>;
    protected getRequest<T>(pathname: string, payload: T, dispatch: Dispatch, token: string): Promise<any>;
    protected postRequest<T>(pathname: string, payload: T, dispatch: Dispatch, token: string): Promise<any>;
    protected putRequest<T>(pathname: string, payload: T, dispatch: Dispatch, token: string): Promise<any>;
    protected deleteRequest(pathname: string, dispatch: Dispatch, token: string): Promise<any>;
    protected handleApiResponse<T>(dispatch: Dispatch, response: Response): Promise<T | string>;
    private requestWithPayload;
    private request;
}
