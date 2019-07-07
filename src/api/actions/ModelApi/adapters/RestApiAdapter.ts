import * as pluralize from "pluralize";
import { ThunkDispatch } from "redux-thunk";

import { RestClient } from "../../../clients/RestClient";
import { IModel } from "../../../model";
import { ApiAction } from "../../types";
import { ModelApi } from "../ModelApi";
import { IModelApiAdapter } from "./types";

// Clients will have all kinds of States and all kinds of Actions, so must use any here.
declare type Dispatch = ThunkDispatch<any, void, any>;

export class RestApiAdapter<
  BackendType extends IModel,
  FrontendType extends IModel = BackendType
> implements IModelApiAdapter<BackendType, FrontendType> {
  private static API_PATH = "/api";

  protected endpoint: string;
  protected api: ModelApi<BackendType, FrontendType>;

  private client: RestClient;

  constructor(modelName: string, client: RestClient = RestClient.getInstance()) {
    this.client = client;
    this.endpoint = `${RestApiAdapter.API_PATH}/${pluralize(modelName.toLowerCase())}/`;
  }

  public setApi(api: ModelApi<BackendType, FrontendType>) {
    this.api = api;
  }

  public getListEndpoint() {
    return this.endpoint;
  }

  public getItemEndpoint(id: string) {
    return `${this.endpoint}${id}/`;
  }

  public getAll = () => {
    return this.client.actionCreator(
      this.getListEndpoint(),
      null,
      "GET",
      (dispatch: Dispatch, response: FrontendType[]) => {
        dispatch(this.api.successfulGetAllAction(response));
      },
      null,
      this.api.bulkTransformForFrontend,
    );
  }

  public get = (id: string) => {
    return this.client.actionCreator(
      this.getItemEndpoint(id),
      null,
      "GET",
      (dispatch: Dispatch, response: FrontendType) => {
        dispatch(this.api.successfulGetAction(response));
      },
      null,
      this.api.transformForFrontend);
  }

  public create = (payload: Partial<FrontendType>) => {
    return this.client.actionCreator(
      this.getListEndpoint(),
      payload,
      "POST",
      (dispatch: Dispatch, response: FrontendType) => {
        dispatch(this.api.successfulCreateAction(response));
        this.api.processModelUpdateDependencies(dispatch, response);
      },
      this.api.transformForBackend,
      this.api.transformForFrontend) as ApiAction<FrontendType>;
  }

  public update = (original: FrontendType, updated: FrontendType) => {
    return this.client.actionCreator(
      this.getItemEndpoint(updated.id),
      updated,
      "PUT",
      (dispatch: Dispatch, response: FrontendType) => {
        dispatch(this.api.successfulUpdateAction(original, response));
        this.api.processModelUpdateDependencies(dispatch, original);
        this.api.processModelUpdateDependencies(dispatch, response);
      },
      this.api.transformForBackend,
      this.api.transformForFrontend,
    );
  }

  public delete = (deleted: FrontendType) => {
    return this.client.actionCreator(
      this.getItemEndpoint(deleted.id),
      null,
      "DELETE",
      (dispatch: Dispatch, _response: unknown) => {
        dispatch(this.api.successfulDeleteAction(deleted));
      },
    );
  }
}
