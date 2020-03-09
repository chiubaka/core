import { Action } from "redux";

import { IModel, NewModel, PartialModel } from "../model";

export enum ModelActionType {
  START_SYNCING_MODEL = "START_SYNCING_MODEL",
  SUCCESSFUL_SYNC_MODEL = "SUCCESSFUL_SYNC_MODEL",
  START_LISTING_MODEL = "START_LISTING_MODEL",
  SUCCESSFUL_LIST_MODEL = "SUCCESSFUL_LIST_MODEL",
  START_SEARCHING_MODEL = "START_SEARCHING_MODEL",
  SUCCESSFUL_SEARCH_MODEL = "SUCCESSFUL_SEARCH_MODEL",
  START_GETTING_MODEL = "START_GETTING_MODEL",
  SUCCESSFUL_GET_MODEL = "SUCCESSFUL_GET_MODEL",
  START_DESTROYING_MODEL = "START_DESTROYING_MODEL",
  START_CREATING_MODEL = "START_CREATING_MODEL",
  CREATE_MODEL = "CREATE_MODEL",
  START_UPDATING_MODEL = "START_UPDATING_MODEL",
  UPDATE_MODEL = "UPDATE_MODEL",
  DESTROY_MODEL = "DESTROY_MODEL",
}

export interface IModelAction extends Action {
  modelName: string;
}

export function isModelAction(action: Action): action is IModelAction {
  return (action as IModelAction).modelName != null;
}

export interface IModelStartCreate<T extends IModel = IModel> extends IModelAction {
  payload: NewModel<T>;
}

// When creating, all fields non-optional fields are required.
export interface IModelCreate<T extends IModel = IModel> extends IModelAction {
  payload: T;
}

// When updating, all fields are optional in order to support partial updates.
export interface IModelPayloadAction<T extends IModel = IModel> extends IModelAction {
  payload: PartialModel<T>;
}

export interface IModelIdAction extends IModelAction {
  id: string;
}

export interface ISuccessfulListModel<T extends IModel = IModel> extends IModelAction {
  items: T[];
}

export declare type ModelAction = IModelCreate | IModelPayloadAction | IModelIdAction | ISuccessfulListModel;
