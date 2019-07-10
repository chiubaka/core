import * as pluralize from "pluralize";

import { IModel } from "../../../orm";
import { ModelApi } from "../ModelApi";
import { ApiAction } from "../types";
import { ISearchableModelApiAdapter, RestApiAdapter } from "./adapters";

export class SearchableModelApi<BackendType extends IModel, FrontendType extends IModel = BackendType>
  extends ModelApi<BackendType, FrontendType> {
  public SUCCESSFUL_SEARCH_TYPE: string;

  constructor(modelName: string, adapter?: ISearchableModelApiAdapter<BackendType, FrontendType>) {
    adapter = adapter || new RestApiAdapter(modelName);
    super(modelName, adapter);

    this.SUCCESSFUL_SEARCH_TYPE = `SUCCESSFUL_SEARCH_${pluralize(modelName.toUpperCase())}`;
  }

  public search(query: string): ApiAction<FrontendType[]> {
    return this.getAdapter().search(query);
  }

  public successfulSearchAction(payload: FrontendType[]) {
    return {
      type: this.SUCCESSFUL_SEARCH_TYPE,
      payload,
    };
  }

  protected getAdapter(): ISearchableModelApiAdapter<BackendType, FrontendType> {
    return super.getAdapter() as ISearchableModelApiAdapter<BackendType, FrontendType>;
  }
}
