import { IModel } from "../../../orm";
import { Dispatch } from "../../../types";
import { Api } from "../Api";
import { ApiAction } from "../types";
import { IModelApiAdapter } from "./adapters";
export declare class ModelApi<BackendType extends IModel, FrontendType extends IModel = BackendType> extends Api<IModelApiAdapter<BackendType, FrontendType>> {
    SUCCESSFUL_GET_ALL_TYPE: string;
    SUCCESSFUL_GET_TYPE: string;
    SUCCESSFUL_CREATE_TYPE: string;
    SUCCESSFUL_UPDATE_TYPE: string;
    SUCCESSFUL_DELETE_TYPE: string;
    protected endpoint: string;
    private modelUpdateDependencies;
    constructor(modelName: string, adapter?: IModelApiAdapter<BackendType, FrontendType>);
    getAll(): ApiAction<FrontendType[]>;
    get(id: string): ApiAction<FrontendType>;
    create(payload: Partial<FrontendType>): ApiAction<FrontendType>;
    update(original: FrontendType, updated: FrontendType): ApiAction<FrontendType>;
    createOrUpdate(original: Partial<FrontendType>, updated: Partial<FrontendType>): ApiAction<FrontendType>;
    delete(deleted: FrontendType): import("redux-thunk").ThunkAction<Promise<unknown>, import("../../..").IAuthState, void, any>;
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
    addModelUpdateDependency(idMapper: (data: FrontendType) => string[], dependentApiAction: (id: string) => ApiAction<any>, apiThisArg: Api<IModelApiAdapter<BackendType, FrontendType>>): void;
    transformForFrontend(object: BackendType): FrontendType;
    transformForBackend(object: FrontendType): BackendType;
    bulkTransformForFrontend(objects: BackendType[]): FrontendType[];
    processModelUpdateDependencies(dispatch: Dispatch, modelObject: FrontendType): void;
}
