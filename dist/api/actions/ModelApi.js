"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:enable:no-unused-variable */
const pluralize = require("pluralize");
const util_1 = require("util");
const Api_1 = require("./Api");
class ModelApi extends Api_1.Api {
    constructor(modelName) {
        super();
        const modelNameUpper = modelName.toUpperCase();
        this.SUCCESSFUL_GET_ALL_TYPE = `SUCCESSFUL_GET_ALL_${pluralize(modelNameUpper)}`;
        this.SUCCESSFUL_GET_TYPE = `SUCCESSFUL_GET_${modelNameUpper}`;
        this.SUCCESSFUL_CREATE_TYPE = `SUCCESSFUL_CREATE_${modelNameUpper}`;
        this.SUCCESSFUL_UPDATE_TYPE = `SUCCESSFUL_UPDATE_${modelNameUpper}`;
        this.SUCCESSFUL_DELETE_TYPE = `SUCCESSFUL_DELETE_${modelNameUpper}`;
        this.endpoint = `${ModelApi.API_PATH}/${pluralize(modelName.toLowerCase())}/`;
        this.modelUpdateDependencies = [];
        this.bulkTransformForFrontend = this.bulkTransformForFrontend.bind(this);
        this.processModelUpdateDependencies = this.processModelUpdateDependencies.bind(this);
    }
    getAll() {
        return this.actionCreator(this.getListEndpoint(), null, "GET", (dispatch, response) => {
            dispatch(this.successfulGetAllAction(response));
        }, null, this.bulkTransformForFrontend);
    }
    get(id) {
        return this.actionCreator(this.getItemEndpoint(id), null, "GET", (dispatch, response) => {
            dispatch(this.successfulGetAction(response));
        }, null, this.transformForFrontend);
    }
    getListEndpoint() {
        return this.endpoint;
    }
    getItemEndpoint(id) {
        return `${this.endpoint}${id}/`;
    }
    create(payload) {
        return this.actionCreator(this.getListEndpoint(), payload, "POST", (dispatch, response) => {
            dispatch(this.successfulCreateAction(response));
            this.processModelUpdateDependencies(dispatch, response);
        }, this.transformForBackend, this.transformForFrontend);
    }
    update(original, updated) {
        return this.actionCreator(this.getItemEndpoint(updated.id), updated, "PUT", (dispatch, response) => {
            dispatch(this.successfulUpdateAction(original, response));
            this.processModelUpdateDependencies(dispatch, original);
            this.processModelUpdateDependencies(dispatch, response);
        }, this.transformForBackend, this.transformForFrontend);
    }
    createOrUpdate(original, updated) {
        if (original && original.id) {
            return this.update(original, updated);
        }
        else {
            return this.create(updated);
        }
    }
    delete(deleted) {
        return this.actionCreator(this.getItemEndpoint(deleted.id), null, "DELETE", (dispatch, _response) => {
            dispatch(this.successfulDeleteAction(deleted));
        });
    }
    successfulGetAllAction(payload) {
        return {
            type: this.SUCCESSFUL_GET_ALL_TYPE,
            payload,
        };
    }
    successfulGetAction(payload) {
        return {
            type: this.SUCCESSFUL_GET_TYPE,
            payload,
        };
    }
    successfulCreateAction(payload) {
        return {
            type: this.SUCCESSFUL_CREATE_TYPE,
            payload,
        };
    }
    successfulUpdateAction(original, payload) {
        return {
            type: this.SUCCESSFUL_UPDATE_TYPE,
            original,
            payload,
        };
    }
    successfulDeleteAction(deleted) {
        return {
            type: this.SUCCESSFUL_DELETE_TYPE,
            deleted,
        };
    }
    addModelUpdateDependency(idMapper, dependentApiAction, apiThisArg) {
        this.modelUpdateDependencies.push({ idMapper, modelApiAction: dependentApiAction.bind(apiThisArg) });
    }
    transformForFrontend(object) {
        return object;
    }
    transformForBackend(object) {
        return object;
    }
    bulkTransformForFrontend(objects) {
        return objects.map(this.transformForFrontend);
    }
    processModelUpdateDependencies(dispatch, modelObject) {
        this.modelUpdateDependencies.forEach((dependency) => {
            const dependencyIds = dependency.idMapper(modelObject);
            if (!util_1.isNullOrUndefined(dependencyIds)) {
                dependencyIds.forEach((dependencyId) => {
                    if (!util_1.isNullOrUndefined(dependencyId)) {
                        dispatch(dependency.modelApiAction(dependencyId));
                    }
                });
            }
        });
    }
}
ModelApi.API_PATH = "/api";
exports.ModelApi = ModelApi;

//# sourceMappingURL=../../dist/api/actions/ModelApi.js.map
