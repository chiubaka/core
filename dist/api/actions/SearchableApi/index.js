"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const ModelApi_1 = require("../ModelApi");
const adapters_1 = require("./adapters");
class SearchableModelApi extends ModelApi_1.ModelApi {
    constructor(modelName, adapter) {
        adapter = adapter || new adapters_1.RestApiAdapter(modelName);
        super(modelName, adapter);
        this.SUCCESSFUL_SEARCH_TYPE = `SUCCESSFUL_SEARCH_${pluralize(modelName.toUpperCase())}`;
    }
    search(query) {
        return this.getAdapter().search(query);
    }
    successfulSearchAction(payload) {
        return {
            type: this.SUCCESSFUL_SEARCH_TYPE,
            payload,
        };
    }
    getAdapter() {
        return super.getAdapter();
    }
}
exports.SearchableModelApi = SearchableModelApi;

//# sourceMappingURL=../../../dist/api/actions/SearchableApi/index.js.map
