import { SearchableModelApi } from "../";
import { IModel } from "../../../../app";
import { RestApiAdapter as RestModelApiAdapter } from "../../ModelApi/adapters";
import { ISearchableModelApiAdapter } from "./types";
export declare class RestApiAdapter<BackendType extends IModel, FrontendType extends IModel> extends RestModelApiAdapter<BackendType, FrontendType> implements ISearchableModelApiAdapter<BackendType, FrontendType> {
    protected api: SearchableModelApi<BackendType, FrontendType>;
    search: (query: string) => import("redux-thunk").ThunkAction<Promise<FrontendType[]>, import("../../../..").IAuthState, void, any>;
    private getSearchEndpoint;
}
