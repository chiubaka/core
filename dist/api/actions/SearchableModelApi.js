"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:enable:no-unused-variable */
const pluralize = require("pluralize");
const ModelApi_1 = require("./ModelApi");
class SearchableModelApi extends ModelApi_1.ModelApi {
    constructor(modelName) {
        super(modelName);
        this.SUCCESSFUL_SEARCH_TYPE = `SUCCESSFUL_SEARCH_${pluralize(modelName.toUpperCase())}`;
    }
    search(query) {
        const payload = {
            query,
        };
        return this.actionCreator(this.getSearchEndpoint(), payload, "GET", (dispatch, response) => {
            dispatch(this.successfulSearchAction(response));
        }, null, this.bulkTransformForFrontend);
    }
    getSearchEndpoint() {
        return `${this.endpoint}search/`;
    }
    successfulSearchAction(payload) {
        return {
            type: this.SUCCESSFUL_SEARCH_TYPE,
            payload,
        };
    }
}
exports.SearchableModelApi = SearchableModelApi;

//# sourceMappingURL=../../dist/api/actions/SearchableModelApi.js.map
