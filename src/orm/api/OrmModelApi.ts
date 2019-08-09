import { ORM } from "redux-orm";

import { Dispatch, ThunkResult } from "../../types";
import {
  createModel,
  destroyModel,
  startDestroyingModel,
  startListingModel,
  startSyncingModel,
  successfulDestroyModel,
  successfulListModel,
  successfulSyncModel,
  updateModel,
} from "../actions";
import { generateId, IBackendModel, IModel, IOrmState, Model, NewModel, PartialModel } from "../model";
import { modelSelector } from "../selectors";
import { GraphQLApiAdapter } from "./adapters/GraphQLApiAdapter";
import { IModelApiAdapter } from "./adapters/types";

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

  public list = (): ThunkResult<Promise<IBackendModel[]>> => {
    return async (dispatch: Dispatch) => {
      dispatch(startListingModel(this.model));
      return this.adapter.list().then((instances: IBackendModel[]) => {
        dispatch(successfulListModel(this.model, instances));
        return instances;
      });
    };
  }

  public create = (payload: NewModel): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch) => {
      const id = generateId();
      dispatch(createModel(this.model, {
        id,
        ...payload,
      }));
      return dispatch(this.sync(id)).then((result) => {
        return result;
      });
    };
  }

  public update = (payload: PartialModel): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch) => {
      const id = payload.id;
      dispatch(updateModel(this.model, payload));
      return dispatch(this.sync(id)).then((result) => {
        return result;
      });
    };
  }

  public sync = (id: string): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch, getState: () => IOrmState) => {
      dispatch(startSyncingModel(this.model, id));
      const current: Model<T> = modelSelector(this.orm, this.model, id)(getState().orm);
      if (current == null) {
        return Promise.reject(`No ${this.model.modelName} instance found with id ${id}`);
      }

      return this.adapter.upsert(current.forBackend()).then((updated: IBackendModel) => {
        dispatch(successfulSyncModel(this.model, updated));
        return updated;
      });
    };
  }

  public delete = (id: string): ThunkResult<Promise<IBackendModel>> => {
    return async (dispatch: Dispatch) => {
      dispatch(startDestroyingModel(this.model, id));
      return this.adapter.delete(id).then((_deleted: IBackendModel) => {
        const promise = dispatch(successfulDestroyModel(this.model, id));
        dispatch(destroyModel(this.model, id));
        return promise;
      });
    };
  }
}
