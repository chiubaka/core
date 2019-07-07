"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const util_1 = require("util");
const Api_1 = require("../Api");
const adapters_1 = require("./adapters");
class ModelApi extends Api_1.Api {
    constructor(modelName, adapter) {
        adapter = adapter || new adapters_1.RestApiAdapter(modelName);
        super(adapter);
        // TODO: There's some code smell in having to create a bilateral reference here...
        // Doing this also forces a lot of ModelApi methods which should be private to instead
        // be public...
        adapter.setApi(this);
        const modelNameUpper = modelName.toUpperCase();
        this.SUCCESSFUL_GET_ALL_TYPE = `SUCCESSFUL_GET_ALL_${pluralize(modelNameUpper)}`;
        this.SUCCESSFUL_GET_TYPE = `SUCCESSFUL_GET_${modelNameUpper}`;
        this.SUCCESSFUL_CREATE_TYPE = `SUCCESSFUL_CREATE_${modelNameUpper}`;
        this.SUCCESSFUL_UPDATE_TYPE = `SUCCESSFUL_UPDATE_${modelNameUpper}`;
        this.SUCCESSFUL_DELETE_TYPE = `SUCCESSFUL_DELETE_${modelNameUpper}`;
        this.modelUpdateDependencies = [];
        this.bulkTransformForFrontend = this.bulkTransformForFrontend.bind(this);
        this.processModelUpdateDependencies = this.processModelUpdateDependencies.bind(this);
    }
    getAll() {
        return this.getAdapter().getAll();
    }
    get(id) {
        return this.getAdapter().get(id);
    }
    create(payload) {
        return this.getAdapter().create(payload);
    }
    update(original, updated) {
        return this.getAdapter().update(original, updated);
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
        return this.getAdapter().delete(deleted);
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
exports.ModelApi = ModelApi;

//# sourceMappingURL=../../../dist/api/actions/ModelApi/index.js.map
