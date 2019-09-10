import { IRestApiError, RestClient } from "../../api/clients/RestClient";
import { AuthDispatch as Dispatch } from "../actions/types";
export declare class AuthRestClient extends RestClient {
    static getInstance(): AuthRestClient;
    private static authSingleton;
    protected errorTransformer(_url: string, _error: IRestApiError): Promise<string>;
    protected handleUnsuccessfulRequest(reason: string, dispatch: Dispatch): void;
    protected handleApiResponse<T>(dispatch: Dispatch, response: Response): Promise<T | string>;
}
