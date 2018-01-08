import { Action } from "redux";

export * from "./Api";
export * from "./ModelApi";

export interface IApiResponse<T> extends Action {
  payload: T;
}

export interface IApiUpdateResponse<T> extends Action {
  original: T;
  updated: T;
}

export interface IApiErrorResponse extends Action {
  reason: string;
}

export interface IModel {
  id?: number;
}
