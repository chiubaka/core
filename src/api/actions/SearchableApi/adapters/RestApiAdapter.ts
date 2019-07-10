import { SearchableModelApi } from "../";
import { IModel } from "../../../../app";
import { RestApiAdapter as RestModelApiAdapter } from "../../ModelApi/adapters";
import { ISearchableModelApiAdapter } from "./types";

export class RestApiAdapter<
  BackendType extends IModel,
  FrontendType extends IModel,
> extends RestModelApiAdapter<
  BackendType,
  FrontendType
> implements ISearchableModelApiAdapter<BackendType, FrontendType> {
  protected api: SearchableModelApi<BackendType, FrontendType>;

  public search = (query: string) => {
    const payload = {
      query,
    };
    return this.client.actionCreator(this.getSearchEndpoint(), payload, "GET", (dispatch, response: FrontendType[]) => {
      dispatch(this.api.successfulSearchAction(response));
    }, null, this.api.bulkTransformForFrontend);
  }

  private getSearchEndpoint() {
    return `${this.endpoint}search/`;
  }
}
