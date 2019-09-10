import { IModel } from "../../../../orm";
import { ApiAction } from "../../types";
import { ModelApi } from "../ModelApi";
export interface IModelApiAdapter<BackendType extends IModel, FrontendType extends IModel> {
    getAll: () => ApiAction<FrontendType[]>;
    get: (id: string) => ApiAction<FrontendType>;
    create: (payload: Partial<FrontendType>) => ApiAction<FrontendType>;
    update: (original: FrontendType, updated: FrontendType) => ApiAction<FrontendType>;
    delete: (deleted: FrontendType) => ApiAction<unknown>;
    setApi: (api: ModelApi<BackendType, FrontendType>) => void;
}
