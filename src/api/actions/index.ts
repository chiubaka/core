import { Action } from "redux";

export * from "./Api";
export * from "./ModelApi";
export * from "./SearchableModelApi";

export interface IApiResponse<T> extends Action {
  payload: T;
}

export interface IApiUpdateResponse<T> extends IApiResponse<T> {
  original: T;
}

export interface IApiErrorResponse extends Action {
  reason: string;
}
