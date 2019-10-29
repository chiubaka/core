"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
// By default, filter nothing out.
function defaultModelFilterFunction(_object) {
    return true;
}
// By default, consider nothing equal and always update. This is usually more
// work than we need to do.
function defaultModelEqualityFunction(_object1, _object2) {
    return false;
}
function modelIdEquality(object1, object2) {
    return object1.id === object2.id;
}
function propertyExistsInState(propertyName, state, object) {
    const property = object[propertyName];
    return state.hasOwnProperty(property);
}
function modelApiReducer(options) {
    const { Apis, initialState, onBulkObjectAdd, onObjectAdd, onObjectRemove, objectLocator, } = options;
    const modelFilter = options.modelFilter || defaultModelFilterFunction;
    const modelEquality = options.modelEquality || defaultModelEqualityFunction;
    const getAllTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_GET_ALL_TYPE));
    const getTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_GET_TYPE));
    const createTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_CREATE_TYPE));
    const updateTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_UPDATE_TYPE));
    const deleteTypes = new Set(Apis.map((Api) => Api.SUCCESSFUL_DELETE_TYPE));
    return (state = initialState, action) => {
        if (getAllTypes.has(action.type)) {
            const objects = action.payload.filter(modelFilter);
            return onBulkObjectAdd(objects);
        }
        else if (createTypes.has(action.type)) {
            const object = action.payload;
            if (modelFilter(object)) {
                return onObjectAdd(state, object);
            }
        }
        else if (getTypes.has(action.type)) {
            const object = action.payload;
            if (modelFilter(object)) {
                const locator = objectLocator ? objectLocator(state, object) : null;
                if (util_1.isNullOrUndefined(locator)) {
                    return onObjectAdd(state, object);
                }
                else {
                    return onObjectAdd(onObjectRemove(state, object, locator), object, locator);
                }
            }
        }
        else if (updateTypes.has(action.type)) {
            const { original, payload } = action;
            if (!modelFilter(original) && modelFilter(payload)) {
                // If the original object didn't match this reducer's filter scope, but the
                // new one does, then we know we can just add the new object because the old
                // one isn't already in our state (we ignored it before)
                return onObjectAdd(state, payload);
            }
            else if (modelFilter(original) && !modelFilter(payload)) {
                // If the original object matched this reducer's filter scope, but the new
                // one doesn't, then we know we can just remove the existing tracked object
                // and ignore the new one.
                return onObjectRemove(state, original);
            }
            else if (modelFilter(original) && modelFilter(payload)) {
                // If both the original and the new object are in this reducer's filter scope
                // then we should do a removal of the old object and an insertion of the new
                // one. However, don't bother doing this if we detect that the objects are
                // actually the same.
                if (modelEquality && !modelEquality(original, payload)) {
                    const locator = objectLocator ? objectLocator(state, original) : null;
                    return onObjectAdd(onObjectRemove(state, original, locator), payload, locator);
                }
            }
        }
        else if (deleteTypes.has(action.type)) {
            const deleted = action.deleted;
            return onObjectRemove(state, deleted);
        }
        return state;
    };
}
exports.modelApiReducer = modelApiReducer;
function modelApiById(options) {
    return modelApiByUniqueProperty(Object.assign({}, options, { propertyName: "id" }));
}
exports.modelApiById = modelApiById;
function modelApiByUniqueProperty(options) {
    const { Api, propertyName, modelFilter, modelEquality, } = options;
    return modelApiReducer({
        Apis: [Api],
        initialState: {},
        onBulkObjectAdd: (objects) => {
            const newState = {};
            objects.forEach((object) => {
                const property = object[propertyName];
                newState[property] = object;
            });
            return newState;
        },
        onObjectAdd: (state, object) => {
            const newState = Object.assign({}, state);
            const property = object[propertyName];
            newState[property] = object;
            return newState;
        },
        onObjectRemove: (state, object) => {
            const property = object[propertyName];
            const newState = Object.assign({}, state);
            delete newState[property];
            return newState;
        },
        objectLocator: propertyExistsInState.bind(this, propertyName),
        modelFilter,
        modelEquality,
    });
}
exports.modelApiByUniqueProperty = modelApiByUniqueProperty;
function modelApiByProperty(options) {
    const { Api, propertyName, modelFilter, modelEquality, } = options;
    function addToIndex(index, object) {
        const property = object[propertyName];
        if (!index.hasOwnProperty(property)) {
            index[property] = [];
        }
        index[property].push(object);
    }
    function removeFromIndex(index, object) {
        const property = object[propertyName];
        if (!index.hasOwnProperty(property)) {
            return;
        }
        const newList = index[property].filter((existingObject) => {
            return existingObject.id !== object.id;
        });
        if (newList.length === 0) {
            delete index[property];
        }
        else {
            index[property] = newList;
        }
    }
    return modelApiReducer({
        Apis: [Api],
        initialState: {},
        onBulkObjectAdd: (objects) => {
            const newState = {};
            objects.forEach((object) => {
                addToIndex(newState, object);
            });
            return newState;
        },
        onObjectAdd: (state, object) => {
            const newState = Object.assign({}, state);
            addToIndex(newState, object);
            return newState;
        },
        onObjectRemove: (state, object) => {
            const newState = Object.assign({}, state);
            removeFromIndex(newState, object);
            return newState;
        },
        objectLocator: propertyExistsInState.bind(this, propertyName),
        modelFilter,
        modelEquality,
    });
}
exports.modelApiByProperty = modelApiByProperty;
// TODO: The below works, and handles refactoring modelApiAsArray to use the modelApiReducer
// as a scaffold, but has a small bug
function modelApiAsArray(options) {
    const { Api, modelFilter, modelEquality, } = options;
    return modelApiReducer({
        Apis: [Api],
        initialState: [],
        onBulkObjectAdd: (objects) => {
            return objects;
        },
        onObjectAdd: (state, object, locator) => {
            if (!util_1.isNullOrUndefined(locator) && locator >= 0) {
                const newState = [...state];
                newState.splice(locator, 0, object);
                return newState;
            }
            return [...state, object];
        },
        onObjectRemove: (state, object, locator) => {
            const index = util_1.isNullOrUndefined(locator) ? state.findIndex(modelIdEquality.bind(this, object)) : locator;
            if (index === -1) {
                console.warn("API attempt to remove an object which does not exist on client.");
                return state;
            }
            const newState = [...state];
            newState.splice(index, 1);
            return newState;
        },
        objectLocator: (state, object) => {
            const index = state.findIndex(modelIdEquality.bind(this, object));
            return index === -1 ? null : index;
        },
        modelFilter,
        modelEquality,
    });
}
exports.modelApiAsArray = modelApiAsArray;
function searchableModelApiAsArray(options) {
    const Api = options.Api;
    return (state = [], action) => {
        if (action.type === Api.SUCCESSFUL_SEARCH_TYPE) {
            return action.payload;
        }
        else if (action.type === Api.SUCCESSFUL_UPDATE_TYPE) {
            const updated = action.payload;
            const newState = [...state];
            const index = newState.findIndex((model) => model.id === updated.id);
            if (index !== -1) {
                newState[index] = updated;
            }
            return newState;
        }
        return state;
    };
}
exports.searchableModelApiAsArray = searchableModelApiAsArray;
//# sourceMappingURL=index.js.map