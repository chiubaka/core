/* tslint:disable:no-unused-variable */
import { Dispatch } from "redux";
import { IAuthState } from "../../auth/model/AuthenticationState";
/* tslint:enable:no-unused-variable */

import * as pluralize from "pluralize";
import { isNullOrUndefined } from "util";

import { IModel } from "../model/";
import { Api, ApiAction } from "./Api";

interface IModelUpdateDependency<T> {
  idMapper: (modelObject: T) => string[];
  modelApiAction: (id: string) => ApiAction<any>;
}

export class ModelApi<BackendType extends IModel, FrontendType extends IModel = BackendType> extends Api {
  private static API_PATH = "/api";

  public SUCCESSFUL_GET_ALL_TYPE: string;
  public SUCCESSFUL_GET_TYPE: string;
  public SUCCESSFUL_CREATE_TYPE: string;
  public SUCCESSFUL_UPDATE_TYPE: string;

  private endpoint: string;
  private modelUpdateDependencies: Array<IModelUpdateDependency<FrontendType>>;

  constructor(modelName: string) {
    super();
    this.SUCCESSFUL_GET_ALL_TYPE = `SUCCESSFUL_GET_ALL_${pluralize(modelName.toUpperCase())}`;
    this.SUCCESSFUL_GET_TYPE = `SUCCESSFUL_GET_${modelName.toUpperCase()}`;
    this.SUCCESSFUL_CREATE_TYPE = `SUCCESSFUL_CREATE_${modelName.toUpperCase()}`;
    this.SUCCESSFUL_UPDATE_TYPE = `SUCCESSFUL_UPDATE_${modelName.toUpperCase()}`;
    this.endpoint = `${ModelApi.API_PATH}/${pluralize(modelName.toLowerCase())}/`;
    this.modelUpdateDependencies = [];

    this.bulkTransformForFrontend = this.bulkTransformForFrontend.bind(this);
    this.processModelUpdateDependencies = this.processModelUpdateDependencies.bind(this);
  }

  public getAll(): ApiAction<FrontendType[]> {
    return this.getActionCreator(this.getListEndpoint(), (dispatch, response: FrontendType[]) => {
      dispatch(this.successfulGetAllAction(response));
    }, this.bulkTransformForFrontend);
  }

  public get(id: string): ApiAction<FrontendType> {
    return this.getActionCreator(this.getItemEndpoint(id), (dispatch, response: FrontendType) => {
      dispatch(this.successfulGetAction(response));
    }, this.transformForFrontend);
  }

  public getListEndpoint() {
    return this.endpoint;
  }

  public getItemEndpoint(id: string) {
    return `${this.endpoint}${id}/`;
  }

  public create(payload: Partial<FrontendType>): ApiAction<FrontendType> {
    return this.postActionCreator(this.getListEndpoint(), payload, (dispatch, response: FrontendType) => {
      dispatch(this.successfulCreateAction(response));
      this.processModelUpdateDependencies(dispatch, response);
    }, this.transformForBackend, this.transformForFrontend) as ApiAction<FrontendType>;
  }

  public update(original: FrontendType, updated: FrontendType): ApiAction<FrontendType> {
    return this.putActionCreator(this.getItemEndpoint(updated.id), updated, (dispatch, response: FrontendType) => {
      dispatch(this.successfulUpdateAction(original, response));
      this.processModelUpdateDependencies(dispatch, original);
      this.processModelUpdateDependencies(dispatch, response);
    }, this.transformForBackend, this.transformForFrontend);
  }

  public createOrUpdate(original: Partial<FrontendType>, updated: Partial<FrontendType>): ApiAction<FrontendType> {
    if (original && original.id) {
      return this.update(original as FrontendType, updated as FrontendType);
    } else {
      return this.create(updated);
    }
  }

  public successfulGetAllAction(payload: FrontendType[]) {
    return {
      type: this.SUCCESSFUL_GET_ALL_TYPE,
      payload,
    };
  }

  public successfulGetAction(payload: FrontendType) {
    return {
      type: this.SUCCESSFUL_GET_TYPE,
      payload,
    };
  }

  public successfulCreateAction(payload: FrontendType) {
    return {
      type: this.SUCCESSFUL_CREATE_TYPE,
      payload,
    };
  }

  public successfulUpdateAction(original: FrontendType, payload: FrontendType) {
    return {
      type: this.SUCCESSFUL_UPDATE_TYPE,
      original,
      payload,
    };
  }

  public addModelUpdateDependency(idMapper: (data: FrontendType) => string[],
                                  dependentApiAction: (id: string) => ApiAction<any>,
                                  apiThisArg: Api) {
    this.modelUpdateDependencies.push({idMapper, modelApiAction: dependentApiAction.bind(apiThisArg)});
  }

  protected transformForFrontend(object: BackendType): FrontendType {
    return object as any;
  }

  protected transformForBackend(object: FrontendType): BackendType {
    return object as any;
  }

  private bulkTransformForFrontend(objects: BackendType[]): FrontendType[] {
    return objects.map(this.transformForFrontend);
  }

  private processModelUpdateDependencies(dispatch: Dispatch<any>, modelObject: FrontendType) {
    this.modelUpdateDependencies.forEach((dependency) => {
      const dependencyIds = dependency.idMapper(modelObject);

      if (!isNullOrUndefined(dependencyIds)) {
        dependencyIds.forEach((dependencyId) => {
          if (!isNullOrUndefined(dependencyId)) {
            dispatch(dependency.modelApiAction(dependencyId));
          }
        });
      }
    });
  }
}
