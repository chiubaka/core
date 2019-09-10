"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_orm_1 = require("redux-orm");
class Model extends redux_orm_1.Model {
    constructor() {
        super(...arguments);
        this.forBackend = () => {
            const ref = Object.assign({}, this.ref);
            Model.LOCAL_FIELD_KEYS.forEach((fieldName) => {
                delete ref[fieldName];
            });
            return ref;
        };
    }
}
Model.LOCAL_FIELDS = {
    lastSynced: redux_orm_1.attr(),
    syncing: redux_orm_1.attr(),
};
Model.LOCAL_FIELD_KEYS = new Set(Object.keys(Model.LOCAL_FIELDS));
Model.fields = Object.assign({ id: redux_orm_1.attr() }, Model.LOCAL_FIELDS);
Model.isLocalField = (fieldName) => {
    return Model.LOCAL_FIELD_KEYS.has(fieldName);
};
exports.Model = Model;
//# sourceMappingURL=Model.js.map