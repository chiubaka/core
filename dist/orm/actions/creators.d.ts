import { IBackendModel, IModel, Model, NewModel, PartialModel } from "../model";
import { IModelAction, IModelCreate, IModelIdAction, IModelUpdate, ISuccessfulListModel } from "./types";
export declare function createModel<T extends IModel>(model: typeof Model, payload: NewModel<T>): IModelCreate;
export declare function updateModel<T extends IModel>(model: typeof Model, payload: PartialModel<T>): IModelUpdate;
export declare function destroyModel(model: typeof Model, id: string): IModelIdAction;
export declare function startListingModel(model: typeof Model): IModelAction;
export declare function successfulListModel<T extends IModel>(model: typeof Model, items: T[]): ISuccessfulListModel;
export declare function startSyncingModel(model: typeof Model, id: string): IModelIdAction;
export declare function successfulSyncModel<T extends IBackendModel>(model: typeof Model, payload: T): IModelUpdate;
