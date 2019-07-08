import { AuthDispatch as Dispatch } from "../../auth/actions/types";
import { ApiAction } from "../actions/types";
export declare type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export declare type RestApiSuccessCallback<T> = (dispatch: Dispatch, response: T) => void;
export declare type ResponseTransformer<BackendType, FrontendType> = (response: BackendType) => FrontendType;
export declare type PayloadTransformer<BackendType, FrontendType> = (payload: FrontendType) => BackendType;
export interface IRestApiError {
    [field: string]: string[];
}
export declare class RestClient {
    static getInstance(): RestClient;
    private static singleton;
    static apiHeaders(accessToken: string, authPrefix?: string): Headers;
    static encodeUrlParams(payload: any): string;
    protected errorTransformer(_url: string, error: IRestApiError): Promise<string>;
    protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch): void;
    actionCreator<FrontendPayloadT, BackendPayloadT = FrontendPayloadT, BackendResponseT = BackendPayloadT, FrontendResponseT = BackendResponseT>(pathname: string, payload: FrontendPayloadT, method: HttpMethod, onSuccess: RestApiSuccessCallback<FrontendResponseT>, payloadTransformer?: PayloadTransformer<BackendPayloadT, FrontendPayloadT>, responseTransformer?: ResponseTransformer<BackendResponseT, FrontendResponseT>): ApiAction<FrontendResponseT>;
    getRequest<T>(pathname: string, payload: T, dispatch: Dispatch, token: string): Promise<any>;
    postRequest<T>(pathname: string, payload: T, dispatch: Dispatch, token: string): Promise<any>;
    putRequest<T>(pathname: string, payload: T, dispatch: Dispatch, token: string): Promise<any>;
    deleteRequest(pathname: string, dispatch: Dispatch, token: string): Promise<any>;
    protected handleApiResponse<T>(dispatch: Dispatch, response: Response): Promise<T | string>;
    private requestWithPayload;
    private request;
}
