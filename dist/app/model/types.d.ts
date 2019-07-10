import { Omit } from "../../types";
import { IModel } from "./Model";
export declare type NewModel<T extends IModel = IModel> = Omit<T, "id"> & Partial<Pick<IModel, "id">>;
export declare type PartialModel<T extends IModel = IModel> = Partial<Omit<T, "id">> & Pick<IModel, "id"> & {
    [propertyName: string]: any;
};
export interface IModelById<T extends IModel> {
    [id: string]: T;
}
export interface IModelIndex<T extends IModel> {
    [key: string]: T[];
}
