import { ModelApi } from "../";
import { IModel } from "../../../../orm";
import { RestClient } from "../../../clients/RestClient";
import { IModelApiAdapter } from "./types";
export declare class RestApiAdapter<BackendType extends IModel, FrontendType extends IModel = BackendType> implements IModelApiAdapter<BackendType, FrontendType> {
    private static API_PATH;
    protected endpoint: string;
    protected api: ModelApi<BackendType, FrontendType>;
    protected client: RestClient;
    constructor(modelName: string, client?: RestClient);
    setApi(api: ModelApi<BackendType, FrontendType>): void;
    getAll: () => import("redux-thunk").ThunkAction<Promise<FrontendType[]>, import("../../../..").IAuthState, void, any>;
    get: (id: string) => import("redux-thunk").ThunkAction<Promise<FrontendType>, import("../../../..").IAuthState, void, any>;
    create: (payload: Partial<FrontendType>) => import("redux-thunk").ThunkAction<Promise<FrontendType>, import("../../../..").IAuthState, void, any>;
    update: (original: FrontendType, updated: FrontendType) => import("redux-thunk").ThunkAction<Promise<FrontendType>, import("../../../..").IAuthState, void, any>;
    delete: (deleted: FrontendType) => import("redux-thunk").ThunkAction<Promise<unknown>, import("../../../..").IAuthState, void, any>;
    private getListEndpoint;
    private getItemEndpoint;
}
