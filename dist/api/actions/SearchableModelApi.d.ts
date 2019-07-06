import { IModel } from "../model/";
import { ApiAction } from "./Api";
import { ModelApi } from "./ModelApi";
export declare class SearchableModelApi<BackendType extends IModel, FrontendType extends IModel = BackendType> extends ModelApi<BackendType, FrontendType> {
    SUCCESSFUL_SEARCH_TYPE: string;
    constructor(modelName: string);
    search(query: string): ApiAction<FrontendType[]>;
    getSearchEndpoint(): string;
    successfulSearchAction(payload: FrontendType[]): {
        type: string;
        payload: FrontendType[];
    };
}
