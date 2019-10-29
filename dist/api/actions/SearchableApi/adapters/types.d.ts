import { IModel } from "../../../../orm";
import { IModelApiAdapter } from "../../ModelApi/adapters";
import { ApiAction } from "../../types";
export interface ISearchableModelApiAdapter<BackendType extends IModel, FrontendType extends IModel> extends IModelApiAdapter<BackendType, FrontendType> {
    search: (query: string) => ApiAction<FrontendType[]>;
}
