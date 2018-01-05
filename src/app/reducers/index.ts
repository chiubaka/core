import { Action } from "redux";
import { IProductInnerState, IServiceInnerState } from "../model/index";

export function identityReducer<T>(defaultState: T) {
  return (state: T = defaultState, _action: Action) => {
    return state;
  };
}

export function product(defaultState: IProductInnerState) {
  return identityReducer(defaultState);
}

export function service(defaultState: IServiceInnerState) {
  return identityReducer(defaultState);
}
