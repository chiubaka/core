import { Action } from "redux";
import { IProductInnerState } from "../model/index";
export declare function identityReducer<T>(defaultState: T): (state: T, _action: Action<any>) => T;
export declare function product(defaultState: IProductInnerState): (state: IProductInnerState, action: Action<any>) => IProductInnerState;
