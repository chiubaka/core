import { ThunkDispatch } from "redux-thunk";
import { IAuthState } from "../../auth/model/AuthenticationState";
import { IModel } from "../model/";
import { Api, ApiAction } from "./Api";
export declare type Dispatch = ThunkDispatch<any, void, any>;
export declare class ModelApi<BackendType extends IModel, FrontendType extends IModel = BackendType> extends Api {
    private static API_PATH;
    SUCCESSFUL_GET_ALL_TYPE: string;
    SUCCESSFUL_GET_TYPE: string;
    SUCCESSFUL_CREATE_TYPE: string;
    SUCCESSFUL_UPDATE_TYPE: string;
    SUCCESSFUL_DELETE_TYPE: string;
    protected endpoint: string;
    private modelUpdateDependencies;
    constructor(modelName: string);
    getAll(): ApiAction<FrontendType[]>;
    get(id: string): ApiAction<FrontendType>;
    getListEndpoint(): string;
    getItemEndpoint(id: string): string;
    create(payload: Partial<FrontendType>): ApiAction<FrontendType>;
    update(original: FrontendType, updated: FrontendType): ApiAction<FrontendType>;
    createOrUpdate(original: Partial<FrontendType>, updated: Partial<FrontendType>): ApiAction<FrontendType>;
    delete(deleted: FrontendType): import("redux-thunk").ThunkAction<Promise<any>, IAuthState, void, any>;
    successfulGetAllAction(payload: FrontendType[]): {
        type: string;
        payload: FrontendType[];
    };
    successfulGetAction(payload: FrontendType): {
        type: string;
        payload: FrontendType;
    };
    successfulCreateAction(payload: FrontendType): {
        type: string;
        payload: FrontendType;
    };
    successfulUpdateAction(original: FrontendType, payload: FrontendType): {
        type: string;
        original: FrontendType;
        payload: FrontendType;
    };
    successfulDeleteAction(deleted: FrontendType): {
        type: string;
        deleted: FrontendType;
    };
    addModelUpdateDependency(idMapper: (data: FrontendType) => string[], dependentApiAction: (id: string) => ApiAction<any>, apiThisArg: Api): void;
    protected transformForFrontend(object: BackendType): FrontendType;
    protected transformForBackend(object: FrontendType): BackendType;
    protected bulkTransformForFrontend(objects: BackendType[]): FrontendType[];
    private processModelUpdateDependencies;
}
