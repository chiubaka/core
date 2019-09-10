"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
function ormReducer(orm) {
    return (database = orm.getEmptyState(), action) => {
        const session = orm.session(database);
        const model = getModel(action, session);
        if (model == null) {
            return session.state;
        }
        switch (action.type) {
            case actions_1.ModelActionType.CREATE_MODEL: {
                createModel(model, action);
                break;
            }
            case actions_1.ModelActionType.UPDATE_MODEL: {
                updateModel(model, action);
                break;
            }
            case actions_1.ModelActionType.DESTROY_MODEL: {
                destroyModel(model, action);
                break;
            }
            case actions_1.ModelActionType.SUCCESSFUL_LIST_MODEL: {
                successfulListModel(model, action);
                break;
            }
            case actions_1.ModelActionType.START_SYNCING_MODEL: {
                startSyncingModel(model, action);
                break;
            }
            case actions_1.ModelActionType.SUCCESSFUL_SYNC_MODEL: {
                successfulSyncModel(model, action);
                break;
            }
        }
        return session.state;
    };
}
exports.ormReducer = ormReducer;
function getModel(action, session) {
    if (actions_1.isModelAction(action)) {
        return session[action.modelName];
    }
    return null;
}
function createModel(model, action) {
    model.create(action.payload);
}
function updateModel(model, action) {
    const payload = action.payload;
    model.withId(payload.id).update(payload);
}
function destroyModel(model, action) {
    model.withId(action.id).delete();
}
function successfulListModel(model, action) {
    action.items.forEach((item) => {
        model.upsert(Object.assign({}, item, { lastSynced: Date.now(), syncing: false }));
    });
}
function startSyncingModel(model, action) {
    model.withId(action.id).update({ syncing: true });
}
function successfulSyncModel(model, action) {
    const updatedAction = Object.assign({}, action, { payload: Object.assign({}, action.payload, { lastSynced: Date.now(), syncing: false }) });
    updateModel(model, updatedAction);
}
//# sourceMappingURL=ormReducer.js.map