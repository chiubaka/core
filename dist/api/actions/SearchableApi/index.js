"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = __importDefault(require("pluralize"));
const ModelApi_1 = require("../ModelApi");
const adapters_1 = require("./adapters");
class SearchableModelApi extends ModelApi_1.ModelApi {
    constructor(modelName, adapter) {
        adapter = adapter || new adapters_1.RestApiAdapter(modelName);
        super(modelName, adapter);
        this.SUCCESSFUL_SEARCH_TYPE = `SUCCESSFUL_SEARCH_${pluralize_1.default(modelName.toUpperCase())}`;
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
//# sourceMappingURL=index.js.map