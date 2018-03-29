import { Action } from "redux";
import { IApiResponse, IApiUpdateResponse, IModel, ModelApi } from "../actions/index";
import { IModelById } from "../model/index";

export declare type ReducerTransformer<T> = (item: T) => T;

export function modelApiById<T extends IModel>(Api: ModelApi<T>, transformer?: ReducerTransformer<T>) {
  return (state: IModelById<T> = {}, action: Action): IModelById<T> => {
    switch (action.type) {
      case Api.SUCCESSFUL_GET_ALL_TYPE: {
        const payload = (action as IApiResponse<T[]>).payload;
        const objects = transformer ? payload.map(transformer) : payload;
        const newState = {...state};
        objects.forEach((object) => {
          newState[object.id] = object;
        });
        return newState;
      }
      case Api.SUCCESSFUL_CREATE_TYPE: {
        const object = (action as IApiResponse<T>).payload;
        const newState = {...state};
        newState[object.id] = object;
        return newState;
      }
      case Api.SUCCESSFUL_GET_TYPE:
      case Api.SUCCESSFUL_UPDATE_TYPE: {
        const payload = (action as IApiUpdateResponse<T>).payload;
        const object = transformer ? transformer(payload) : payload;
        const newState = {...state};
        newState[object.id] = object;
        return newState;
      }
      default:
        return state;
    }
  };
}

// Manages API state as a simple array. Useful for simple models that have relatively small
// amounts of data which does not need to be replicated or sliced and displayed elsewhere.
export function modelApiAsArray<T extends IModel>(Api: ModelApi<T>, transformer?: ReducerTransformer<T>) {
  return (state: T[] = [], action: Action): T[] => {
    switch (action.type) {
      case Api.SUCCESSFUL_GET_ALL_TYPE: {
        const payload = (action as IApiResponse<T[]>).payload;
        return transformer ? payload.map(transformer) : payload;
      }
      case Api.SUCCESSFUL_CREATE_TYPE: {
        const object = (action as IApiResponse<T>).payload;
        return [...state, object];
      }
      case Api.SUCCESSFUL_GET_TYPE:
      case Api.SUCCESSFUL_UPDATE_TYPE: {
        const payload = (action as IApiUpdateResponse<T>).payload;
        const updated = transformer ? transformer(payload) : payload;
        const index = state.findIndex((object) => {
          return object.id === updated.id;
        });

        if (index === -1) {
          console.warn("API attempt to update an object which does not exist on client.");
          return [...state, updated];
        }

        const newState = [...state];
        newState.splice(index, 1, updated);
        return newState;
      }
      default:
        return state;
    }
  };
}
