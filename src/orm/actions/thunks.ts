
import { Dispatch } from "../../api";
import { OrmModelApi } from "../api";
import { IModel, IOrmState, Model } from "../model";
import { modelSelector } from "../selectors";
import { startSyncingModel, successfulSyncModel } from "./creators";

export const syncModel = <TState extends IOrmState, TFields extends IModel>(api: OrmModelApi, id: string) => {
  return (dispatch: Dispatch, getState: () => TState) => {
    dispatch(startSyncingModel(api.model, id));
    const instance: Model<TFields> = modelSelector(api.orm, api.model, id)(getState().orm);
    return dispatch(upsertModel(api, instance, instance));
  };
};

export const upsertModel = <TFields extends IModel>(
  api: OrmModelApi,
  original: Model<TFields>,
  updated: Model<TFields>,
) => {
  return (dispatch: Dispatch) => {
    dispatch(api.createOrUpdate(original.withoutLocalState(), updated.withoutLocalState()));
    dispatch(successfulSyncModel(api.model, original.getId()));
  };
};
