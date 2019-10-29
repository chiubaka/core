"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const util_1 = require("util");
exports.TOKEN_KEY = "token";
exports.USER_KEY = "user";
exports.REDIRECT_PATH_KEY = "redirectPath";
// TODO: Default value of 1 here, represents the 1 day value placed in the Django server code
// for auth token expiry. Would be great to not define this in both places...
function setUser(user, expires = 1) {
    localStorage.setItem(exports.USER_KEY, JSON.stringify(user));
    set(exports.USER_KEY, user, expires);
}
exports.setUser = setUser;
function getUser() {
    return get(exports.USER_KEY);
}
exports.getUser = getUser;
function removeUser() {
    remove(exports.USER_KEY);
}
exports.removeUser = removeUser;
function setToken(token, expires = 1) {
    set(exports.TOKEN_KEY, token, expires);
}
exports.setToken = setToken;
function getToken() {
    return get(exports.TOKEN_KEY);
}
exports.getToken = getToken;
function removeToken() {
    remove(exports.TOKEN_KEY);
}
exports.removeToken = removeToken;
function setRedirectPath(redirectPath) {
    set(exports.REDIRECT_PATH_KEY, redirectPath);
}
exports.setRedirectPath = setRedirectPath;
function getRedirectPath() {
    return get(exports.REDIRECT_PATH_KEY);
}
exports.getRedirectPath = getRedirectPath;
function removeRedirectPath() {
    remove(exports.REDIRECT_PATH_KEY);
}
exports.removeRedirectPath = removeRedirectPath;
function set(key, data, expires) {
    const container = {
        createdAt: moment_1.default().format(),
        expires,
        data,
    };
    localStorage.setItem(key, JSON.stringify(container));
}
function get(key) {
    const item = localStorage.getItem(key);
    if (util_1.isNullOrUndefined(item)) {
        return null;
    }
    const container = JSON.parse(item);
    // If expired, return null
    const { createdAt, expires, data } = container;
    if (!expires || moment_1.default().isBefore(moment_1.default(createdAt).add(expires, "days"))) {
        return data;
    }
    else {
        localStorage.removeItem(key);
        return null;
    }
}
function remove(key) {
    localStorage.removeItem(key);
}
//# sourceMappingURL=storage.js.map