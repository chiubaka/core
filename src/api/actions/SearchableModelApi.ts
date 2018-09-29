/* tslint:disable:no-unused-variable */
import { Dispatch } from "redux";
import { IAuthState } from "../../auth/model/AuthenticationState";
/* tslint:enable:no-unused-variable */

import * as pluralize from "pluralize";

import { IModel } from "../model/";
import { ApiAction } from "./Api";
import { ModelApi } from "./ModelApi";

export class SearchableModelApi<BackendType extends IModel, FrontendType extends IModel = BackendType>
  extends ModelApi<BackendType, FrontendType> {
  public SUCCESSFUL_SEARCH_TYPE: string;

  constructor(modelName: string) {
    super(modelName);

    this.SUCCESSFUL_SEARCH_TYPE = `SUCCESSFUL_SEARCH_${pluralize(modelName.toUpperCase())}`;
  }

  public search(query: string): ApiAction<FrontendType[]> {
    const payload = {
      query,
    };
    return this.actionCreator(this.getSearchEndpoint(), payload, "GET", (dispatch, response: FrontendType[]) => {
      dispatch(this.successfulSearchAction(response));
    }, null, this.bulkTransformForFrontend);
  }

  public getSearchEndpoint() {
    return `${this.endpoint}/search/`;
  }

  public successfulSearchAction(payload: FrontendType[]) {
    return {
      type: this.SUCCESSFUL_SEARCH_TYPE,
      payload,
    };
  }
}
