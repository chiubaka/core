"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function startLogin() {
    return {
        type: types_1.ActionTypes.START_LOGIN,
    };
}
exports.startLogin = startLogin;
// TODO: rest-social-auth documentation doesn't reference a token expiration parameter, but I should find and set one
function completeLogin(token) {
    return {
        type: types_1.ActionTypes.COMPLETE_LOGIN,
        token,
    };
}
exports.completeLogin = completeLogin;
function successfulGetUserDetails(user) {
    return {
        type: types_1.ActionTypes.SUCCESSFUL_GET_USER_DETAILS,
        user,
    };
}
exports.successfulGetUserDetails = successfulGetUserDetails;
function failLogin(error) {
    return {
        type: types_1.ActionTypes.FAIL_LOGIN,
        error,
    };
}
exports.failLogin = failLogin;
function completeLogout() {
    return {
        type: types_1.ActionTypes.COMPLETE_LOGOUT,
    };
}
exports.completeLogout = completeLogout;
function setRedirect(redirectPath) {
    return {
        type: types_1.ActionTypes.SET_REDIRECT,
        redirectPath,
    };
}
exports.setRedirect = setRedirect;
function clearRedirect() {
    return {
        type: types_1.ActionTypes.CLEAR_REDIRECT,
    };
}
exports.clearRedirect = clearRedirect;

//# sourceMappingURL=../../dist/auth/actions/creators.js.map
