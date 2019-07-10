import { Action } from "redux";

import { IModel, PartialModel } from "../model";

// When creating, all fields non-optional fields are required.
export interface IModelCreate<T extends IModel> extends Action {
  payload: T;
}

// When updating, all fields are optional in order to support partial updates.
export interface IModelUpdate<T extends IModel> extends Action {
  payload: PartialModel<T>;
}

export interface IModelIdAction extends Action {
  id: string;
}
