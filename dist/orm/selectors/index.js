"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_orm_1 = require("redux-orm");
exports.modelSelector = (orm, model, id) => {
    return redux_orm_1.createSelector(orm, (session) => {
        return session[model.modelName].withId(id);
    });
};
//# sourceMappingURL=index.js.map