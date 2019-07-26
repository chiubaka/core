import { ORMCommonState } from "redux-orm";

import { Omit } from "../../types";
import { IModel } from "./Model";

export interface IOrmState {
  orm: ORMCommonState;
}

// Makes "id" not required for model types.
export type NewModel<T extends IModel = IModel> = Omit<T, "id"> & Partial<Pick<IModel, "id">>;
// Makes all properties on a model optional except for id.
export type PartialModel<T extends IModel = IModel> = Partial<Omit<T, "id">>
  & Pick<IModel, "id">
  & {[propertyName: string]: any};

export interface IModelById<T extends IModel> {
  [id: string]: T;
}

export interface IModelIndex<T extends IModel> {
  [key: string]: T[];
}
