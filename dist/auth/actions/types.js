"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeCache = {};
function type(label) {
    if (typeCache[label]) {
        throw new Error(`Action type "${label}" is not unique`);
    }
    typeCache[label] = true;
    return label;
}
exports.ActionTypes = {
    START_LOGIN: type("START_LOGIN"),
    COMPLETE_LOGIN: type("COMPLETE_LOGIN"),
    SUCCESSFUL_GET_USER_DETAILS: type("SUCCESSFUL_GET_USER_DETAILS"),
    FAIL_LOGIN: type("FAIL_LOGIN"),
    START_LOGOUT: type("START_LOGOUT"),
    COMPLETE_LOGOUT: type("COMPLETE_LOGOUT"),
    SET_REDIRECT: type("SET_REDIRECT"),
    CLEAR_REDIRECT: type("CLEAR_REDIRECT"),
};
//# sourceMappingURL=types.js.map