import { Intent, IToaster, Toaster } from "@blueprintjs/core";
import { Action } from "redux";
import { Api } from "../../api/actions";
import { IApiErrorResponse } from "../../index";
import { IProductInnerState } from "../model/index";

export function identityReducer<T>(defaultState: T) {
  return (state: T = defaultState, _action: Action) => {
    return state;
  };
}

let ErrorToaster: IToaster = null;
document.addEventListener("DOMContentLoaded", () => {
  ErrorToaster = Toaster.create();
});

export function product(defaultState: IProductInnerState) {
  return (state: IProductInnerState | undefined = defaultState, action: Action) => {
    switch (action.type) {
      case Api.UNSUCCESSFUL_API_REQUEST_TYPE:
        const messages = new Set(ErrorToaster.getToasts().map((props) => props.message));

        const message = (action as IApiErrorResponse).reason;
        if (!messages.has(message)) {
          ErrorToaster.show({
            message,
            intent: Intent.DANGER,
          });
        }
      default:
        return state;
    }
  };
}
