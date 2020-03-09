import { IBackendModel, IModel, Model, NewModel, PartialModel } from "../model";
import {
  IModelAction,
  IModelCreate,
  IModelIdAction,
  IModelPayloadAction,
  ISuccessfulListModel,
  ModelActionType,
} from "./types";

export function createModel<T extends IModel>(model: typeof Model, payload: NewModel<T>): IModelCreate {
  const payloadWithId: T = payload as T;

  if (payloadWithId.id == null) {
    payloadWithId.id = model.generateId(payload);
  }

  return {
    type: ModelActionType.CREATE_MODEL,
    modelName: model.modelName,
    payload: payloadWithId,
  };
}

export function updateModel<T extends IModel>(model: typeof Model, payload: PartialModel<T>): IModelPayloadAction {
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

export function startSearchingModel(model: typeof Model): IModelAction {
  return {
    type: ModelActionType.START_SEARCHING_MODEL,
    modelName: model.modelName,
  };
}

export function successfulSearchModel<T extends IModel>(model: typeof Model, items: T[]): ISuccessfulListModel {
  return {
    type: ModelActionType.SUCCESSFUL_SEARCH_MODEL,
    modelName: model.modelName,
    items,
  };
}

export function startGettingModel(model: typeof Model, id: string): IModelIdAction {
  return {
    type: ModelActionType.START_GETTING_MODEL,
    modelName: model.modelName,
    id,
  };
}

export function successfulGetModel<T extends IModel>(model: typeof Model, payload: T): IModelPayloadAction {
  return {
    type: ModelActionType.SUCCESSFUL_GET_MODEL,
    modelName: model.modelName,
    payload,
  };
}

export function startSyncingModel(model: typeof Model, id: string): IModelIdAction {
  return {
    type: ModelActionType.START_SYNCING_MODEL,
    modelName: model.modelName,
    id,
  };
}

export function successfulSyncModel<T extends IBackendModel>(model: typeof Model, payload: T): IModelPayloadAction {
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
