"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const Cookies = require("../utils/storage");
var LoginState;
(function (LoginState) {
    LoginState[LoginState["NotLoggedIn"] = 0] = "NotLoggedIn";
    LoginState[LoginState["LoggingIn"] = 1] = "LoggingIn";
    LoginState[LoginState["LoggedIn"] = 2] = "LoggedIn";
    LoginState[LoginState["LoggingOut"] = 3] = "LoggingOut";
})(LoginState = exports.LoginState || (exports.LoginState = {}));
exports.DEFAULT_AUTH_STATE = {
    enableNonSocialLogin: false,
    useEmailAsUsername: false,
    wrapParameters: false,
    loginState: LoginState.NotLoggedIn,
    socialProviders: [],
    oAuth2CallbackBasePath: "/auth/login/oauth2/complete/",
};
function getExistingAuthState(overrideState) {
    const token = Cookies.getToken();
    const user = Cookies.getUser();
    const redirectPath = Cookies.getRedirectPath();
    return Object.assign({}, exports.DEFAULT_AUTH_STATE, { token,
        user, loginState: !util_1.isNullOrUndefined(token) ? LoginState.LoggedIn : LoginState.NotLoggedIn, redirectPath }, overrideState);
}
exports.getExistingAuthState = getExistingAuthState;

//# sourceMappingURL=../../dist/auth/model/AuthenticationState.js.map