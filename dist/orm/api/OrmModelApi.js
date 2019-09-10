"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
const selectors_1 = require("../selectors");
const GraphQLApiAdapter_1 = require("./adapters/GraphQLApiAdapter");
class OrmModelApi {
    constructor(model, orm, adapter) {
        this.list = () => {
            return (dispatch) => {
                dispatch(actions_1.startListingModel(this.model));
                return this.adapter.list().then((instances) => {
                    dispatch(actions_1.successfulListModel(this.model, instances));
                });
            };
        };
        this.sync = (id) => {
            return (dispatch, getState) => {
                dispatch(actions_1.startSyncingModel(this.model, id));
                const current = selectors_1.modelSelector(this.orm, this.model, id)(getState().orm);
                if (current == null) {
                    return Promise.reject(`No ${this.model.modelName} instance found with id ${id}`);
                }
                return this.adapter.upsert(current.forBackend()).then((updated) => {
                    dispatch(actions_1.successfulSyncModel(this.model, updated));
                });
            };
        };
        this.adapter = adapter || new GraphQLApiAdapter_1.GraphQLApiAdapter(model);
        this.model = model;
        this.orm = orm;
    }
}
exports.OrmModelApi = OrmModelApi;
//# sourceMappingURL=OrmModelApi.js.map