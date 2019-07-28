import { Action } from "redux";

export * from "./Api";
export * from "./ModelApi";
export * from "./SearchableApi";
export * from "./types";

export interface IApiResponse<T> extends Action {
  payload: T;
}

export interface IApiUpdateResponse<T> extends IApiResponse<T> {
  original: T;
}

export interface IApiDeleteResponse<T> extends Action {
  deleted: T;
}

export interface IApiErrorResponse extends Action {
  reason: string;
}
