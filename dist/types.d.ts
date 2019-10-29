import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type ThunkResult<R> = ThunkAction<R, any, null, Action>;
export declare type Dispatch = ThunkDispatch<any, void, Action>;
