import { Model } from "redux-orm";
import { IModel, NewModel } from "../model";
import { IModelCreate } from "./types";
export declare function createModel<T extends IModel>(model: typeof Model, payload: NewModel<T>): IModelCreate;
