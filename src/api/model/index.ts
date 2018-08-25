export interface IModelById<T> {
  [id: string]: T;
}

export interface IModel {
  id?: string;
}
