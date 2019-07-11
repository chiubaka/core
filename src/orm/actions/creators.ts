import { Model } from "redux-orm";

import { generateId, IModel, NewModel } from "../model";
import { IModelCreate, ModelActionType } from "./types";

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
