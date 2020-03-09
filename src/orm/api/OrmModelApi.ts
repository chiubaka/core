import { ORM } from "redux-orm";

import { Dispatch, ThunkResult } from "../../types";
import {
  createModel,
  destroyModel,
  startCreatingModel,
  startDestroyingModel,
  startGettingModel,
  startListingModel,
  startSearchingModel,
  startSyncingModel,
  startUpdatingModel,
  successfulGetModel,
  successfulListModel,
  successfulSearchModel,
  successfulSyncModel,
  updateModel,
} from "../actions";
import { IBackendModel, IModel, IOrmState, Model, NewModel, PartialModel } from "../model";
import { modelSelector } from "../selectors";
import { GraphQLApiAdapter } from "./adapters/GraphQLApiAdapter";
import { IModelApiAdapter } from "./adapters/types";
import { IApiRequestOptions } from "./types";

interface IOrmModelApiOptions {
  adapter?: IModelApiAdapter;
  adapterOptions?: any;
}

export class OrmModelApi<T extends IModel> {
  public model: typeof Model;
  public orm: ORM;

  private adapter: IModelApiAdapter;

  constructor(model: typeof Model, orm: ORM, options?: IOrmModelApiOptions) {
    this.adapter = (options != null && options.adapter)
      || new GraphQLApiAdapter(model, options != null && options.adapterOptions);
    this.model = model;

    this.orm = orm;
  }

  public list = (options?: IApiRequestOptions): ThunkResult<Promise<IBackendModel[]>> => {
    return async (dispatch: Dispatch) => {
      dispatch(startListingModel(this.model));
      return this.adapter.list(options).then((instances: IBackendModel[]) => {
        dispatch(successfulListModel(this.model, instances));
        return instances;
      });
    };
  }

  public search = (searchTerm: string, options?: IApiRequestOptions): ThunkResult<Promise<IBackendModel[]>> => {
    return async (dispatch: Dispatch) => {
      dispatch(startSearchingModel(this.model));
      return this.adapter.search(searchTerm, options).then((instances: IBackendModel[]) => {
        dispatch(successfulSearchModel(this.model, instances));
        return instances;
      });
    };
  }

  public get = (id: string, options?: IApiRequestOptions): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch) => {
      dispatch(startGettingModel(this.model, id));
      return this.adapter.get(id, options).then((instance: IBackendModel) => {
        dispatch(successfulGetModel(this.model, instance));
        return instance;
      });
    };
  }

  public create = (payload: NewModel, options?: IApiRequestOptions): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch) => {
      dispatch(startCreatingModel(this.model, payload));
      return this.adapter.create(payload, options).then((instance: IBackendModel) => {
        dispatch(createModel(this.model, instance));
        return instance;
      });
    };
  }

  public createOptimistic = (payload: NewModel, options?: IApiRequestOptions): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch) => {
      const id = this.model.generateId(payload);
      dispatch(createModel(this.model, {
        id,
        ...payload,
      }));
      return dispatch(this.sync(id, options)).then((result) => {
        return result;
      });
    };
  }

  public update = (payload: PartialModel, options?: IApiRequestOptions): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch, getState: () => IOrmState) => {
      const id = payload.id;
      dispatch(startUpdatingModel(this.model, id));

      const current: Model<T> = modelSelector(this.orm, this.model, id)(getState().orm);
      if (current == null) {
        return Promise.reject(`No ${this.model.modelName} instance found with id ${id}`);
      }

      // We can safely update without this being pre-emptive because this update occurs
      // without saving the updates to the session.
      current.update(payload);

      return this.adapter.update(current.forBackend(), options).then((result) => {
        dispatch(updateModel(this.model, result));
        return result;
      });
    };
  }

  public updateOptimistic = (
    payload: PartialModel,
    options?: IApiRequestOptions,
  ): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch) => {
      const id = payload.id;
      dispatch(updateModel(this.model, payload));
      return dispatch(this.sync(id, options)).then((result) => {
        return result;
      });
    };
  }

  public sync = (id: string, options?: IApiRequestOptions): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch, getState: () => IOrmState) => {
      dispatch(startSyncingModel(this.model, id));
      const current: Model<T> = modelSelector(this.orm, this.model, id)(getState().orm);
      if (current == null) {
        return Promise.reject(`No ${this.model.modelName} instance found with id ${id}`);
      }

      return this.adapter.upsert(current.forBackend(), options).then((updated: IBackendModel) => {
        dispatch(successfulSyncModel(this.model, updated));
        return updated;
      });
    };
  }

  public delete = (id: string, options?: IApiRequestOptions): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch) => {
      dispatch(startDestroyingModel(this.model, id));
      return this.adapter.delete(id, options).then((deleted: IBackendModel) => {
        dispatch(destroyModel(this.model, id));
        return deleted;
      });
    };
  }
}
