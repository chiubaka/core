import { ORM } from "redux-orm";

import { Dispatch } from "../../api";
import { startListingModel, startSyncingModel, successfulListModel, successfulSyncModel } from "../actions";
import { IBackendModel, IModel, IOrmState, Model } from "../model";
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
