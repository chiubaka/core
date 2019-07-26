import { generateId, IModel, Model, NewModel, IModelWithoutLocalState } from "../model";
import { IModelCreate, IModelIdAction, ModelActionType, IModelUpdate } from "./types";

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

export function startSyncingModel(model: typeof Model, id: string): IModelIdAction {
  return {
    type: ModelActionType.START_SYNCING_MODEL,
    modelName: model.modelName,
    id,
  };
}

export function successfulSyncModel(model: typeof Model, payload: IModelWithoutLocalState): IModelUpdate {
  return {
    type: ModelActionType.SUCCESSFUL_SYNC_MODEL,
    modelName: model.modelName,
    payload,
  };
}
