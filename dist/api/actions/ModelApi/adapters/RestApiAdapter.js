"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const RestClient_1 = require("../../../clients/RestClient");
class RestApiAdapter {
    constructor(modelName, client = RestClient_1.RestClient.getInstance()) {
        this.getAll = () => {
            return this.client.actionCreator(this.getListEndpoint(), null, "GET", (dispatch, response) => {
                dispatch(this.api.successfulGetAllAction(response));
            }, null, this.api.bulkTransformForFrontend);
        };
        this.get = (id) => {
            return this.client.actionCreator(this.getItemEndpoint(id), null, "GET", (dispatch, response) => {
                dispatch(this.api.successfulGetAction(response));
            }, null, this.api.transformForFrontend);
        };
        this.create = (payload) => {
            return this.client.actionCreator(this.getListEndpoint(), payload, "POST", (dispatch, response) => {
                dispatch(this.api.successfulCreateAction(response));
                this.api.processModelUpdateDependencies(dispatch, response);
            }, this.api.transformForBackend, this.api.transformForFrontend);
        };
        this.update = (original, updated) => {
            return this.client.actionCreator(this.getItemEndpoint(updated.id), updated, "PUT", (dispatch, response) => {
                dispatch(this.api.successfulUpdateAction(original, response));
                this.api.processModelUpdateDependencies(dispatch, original);
                this.api.processModelUpdateDependencies(dispatch, response);
            }, this.api.transformForBackend, this.api.transformForFrontend);
        };
        this.delete = (deleted) => {
            return this.client.actionCreator(this.getItemEndpoint(deleted.id), null, "DELETE", (dispatch, _response) => {
                dispatch(this.api.successfulDeleteAction(deleted));
            });
        };
        this.client = client;
        this.endpoint = `${RestApiAdapter.API_PATH}/${pluralize(modelName.toLowerCase())}/`;
    }
    setApi(api) {
        this.api = api;
    }
    getListEndpoint() {
        return this.endpoint;
    }
    getItemEndpoint(id) {
        return `${this.endpoint}${id}/`;
    }
}
RestApiAdapter.API_PATH = "/api";
exports.RestApiAdapter = RestApiAdapter;

//# sourceMappingURL=../../../../dist/api/actions/ModelApi/adapters/RestApiAdapter.js.map
