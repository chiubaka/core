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
const Cookies = __importStar(require("../utils/storage"));
var LoginState;
(function (LoginState) {
    LoginState[LoginState["NotLoggedIn"] = 0] = "NotLoggedIn";
    LoginState[LoginState["LoggingIn"] = 1] = "LoggingIn";
    LoginState[LoginState["LoggedIn"] = 2] = "LoggedIn";
    LoginState[LoginState["LoggingOut"] = 3] = "LoggingOut";
})(LoginState = exports.LoginState || (exports.LoginState = {}));
var OAuth2ResponseType;
(function (OAuth2ResponseType) {
    OAuth2ResponseType["Code"] = "code";
    OAuth2ResponseType["Token"] = "token";
})(OAuth2ResponseType = exports.OAuth2ResponseType || (exports.OAuth2ResponseType = {}));
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
//# sourceMappingURL=AuthenticationState.js.map