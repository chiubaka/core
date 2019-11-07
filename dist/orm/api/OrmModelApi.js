"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
const selectors_1 = require("../selectors");
const GraphQLApiAdapter_1 = require("./adapters/GraphQLApiAdapter");
class OrmModelApi {
    constructor(model, orm, options) {
        this.list = (options) => {
            return (dispatch) => __awaiter(this, void 0, void 0, function* () {
                dispatch(actions_1.startListingModel(this.model));
                return this.adapter.list(options).then((instances) => {
                    dispatch(actions_1.successfulListModel(this.model, instances));
                    return instances;
                });
            });
        };
        this.search = (searchTerm, options) => {
            return (dispatch) => __awaiter(this, void 0, void 0, function* () {
                dispatch(actions_1.startSearchingModel(this.model));
                return this.adapter.search(searchTerm, options).then((instances) => {
                    dispatch(actions_1.successfulSearchModel(this.model, instances));
                    return instances;
                });
            });
        };
        this.get = (id, options) => {
            return (dispatch) => __awaiter(this, void 0, void 0, function* () {
                dispatch(actions_1.startGettingModel(this.model, id));
                return this.adapter.get(id, options).then((instance) => {
                    dispatch(actions_1.successfulGetModel(this.model, instance));
                    return instance;
                });
            });
        };
        this.create = (payload, options) => {
            return (dispatch) => __awaiter(this, void 0, void 0, function* () {
                const id = this.model.generateId(payload);
                dispatch(actions_1.createModel(this.model, Object.assign({ id }, payload)));
                return dispatch(this.sync(id, options)).then((result) => {
                    return result;
                });
            });
        };
        this.update = (payload, options) => {
            return (dispatch) => __awaiter(this, void 0, void 0, function* () {
                const id = payload.id;
                dispatch(actions_1.updateModel(this.model, payload));
                return dispatch(this.sync(id, options)).then((result) => {
                    return result;
                });
            });
        };
        this.sync = (id, options) => {
            return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
                dispatch(actions_1.startSyncingModel(this.model, id));
                const current = selectors_1.modelSelector(this.orm, this.model, id)(getState().orm);
                if (current == null) {
                    return Promise.reject(`No ${this.model.modelName} instance found with id ${id}`);
                }
                return this.adapter.upsert(current.forBackend(), options).then((updated) => {
                    dispatch(actions_1.successfulSyncModel(this.model, updated));
                    return updated;
                });
            });
        };
        this.delete = (id, options) => {
            return (dispatch) => __awaiter(this, void 0, void 0, function* () {
                dispatch(actions_1.startDestroyingModel(this.model, id));
                return this.adapter.delete(id, options).then((_deleted) => {
                    const promise = dispatch(actions_1.successfulDestroyModel(this.model, id));
                    dispatch(actions_1.destroyModel(this.model, id));
                    return promise;
                });
            });
        };
        this.adapter = (options != null && options.adapter)
            || new GraphQLApiAdapter_1.GraphQLApiAdapter(model, options != null && options.adapterOptions);
        this.model = model;
        this.orm = orm;
    }
}
exports.OrmModelApi = OrmModelApi;
//# sourceMappingURL=OrmModelApi.js.map