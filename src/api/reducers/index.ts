import { Action } from "redux";
import { IApiDeleteResponse, IApiResponse, IApiUpdateResponse, ModelApi, SearchableModelApi } from "../actions";
import { IModel, IModelById, IModelIndex } from "../model";

export declare type ModelFilterFunction<T> = (model: T) => boolean;
export declare type ModelEqualityFunction<T> = (model1: T, model2: T) => boolean;
export declare type GetObjectsReducer<StateType, ModelType> = (objects: ModelType[]) => StateType;
export declare type MergeObjectReducer<StateType, ModelType> = (
  state: StateType,
  object: ModelType,
  locator?: any,
) => StateType;
export declare type ObjectLocatorFunction<StateType, ModelType> = (state: StateType, object: ModelType) => any;

// By default, filter nothing out.
function defaultModelFilterFunction<T>(_object: T) {
  return true;
}

// By default, consider nothing equal and always update. This is usually more
// work than we need to do.
function defaultModelEqualityFunction<T>(_object1: T, _object2: T) {
  return false;
}

function propertyExistsInState(propertyName: string, state: any, object: any) {
  const property = object[propertyName];
  return state.hasOwnProperty(property);
}

interface IModelApiReducerOptions<StateT, ModelT> {
  Apis: Array<ModelApi<ModelT>>;
  initialState: StateT;
  // Handles adding numerous objects to the state, e.g. on initial load.
  onBulkObjectAdd: GetObjectsReducer<StateT, ModelT>;
  // Hanldes adding a single object to the state.
  onObjectAdd: MergeObjectReducer<StateT, ModelT>;
  // Handles removing a single object from the state. May be called in contexts
  // where the object is not in the state for certain. Must not error out in this
  // situation.
  onObjectRemove: MergeObjectReducer<StateT, ModelT>;
  // Optionally helps to optimize determining whether or not an object is already
  // in the state. Providing this allows us to avoid removal calls in certain cases.
  // We expect it to return a locator which will get passed to onObjectAdd or onObjectRemove.
  // If you provide this function, your onObjectAdd and onObjectRemove can optionally use
  // the locator as metadata during the operation.
  // Originally this was just a function returning a boolean for existence. It morphed this
  // way because e.g. for array states, we need to update the object in places when possible
  // otherwise we may cause an unexpected re-order in the UI.
  objectLocator?: ObjectLocatorFunction<StateT, ModelT>;
  // Defines the filter scope of this reducer. By default, no objects are ever filtered
  // out. However, if one only cares about objects with certain attributes (e.g. Tasks that
  // are in a certain state), this can be used to quickly construct reducers with limited
  // scope based off of a less specific API.
  modelFilter?: ModelFilterFunction<ModelT>;
  // Defines whether or not two model objects are equal. By default, we always return false.
  // Providing this is an optimization, which allows us to short circuit some work in some cases.
  modelEquality?: ModelEqualityFunction<ModelT>;
}

interface IModelApiReducerByPropertyOptions<T> extends IModelApiReducerSimpleOptions<T> {
  propertyName: keyof T;
}

interface IModelApiReducerSimpleOptions<T> {
  Api: ModelApi<T>;
  modelFilter?: ModelFilterFunction<T>;
  modelEquality?: ModelEqualityFunction<T>;
}

interface ISearchableModelApiReducerOptions<T> {
  Api: SearchableModelApi<T>;
}

export function modelApiReducer<StateT, ModelT extends IModel>(options: IModelApiReducerOptions<StateT, ModelT>) {
  const {
    Apis,
    initialState,
    onBulkObjectAdd,
    onObjectAdd,
    onObjectRemove,
    objectLocator,
  } = options;

  const modelFilter = options.modelFilter || defaultModelFilterFunction;
  const modelEquality = options.modelEquality || defaultModelEqualityFunction;

  const getAllTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_GET_ALL_TYPE));
  const getTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_GET_TYPE));
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
    } else if (getTypes.has(action.type)) {
      const object = (action as IApiResponse<ModelT>).payload;
      if (modelFilter(object)) {
        const locator = (objectLocator && objectLocator(state, object)) || null;
        if (!locator) {
          return onObjectAdd(state, object);
        } else {
          return onObjectAdd(onObjectRemove(state, object, locator), object, locator);
        }
      }
    } else if (updateTypes.has(action.type)) {
      const { original, payload } = (action as IApiUpdateResponse<ModelT>);
      if (!modelFilter(original) && modelFilter(payload)) {
        // If the original object didn't match this reducer's filter scope, but the
        // new one does, then we know we can just add the new object because the old
        // one isn't already in our state (we ignored it before)
        return onObjectAdd(state, payload);
      } else if (modelFilter(original) && !modelFilter(payload)) {
        // If the original object matched this reducer's filter scope, but the new
        // one doesn't, then we know we can just remove the existing tracked object
        // and ignore the new one.
        return onObjectRemove(state, original);
      } else if (modelFilter(original) && modelFilter(payload)) {
        // If both the original and the new object are in this reducer's filter scope
        // then we should do a removal of the old object and an insertion of the new
        // one. However, don't bother doing this if we detect that the objects are
        // actually the same.
        if (modelEquality && !modelEquality(original, payload)) {
          const locator = (objectLocator && objectLocator(state, original)) || null;
          return onObjectAdd(onObjectRemove(state, original, locator), payload, locator);
        }
      }
    } else if (deleteTypes.has(action.type)) {
      const deleted = (action as IApiDeleteResponse<ModelT>).deleted;
      return onObjectRemove(state, deleted);
    }
    return state;
  };
}

