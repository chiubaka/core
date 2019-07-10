import { ThunkDispatch } from "redux-thunk";

import * as pluralize from "pluralize";
import { isNullOrUndefined } from "util";

import { IModel } from "../../../app";
import { Api } from "../Api";
import { ApiAction } from "../types";
import { IModelApiAdapter, RestApiAdapter } from "./adapters";

export declare type Dispatch = ThunkDispatch<any, void, any>;

interface IModelUpdateDependency<T> {
  idMapper: (modelObject: T) => string[];
  modelApiAction: (id: string) => ApiAction<any>;
}

export class ModelApi<
  BackendType extends IModel,
  FrontendType extends IModel = BackendType,
> extends Api<IModelApiAdapter<BackendType, FrontendType>> {

  public SUCCESSFUL_GET_ALL_TYPE: string;
  public SUCCESSFUL_GET_TYPE: string;
  public SUCCESSFUL_CREATE_TYPE: string;
  public SUCCESSFUL_UPDATE_TYPE: string;
  public SUCCESSFUL_DELETE_TYPE: string;

  protected endpoint: string;
  private modelUpdateDependencies: Array<IModelUpdateDependency<FrontendType>>;

  constructor(modelName: string, adapter?: IModelApiAdapter<BackendType, FrontendType>) {
    adapter = adapter || new RestApiAdapter(modelName);
    super(adapter);
    // TODO: There's some code smell in having to create a bilateral reference here...
    // Doing this also forces a lot of ModelApi methods which should be private to instead
    // be public...
    adapter.setApi(this);
    const modelNameUpper = modelName.toUpperCase();
    this.SUCCESSFUL_GET_ALL_TYPE = `SUCCESSFUL_GET_ALL_${pluralize(modelNameUpper)}`;
    this.SUCCESSFUL_GET_TYPE = `SUCCESSFUL_GET_${modelNameUpper}`;
    this.SUCCESSFUL_CREATE_TYPE = `SUCCESSFUL_CREATE_${modelNameUpper}`;
    this.SUCCESSFUL_UPDATE_TYPE = `SUCCESSFUL_UPDATE_${modelNameUpper}`;
    this.SUCCESSFUL_DELETE_TYPE = `SUCCESSFUL_DELETE_${modelNameUpper}`;
    this.modelUpdateDependencies = [];

    this.bulkTransformForFrontend = this.bulkTransformForFrontend.bind(this);
    this.processModelUpdateDependencies = this.processModelUpdateDependencies.bind(this);
  }

  public getAll(): ApiAction<FrontendType[]> {
    return this.getAdapter().getAll();
  }

  public get(id: string): ApiAction<FrontendType> {
    return this.getAdapter().get(id);
  }

  public create(payload: Partial<FrontendType>): ApiAction<FrontendType> {
    return this.getAdapter().create(payload);
  }

  public update(original: FrontendType, updated: FrontendType): ApiAction<FrontendType> {
    return this.getAdapter().update(original, updated);
  }

  public createOrUpdate(original: Partial<FrontendType>, updated: Partial<FrontendType>): ApiAction<FrontendType> {
    if (original && original.id) {
      return this.update(original as FrontendType, updated as FrontendType);
    } else {
      return this.create(updated);
    }
  }

  public delete(deleted: FrontendType) {
    return this.getAdapter().delete(deleted);
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

  public successfulDeleteAction(deleted: FrontendType) {
    return {
      type: this.SUCCESSFUL_DELETE_TYPE,
      deleted,
    };
  }

  public addModelUpdateDependency(idMapper: (data: FrontendType) => string[],
                                  dependentApiAction: (id: string) => ApiAction<any>,
                                  apiThisArg: Api<IModelApiAdapter<BackendType, FrontendType>>) {
    this.modelUpdateDependencies.push({idMapper, modelApiAction: dependentApiAction.bind(apiThisArg)});
  }

  public transformForFrontend(object: BackendType): FrontendType {
    return object as any;
  }

  public transformForBackend(object: FrontendType): BackendType {
    return object as any;
  }

  public bulkTransformForFrontend(objects: BackendType[]): FrontendType[] {
    return objects.map(this.transformForFrontend);
  }

  public processModelUpdateDependencies(dispatch: Dispatch, modelObject: FrontendType) {
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
