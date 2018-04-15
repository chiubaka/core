import { Action } from "redux";
import { IApiResponse, IApiUpdateResponse, IModel, ModelApi } from "../actions/index";
import { IModelById } from "../model/index";

export declare type ModelFilterFunction<T> = (model: T) => boolean;
export declare type ModelEqualityFunction<T> = (model1: T, model2: T) => boolean;
export declare type GetObjectsReducer<StateType, ModelType> = (objects: ModelType[]) => StateType;
export declare type MergeObjectReducer<StateType, ModelType> = (state: StateType, object: ModelType) => StateType;

export function modelApiReducer<StateT, ModelT extends IModel>(Apis: Array<ModelApi<ModelT>>,
                                                               initialState: StateT,
                                                               modelFilter: ModelFilterFunction<ModelT>,
                                                               onBulkObjectAdd: GetObjectsReducer<StateT, ModelT>,
                                                               onObjectAdd: MergeObjectReducer<StateT, ModelT>,
                                                               onObjectRemove: MergeObjectReducer<StateT, ModelT>,
                                                               modelEquality?: ModelEqualityFunction<ModelT>) {
  const getAllTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_GET_ALL_TYPE));
  const createTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_CREATE_TYPE));
  const updateTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_UPDATE_TYPE));

  return (state: StateT = initialState, action: Action): StateT => {
    if (getAllTypes.has(action.type)) {
      const objects = (action as IApiResponse<ModelT[]>).payload.filter(modelFilter);
      return onBulkObjectAdd(objects);
    } else if (createTypes.has(action.type)) {
      const object = (action as IApiResponse<ModelT>).payload;
      if (modelFilter(object)) {
        return onObjectAdd(state, object);
      }
    } else if (updateTypes.has(action.type)) {
      const { original, payload } = (action as IApiUpdateResponse<ModelT>);
      if (!modelFilter(original) && modelFilter(payload)) {
        return onObjectAdd(state, payload);
      } else if (modelFilter(original) && !modelFilter(payload)) {
        return onObjectRemove(state, original);
      } else if (modelFilter(original) && modelFilter(payload)) {
        if (modelEquality && !modelEquality(original, payload)) {
          return onObjectAdd(onObjectRemove(state, original), payload);
        }
      }
    }
    return state;
  };
}

// TODO: Can probably be refactored to make use of modelApiReducer
export function modelApiById<T extends IModel>(Api: ModelApi<T>) {
  return (state: IModelById<T> = {}, action: Action): IModelById<T> => {
    switch (action.type) {
      case Api.SUCCESSFUL_GET_ALL_TYPE: {
        const objects = (action as IApiResponse<T[]>).payload;
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
        const newState = {...state};
        newState[payload.id] = payload;
        return newState;
      }
      default:
        return state;
    }
  };
}

// TODO: Can probably be refactored to make use of modelApiReducer
// Manages API state as a simple array. Useful for simple models that have relatively small
// amounts of data which does not need to be replicated or sliced and displayed elsewhere.
export function modelApiAsArray<T extends IModel>(Api: ModelApi<T>) {
  return (state: T[] = [], action: Action): T[] => {
    switch (action.type) {
      case Api.SUCCESSFUL_GET_ALL_TYPE: {
        return (action as IApiResponse<T[]>).payload;
      }
      case Api.SUCCESSFUL_CREATE_TYPE: {
        const object = (action as IApiResponse<T>).payload;
        return [...state, object];
      }
      case Api.SUCCESSFUL_GET_TYPE:
      case Api.SUCCESSFUL_UPDATE_TYPE: {
        const updated = (action as IApiUpdateResponse<T>).payload;
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
