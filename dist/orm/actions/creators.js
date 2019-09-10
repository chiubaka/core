"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("../model");
const types_1 = require("./types");
function createModel(model, payload) {
    const payloadWithId = payload;
    if (payloadWithId.id == null) {
        payloadWithId.id = model_1.generateId();
    }
    return {
        type: types_1.ModelActionType.CREATE_MODEL,
        modelName: model.modelName,
        payload: payloadWithId,
    };
}
exports.createModel = createModel;
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
//# sourceMappingURL=creators.js.map