"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Api {
    constructor(adapter) {
        this.adapter = adapter;
    }
    static unsuccessfulRequest(reason) {
        return {
            type: Api.UNSUCCESSFUL_API_REQUEST_TYPE,
            reason,
        };
    }
    getAdapter() {
        return this.adapter;
    }
}
Api.UNSUCCESSFUL_API_REQUEST_TYPE = "UNSUCCESSFUL_API_REQUEST";
exports.Api = Api;
//# sourceMappingURL=Api.js.map