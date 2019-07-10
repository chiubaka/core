"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModelActionType;
(function (ModelActionType) {
    ModelActionType["START_SYNCING_MODEL"] = "START_SYNCING_MODEL";
    ModelActionType["SUCCESSFUL_SYNC_MODEL"] = "SUCCESSFUL_SYNC_MODEL";
    ModelActionType["SUCCESSFUL_LIST_MODEL"] = "SUCCESSFUL_LIST_MODEL";
    ModelActionType["CREATE_MODEL"] = "CREATE_MODEL";
    ModelActionType["UPDATE_MODEL"] = "UPDATE_MODEL";
    ModelActionType["DESTROY_MODEL"] = "DESTROY_MODEL";
})(ModelActionType = exports.ModelActionType || (exports.ModelActionType = {}));
function isModelAction(action) {
    return action.modelName != null;
}
exports.isModelAction = isModelAction;

//# sourceMappingURL=../../dist/orm/actions/index.js.map
