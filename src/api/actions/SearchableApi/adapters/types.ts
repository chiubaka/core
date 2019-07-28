import { IModelApiAdapter } from "../../ModelApi/adapters";
import { ApiAction } from "../../types";

export interface ISearchableModelApiAdapter<BackendType, FrontendType> extends
  IModelApiAdapter<BackendType, FrontendType> {
  search: (query: string) => ApiAction<FrontendType[]>;
}
