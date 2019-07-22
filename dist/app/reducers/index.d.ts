import { Action } from "redux";
import { IProductInnerState, IServiceInnerState } from "../model/index";
export declare function identityReducer<T>(defaultState: T): (state: T, _action: Action<any>) => T;
export declare function product(defaultState: IProductInnerState): (state: IProductInnerState, action: Action<any>) => IProductInnerState;
export declare function service(defaultState: IServiceInnerState): (state: IServiceInnerState, _action: Action<any>) => IServiceInnerState;
