"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function startCreatingModel(model, payload) {
    return {
        type: types_1.ModelActionType.START_CREATING_MODEL,
        modelName: model.modelName,
        payload,
    };
}
exports.startCreatingModel = startCreatingModel;
function createModel(model, payload) {
    const payloadWithId = payload;
    if (payloadWithId.id == null) {
        payloadWithId.id = model.generateId(payload);
    }
    return {
        type: types_1.ModelActionType.CREATE_MODEL,
        modelName: model.modelName,
        payload: payloadWithId,
    };
}
exports.createModel = createModel;
function startUpdatingModel(model, id) {
    return {
        type: types_1.ModelActionType.START_UPDATING_MODEL,
        modelName: model.modelName,
        id,
    };
}
exports.startUpdatingModel = startUpdatingModel;
function updateModel(model, payload) {
    return {
        type: types_1.ModelActionType.UPDATE_MODEL,
        modelName: model.modelName,
        payload,
    };
}
exports.updateModel = updateModel;
function destroyModel(model, id) {
    return {
        type: types_1.ModelActionType.DESTROY_MODEL,
        modelName: model.modelName,
        id,
    };
}
exports.destroyModel = destroyModel;
function startListingModel(model) {
    return {
        type: types_1.ModelActionType.START_LISTING_MODEL,
        modelName: model.modelName,
    };
}
exports.startListingModel = startListingModel;
function successfulListModel(model, items) {
    return {
        type: types_1.ModelActionType.SUCCESSFUL_LIST_MODEL,
        modelName: model.modelName,
        items,
    };
}
exports.successfulListModel = successfulListModel;
function startSearchingModel(model) {
    return {
        type: types_1.ModelActionType.START_SEARCHING_MODEL,
        modelName: model.modelName,
    };
}
exports.startSearchingModel = startSearchingModel;
function successfulSearchModel(model, items) {
    return {
        type: types_1.ModelActionType.SUCCESSFUL_SEARCH_MODEL,
        modelName: model.modelName,
        items,
    };
}
exports.successfulSearchModel = successfulSearchModel;
function startGettingModel(model, id) {
    return {
        type: types_1.ModelActionType.START_GETTING_MODEL,
        modelName: model.modelName,
        id,
    };
}
exports.startGettingModel = startGettingModel;
function successfulGetModel(model, payload) {
    return {
        type: types_1.ModelActionType.SUCCESSFUL_GET_MODEL,
        modelName: model.modelName,
        payload,
    };
}
exports.successfulGetModel = successfulGetModel;
function startSyncingModel(model, id) {
    return {
        type: types_1.ModelActionType.START_SYNCING_MODEL,
        modelName: model.modelName,
        id,
    };
}
exports.startSyncingModel = startSyncingModel;
function successfulSyncModel(model, payload) {
    return {
        type: types_1.ModelActionType.SUCCESSFUL_SYNC_MODEL,
        modelName: model.modelName,
        payload,
    };
}
exports.successfulSyncModel = successfulSyncModel;
function startDestroyingModel(model, id) {
    return {
        type: types_1.ModelActionType.START_DESTROYING_MODEL,
        modelName: model.modelName,
        id,
    };
}
exports.startDestroyingModel = startDestroyingModel;
//# sourceMappingURL=creators.js.map