export function modelApiById<T extends IModel>(options: IModelApiReducerSimpleOptions<T>) {
  return modelApiByUniqueProperty({
    ...options,
    propertyName: "id",
  });
}

export function modelApiByUniqueProperty<T extends IModel>(options: IModelApiReducerByPropertyOptions<T>) {
  const {
    Api,
    propertyName,
    modelFilter,
    modelEquality,
  } = options;

  return modelApiReducer({
    Apis: [Api],
    initialState: {},
    onBulkObjectAdd: (objects: T[]) => {
      const newState: IModelById<T> = {};
      objects.forEach((object) => {
        const property = object[propertyName];
        newState[property] = object;
      });
      return newState;
    },
    onObjectAdd: (state: IModelById<T>, object: T) => {
      const newState = {...state};
      const property = object[propertyName];
      newState[property] = object;
      return newState;
    },
    onObjectRemove: (state: IModelById<T>, object: T) => {
      const property = object[propertyName];
      const newState = {...state};
      delete newState[property];
      return newState;
    },
    objectLocator: propertyExistsInState.bind(this, propertyName),
    modelFilter,
    modelEquality,
  });
}

export function modelApiByProperty<T extends IModel>(options: IModelApiReducerByPropertyOptions<T>) {
  const {
    Api,
    propertyName,
    modelFilter,
    modelEquality,
  } = options;

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

  return modelApiReducer({
    Apis: [Api],
    initialState: {},
    onBulkObjectAdd: (objects: T[]) => {
      const newState: IModelIndex<T> = {};
      objects.forEach((object) => {
        addToIndex(newState, object);
      });
      return newState;
    },
    onObjectAdd: (state: IModelIndex<T>, object: T) => {
      const newState = {...state};
      addToIndex(newState, object);
      return newState;
    },
    onObjectRemove: (state: IModelIndex<T>, object: T) => {
      const newState = {...state};
      removeFromIndex(newState, object);
      return newState;
    },
    objectLocator: propertyExistsInState.bind(this, propertyName),
    modelFilter,
    modelEquality,
  });
}

// TODO: The below works, and handles refactoring modelApiAsArray to use the modelApiReducer
// as a scaffold, but has a small bug
export function modelApiAsArray<T extends IModel>(options: IModelApiReducerSimpleOptions<T>) {
  const {
    Api,
    modelFilter,
    modelEquality,
  } = options;

  return modelApiReducer({
    Apis: [Api],
    initialState: [],
    onBulkObjectAdd: (objects: T[]) => {
      return objects;
    },
    onObjectAdd: (state: T[], object: T, locator: number) => {
      if (locator) {
        const newState = [...state];
        newState.splice(locator, 0, object);
        return newState;
      }

      return [...state, object];
    },
    onObjectRemove: (state: T[], object: T, locator: number) => {
      // TODO: The equality function here could probably just be a modelEquality function
      const index = locator || state.findIndex((o) => {
        return object.id === o.id;
      });

      if (index === -1) {
        console.warn("API attempt to remove an object which does not exist on client.");
        return state;
      }

      const newState = [...state];
      newState.splice(index, 1);
      return newState;
    },
    objectLocator: (state: T[], object: T) => {
      const index = state.indexOf(object);
      return index === -1 ? null : index;
    },
    modelFilter,
    modelEquality,
  });
}

export function searchableModelApiAsArray<ModelT extends IModel>(options: ISearchableModelApiReducerOptions<ModelT>) {
  const Api = options.Api;

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
