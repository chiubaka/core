"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const index_1 = require("../actions/index");
const AuthenticationState_1 = require("../model/AuthenticationState");
const Cookies = __importStar(require("../utils/storage"));
function auth(state = AuthenticationState_1.DEFAULT_AUTH_STATE, action) {
    switch (action.type) {
        case index_1.ActionTypes.START_LOGIN:
            return Object.assign({}, state, { loginState: AuthenticationState_1.LoginState.LoggingIn });
        case index_1.ActionTypes.COMPLETE_LOGIN:
            const token = action.token;
            Cookies.setToken(token);
            return Object.assign({}, state, { loginState: !util_1.isNullOrUndefined(token) ? AuthenticationState_1.LoginState.LoggedIn : AuthenticationState_1.LoginState.NotLoggedIn, token });
        case index_1.ActionTypes.SUCCESSFUL_GET_USER_DETAILS:
            const user = action.user;
            Cookies.setUser(user);
            return Object.assign({}, state, { user });
        case index_1.ActionTypes.START_LOGOUT:
            return Object.assign({}, state, { loginState: AuthenticationState_1.LoginState.LoggingOut });
        case index_1.ActionTypes.FAIL_LOGIN:
        case index_1.ActionTypes.COMPLETE_LOGOUT:
            Cookies.removeToken();
            Cookies.removeUser();
            return Object.assign({}, state, { token: undefined, user: undefined, loginState: AuthenticationState_1.LoginState.NotLoggedIn });
        case index_1.ActionTypes.SET_REDIRECT:
            const redirectPath = action.redirectPath;
            Cookies.setRedirectPath(redirectPath);
            return Object.assign({}, state, { redirectPath });
        case index_1.ActionTypes.CLEAR_REDIRECT:
            Cookies.removeRedirectPath();
            return Object.assign({}, state, { redirectPath: undefined });
        default:
            return state;
    }
}
exports.auth = auth;
//# sourceMappingURL=index.js.map