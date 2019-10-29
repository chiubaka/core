"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_orm_1 = require("redux-orm");
exports.modelIdsSelector = (orm, model, sortFn = null) => {
    return redux_orm_1.createSelector(orm, (session) => {
        const instances = session[model.modelName].all().toModelArray();
        if (sortFn != null) {
            instances.sort(sortFn);
        }
        return instances.map((instance) => instance.id);
    });
};
exports.modelSelector = (orm, model, id) => {
    return redux_orm_1.createSelector(orm, (session) => {
        return session[model.modelName].withId(id);
    });
};
//# sourceMappingURL=index.js.map