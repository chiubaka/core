import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

// Returns a version of T without the keys specified in K
// Ex. Omit<{ id: string, name?: string }, "id"> => { name?: string }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ThunkResult<R> = ThunkAction<R, any, null, Action>;
export declare type Dispatch = ThunkDispatch<any, void, Action>;
