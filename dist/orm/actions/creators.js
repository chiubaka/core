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

//# sourceMappingURL=../../dist/orm/actions/creators.js.map
