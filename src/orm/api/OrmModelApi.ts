import { ORM } from "redux-orm";

import { Dispatch } from "../../api";
import {
  createModel,
  startListingModel,
  startSyncingModel,
  successfulListModel,
  successfulSyncModel,
} from "../actions";
import { generateId, IBackendModel, IModel, IOrmState, Model, NewModel } from "../model";
import { modelSelector } from "../selectors";
import { GraphQLApiAdapter } from "./adapters/GraphQLApiAdapter";
import { IModelApiAdapter } from "./adapters/types";

export class OrmModelApi<T extends IModel> {
  public model: typeof Model;
  public orm: ORM;

  private adapter: IModelApiAdapter;

  constructor(model: typeof Model, orm: ORM, adapter?: IModelApiAdapter) {
    this.adapter = adapter || new GraphQLApiAdapter(model);
    this.model = model;
    this.orm = orm;
  }

  public list = () => {
    return (dispatch: Dispatch) => {
      dispatch(startListingModel(this.model));
      return this.adapter.list().then((instances: IBackendModel[]) => {
        dispatch(successfulListModel(this.model, instances));
      });
    };
  }

  public create = (payload: NewModel) => {
    return (dispatch: Dispatch) => {
      const id = generateId();
      dispatch(createModel(this.model, {
        id,
        ...payload,
      }));
      return dispatch(this.sync(id));
    };
  }

  public sync = (id: string) => {
    return (dispatch: Dispatch, getState: () => IOrmState) => {
      dispatch(startSyncingModel(this.model, id));
      const current: Model<T> = modelSelector(this.orm, this.model, id)(getState().orm);
      if (current == null) {
        return Promise.reject(`No ${this.model.modelName} instance found with id ${id}`);
      }

      return this.adapter.upsert(current.forBackend()).then((updated: IBackendModel) => {
        dispatch(successfulSyncModel(this.model, updated));
      });
    };
  }
}
