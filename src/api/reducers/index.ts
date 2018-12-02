import { Action } from "redux";
import { IApiDeleteResponse, IApiResponse, IApiUpdateResponse, ModelApi, SearchableModelApi } from "../actions";
import { IModel, IModelById, IModelIndex } from "../model";

export declare type ModelFilterFunction<T> = (model: T) => boolean;
export declare type ModelEqualityFunction<T> = (model1: T, model2: T) => boolean;
export declare type GetObjectsReducer<StateType, ModelType> = (objects: ModelType[]) => StateType;
export declare type MergeObjectReducer<StateType, ModelType> = (state: StateType, object: ModelType) => StateType;

// By default, filter nothing out.
function defaultModelFilterFunction<T>(_object: T) {
  return true;
}

// By default, consider nothing equal and always update. This is usually more
// work than we need to do.
function defaultModelEqualityFunction<T>(_object1: T, _object2: T) {
  return false;
}

export function searchableModelApiAsArray<ModelT extends IModel>(
  Api: SearchableModelApi<ModelT>,
) {
  return (state: ModelT[] = [], action: Action): ModelT[] => {
    if (action.type === Api.SUCCESSFUL_SEARCH_TYPE) {
      return (action as IApiResponse<ModelT[]>).payload;
    } else if (action.type === Api.SUCCESSFUL_UPDATE_TYPE) {
      const updated = (action as IApiUpdateResponse<ModelT>).payload;
      const newState = [...state];
      const index = newState.findIndex((model: ModelT) => model.id === updated.id);
      if (index !== -1) {
        newState[index] = updated;
      }

      return newState;
    }
    return state;
  };
}

export function modelApiReducer<StateT, ModelT extends IModel>(
  Apis: Array<ModelApi<ModelT>>,
  initialState: StateT,
  modelFilter: ModelFilterFunction<ModelT>,
  onBulkObjectAdd: GetObjectsReducer<StateT, ModelT>,
  onObjectAdd: MergeObjectReducer<StateT, ModelT>,
  onObjectRemove: MergeObjectReducer<StateT, ModelT>,
  modelEquality: ModelEqualityFunction<ModelT> = defaultModelEqualityFunction) {
  const getAllTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_GET_ALL_TYPE));
  const createTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_CREATE_TYPE));
  const updateTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_UPDATE_TYPE));
  const deleteTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_DELETE_TYPE));

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
    } else if (deleteTypes.has(action.type)) {
      const deleted = (action as IApiDeleteResponse<ModelT>).deleted;
      return onObjectRemove(state, deleted);
    }
    return state;
  };
}

export function modelApiById<T extends IModel>(Api: ModelApi<T>) {
  return modelApiByUniqueProperty(Api, "id", defaultModelEqualityFunction);
}

export function modelApiByUniqueProperty<T extends IModel>(Api: ModelApi<T>,
                                                           propertyName: keyof T,
                                                           modelEquality: ModelEqualityFunction<T>) {
  return modelApiReducer(
    [Api],
    {},
    // Nothing should be filtered out!
    defaultModelFilterFunction,
    (objects: T[]) => {
      const newState: IModelById<T> = {};
      objects.forEach((object) => {
        const property = object[propertyName];
        newState[property] = object;
      });
      return newState;
    },
    (state: IModelById<T>, object: T) => {
      const newState = {...state};
      const property = object[propertyName];
      newState[property] = object;
      return newState;
    },
    (state: IModelById<T>, object: T) => {
      const property = object[propertyName];
      const newState = {...state};
      delete newState[property];
      return newState;
    },
    modelEquality,
  );
}

export function modelApiByProperty<T extends IModel>(Api: ModelApi<T>,
                                                     propertyName: keyof T,
                                                     modelEquality?: ModelEqualityFunction<T>) {
  function addToIndex(index: IModelIndex<T>, object: T) {
    const property: any = object[propertyName];
    if (!index.hasOwnProperty(property)) {
      index[property] = [];
    }

    index[property].push(object);
  }

  function removeFromIndex(index: IModelIndex<T>, object: T) {
    const property: any = object[propertyName];
    if (!index.hasOwnProperty(property)) {
      return;
    }

    const newList = index[property].filter((existingObject) => {
      return existingObject.id !== object.id;
    });

    if (newList.length === 0) {
      delete index[property];
    } else {
      index[property] = newList;
    }
  }

  return modelApiReducer(
    [Api],
    {},
    (_model: T) => true,
    (objects: T[]) => {
      const newState: IModelIndex<T> = {};
      objects.forEach((object) => {
        addToIndex(newState, object);
      });

      return newState;
    },
    (state: IModelIndex<T>, object: T) => {
      const newState = {...state};
      addToIndex(newState, object);
      return newState;
    },
    (state: IModelIndex<T>, object: T) => {
      const newState = {...state};
      removeFromIndex(newState, object);
      return newState;
    },
    modelEquality,
  );
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
      case Api.SUCCESSFUL_DELETE_TYPE: {
        const deleted = (action as IApiDeleteResponse<T>).deleted;
        const index = state.findIndex((object) => {
          return object.id === deleted.id;
        });

        if (index === -1) {
          console.warn("API attempt to delete an object which does not exist on client.");
          return state;
        }

        const newState = [...state];
        newState.splice(index, 1);
        return newState;
      }
      default:
        return state;
    }
  };
}
