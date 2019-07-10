import { Action } from "redux";
import { IModel, PartialModel } from "../model";
export interface IModelCreate<T extends IModel> extends Action {
    payload: T;
}
export interface IModelUpdate<T extends IModel> extends Action {
    payload: PartialModel<T>;
}
export interface IModelIdAction extends Action {
    id: string;
}
