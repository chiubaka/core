"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api_1 = require("../../../api/actions/Api");
const creators_1 = require("../creators");
const thunks_1 = require("../thunks");
const adapters_1 = require("./adapters");
class AuthApi extends Api_1.Api {
    constructor(adapter = adapters_1.GraphQLApiAdapter.getInstance()) {
        super(adapter);
    }
    login(username, password) {
        return (dispatch, getState) => {
            const adapter = this.getAdapter();
            if (adapter.login == null) {
                return this.unimplementedError("login");
            }
            dispatch(creators_1.startLogin());
            return adapter.login(username, password, dispatch, getState().auth);
        };
    }
    socialLogin(provider, code, redirectUri) {
        return (dispatch, getState) => {
            const adapter = this.getAdapter();
            if (adapter.socialLogin == null) {
                return this.unimplementedError("socialLogin");
            }
            dispatch(creators_1.startLogin());
            return adapter.socialLogin(provider, code, redirectUri, dispatch, getState().auth);
        };
    }
    socialLoginAccessToken(provider, token) {
        return (dispatch, getState) => {
            const adapter = this.getAdapter();
            if (adapter.socialLoginAccessToken == null) {
                return this.unimplementedError("socialLoginAccessToken");
            }
            dispatch(creators_1.startLogin());
            return adapter.socialLoginAccessToken(provider, token, dispatch, getState().auth);
        };
    }
    logout() {
        return (dispatch, getState) => {
            return this.getAdapter().logout(dispatch, getState().auth).then(() => {
                dispatch(thunks_1.completeLogoutAndRedirect());
            });
        };
    }
    unimplementedError(methodName) {
        throw new Error(`AuthApi adapter does not implement ${methodName}! Implement this method or use a different adapter.`);
    }
}
exports.AuthApi = AuthApi;
//# sourceMappingURL=AuthApi.js.map