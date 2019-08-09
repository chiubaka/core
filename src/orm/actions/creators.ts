import { generateId, IBackendModel, IModel, Model, NewModel, PartialModel } from "../model";
import {
  IModelAction,
  IModelCreate,
  IModelIdAction,
  IModelUpdate,
  ISuccessfulListModel,
  ModelActionType,
} from "./types";

export function createModel<T extends IModel>(model: typeof Model, payload: NewModel<T>): IModelCreate {
  const payloadWithId: T = payload as T;

  if (payloadWithId.id == null) {
    payloadWithId.id = generateId();
  }

  return {
    type: ModelActionType.CREATE_MODEL,
    modelName: model.modelName,
    payload: payloadWithId,
  };
}

export function updateModel<T extends IModel>(model: typeof Model, payload: PartialModel<T>): IModelUpdate {
  return {
    type: ModelActionType.UPDATE_MODEL,
    modelName: model.modelName,
    payload,
  };
}

export function destroyModel(model: typeof Model, id: string): IModelIdAction {
  return {
    type: ModelActionType.DESTROY_MODEL,
    modelName: model.modelName,
    id,
  };
}

export function startListingModel(model: typeof Model): IModelAction {
  return {
    type: ModelActionType.START_LISTING_MODEL,
    modelName: model.modelName,
  };
}

export function successfulListModel<T extends IModel>(model: typeof Model, items: T[]): ISuccessfulListModel {
  return {
    type: ModelActionType.SUCCESSFUL_LIST_MODEL,
    modelName: model.modelName,
    items,
  };
}

export function startSyncingModel(model: typeof Model, id: string): IModelIdAction {
  return {
    type: ModelActionType.START_SYNCING_MODEL,
    modelName: model.modelName,
    id,
  };
}

export function successfulSyncModel<T extends IBackendModel>(model: typeof Model, payload: T): IModelUpdate {
  return {
    type: ModelActionType.SUCCESSFUL_SYNC_MODEL,
    modelName: model.modelName,
    payload,
  };
}

export function startDestroyingModel(model: typeof Model, id: string): IModelIdAction {
  return {
    type: ModelActionType.START_DESTROYING_MODEL,
    modelName: model.modelName,
    id,
  };
}

export function successfulDestroyModel(model: typeof Model, id: string): IModelIdAction {
  return {
    type: ModelActionType.SUCCESSFUL_DESTROY_MODEL,
    modelName: model.modelName,
    id,
  };
}
