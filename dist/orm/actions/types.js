"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModelActionType;
(function (ModelActionType) {
    ModelActionType["START_SYNCING_MODEL"] = "START_SYNCING_MODEL";
    ModelActionType["SUCCESSFUL_SYNC_MODEL"] = "SUCCESSFUL_SYNC_MODEL";
    ModelActionType["START_LISTING_MODEL"] = "START_LISTING_MODEL";
    ModelActionType["SUCCESSFUL_LIST_MODEL"] = "SUCCESSFUL_LIST_MODEL";
    ModelActionType["START_SEARCHING_MODEL"] = "START_SEARCHING_MODEL";
    ModelActionType["SUCCESSFUL_SEARCH_MODEL"] = "SUCCESSFUL_SEARCH_MODEL";
    ModelActionType["START_GETTING_MODEL"] = "START_GETTING_MODEL";
    ModelActionType["SUCCESSFUL_GET_MODEL"] = "SUCCESSFUL_GET_MODEL";
    ModelActionType["START_DESTROYING_MODEL"] = "START_DESTROYING_MODEL";
    ModelActionType["START_CREATING_MODEL"] = "START_CREATING_MODEL";
    ModelActionType["CREATE_MODEL"] = "CREATE_MODEL";
    ModelActionType["START_UPDATING_MODEL"] = "START_UPDATING_MODEL";
    ModelActionType["UPDATE_MODEL"] = "UPDATE_MODEL";
    ModelActionType["DESTROY_MODEL"] = "DESTROY_MODEL";
})(ModelActionType = exports.ModelActionType || (exports.ModelActionType = {}));
function isModelAction(action) {
    return action.modelName != null;
}
exports.isModelAction = isModelAction;
//# sourceMappingURL=types.js.map