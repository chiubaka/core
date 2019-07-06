export interface IModel {
    [propertyName: string]: any;
    id?: string;
}
export interface IModelById<T extends IModel> {
    [id: string]: T;
}
export interface IModelIndex<T extends IModel> {
    [key: string]: T[];
}
