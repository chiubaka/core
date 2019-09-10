"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const adapters_1 = require("../../ModelApi/adapters");
class RestApiAdapter extends adapters_1.RestApiAdapter {
    constructor() {
        super(...arguments);
        this.search = (query) => {
            const payload = {
                query,
            };
            return this.client.actionCreator(this.getSearchEndpoint(), payload, "GET", (dispatch, response) => {
                dispatch(this.api.successfulSearchAction(response));
            }, null, this.api.bulkTransformForFrontend);
        };
    }
    getSearchEndpoint() {
        return `${this.endpoint}search/`;
    }
}
exports.RestApiAdapter = RestApiAdapter;
//# sourceMappingURL=RestApiAdapter.js.map