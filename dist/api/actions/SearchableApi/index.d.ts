import { IModel } from "../../../app";
import { ModelApi } from "../ModelApi";
import { ApiAction } from "../types";
import { ISearchableModelApiAdapter } from "./adapters";
export declare class SearchableModelApi<BackendType extends IModel, FrontendType extends IModel = BackendType> extends ModelApi<BackendType, FrontendType> {
    SUCCESSFUL_SEARCH_TYPE: string;
    constructor(modelName: string, adapter?: ISearchableModelApiAdapter<BackendType, FrontendType>);
    search(query: string): ApiAction<FrontendType[]>;
    successfulSearchAction(payload: FrontendType[]): {
        type: string;
        payload: FrontendType[];
    };
    protected getAdapter(): ISearchableModelApiAdapter<BackendType, FrontendType>;
}
