import { Action } from "redux";
import { IModel, PartialModel } from "../model";
export declare enum ModelActionType {
    START_SYNCING_MODEL = "START_SYNCING_MODEL",
    SUCCESSFUL_SYNC_MODEL = "SUCCESSFUL_SYNC_MODEL",
    SUCCESSFUL_LIST_MODEL = "SUCCESSFUL_LIST_MODEL",
    CREATE_MODEL = "CREATE_MODEL",
    UPDATE_MODEL = "UPDATE_MODEL",
    DESTROY_MODEL = "DESTROY_MODEL"
}
export interface IModelAction extends Action {
    modelName: string;
}
export declare function isModelAction(action: Action): action is IModelAction;
export interface IModelCreate<T extends IModel = IModel> extends IModelAction {
    payload: T;
}
export interface IModelUpdate<T extends IModel = IModel> extends IModelAction {
    payload: PartialModel<T>;
}
export interface IModelIdAction extends IModelAction {
    id: string;
}
export interface ISuccessfulListModel<T extends IModel = IModel> extends IModelAction {
    items: T[];
}
export declare type ModelAction = IModelCreate | IModelUpdate | IModelIdAction | ISuccessfulListModel;
