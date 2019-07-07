"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api_1 = require("../../../api/actions/Api");
const creators_1 = require("../creators");
const RestApiAdapter_1 = require("./adapters/RestApiAdapter");
class AuthApi extends Api_1.Api {
    constructor(adapter = RestApiAdapter_1.RestApiAdapter.getInstance()) {
        super(adapter);
    }
    login(username, password) {
        return (dispatch, getState) => {
            const adapter = this.getAdapter();
            if (adapter.socialLoginAccessToken == null) {
                this.unimplementedError("login");
                return;
            }
            dispatch(creators_1.startLogin());
            return adapter.login(username, password, dispatch, getState().auth);
        };
    }
    socialLogin(provider, code, redirectUri) {
        return (dispatch, getState) => {
            const adapter = this.getAdapter();
            if (adapter.socialLoginAccessToken == null) {
                this.unimplementedError("socialLogin");
                return;
            }
            dispatch(creators_1.startLogin());
            return adapter.socialLogin(provider, code, redirectUri, dispatch, getState().auth);
        };
    }
    socialLoginAccessToken(provider, token) {
        return (dispatch, getState) => {
            const adapter = this.getAdapter();
            if (adapter.socialLoginAccessToken == null) {
                this.unimplementedError("socialLoginAccessToken");
                return;
            }
            dispatch(creators_1.startLogin());
            return adapter.socialLoginAccessToken(provider, token, dispatch, getState().auth);
        };
    }
    logout() {
        return (dispatch, getState) => {
            return this.getAdapter().logout(dispatch, getState().auth);
        };
    }
    unimplementedError(methodName) {
        console.error(`AuthApi adapter does not implement ${methodName}! Implement this method or use a different adapter.`);
    }
}
exports.AuthApi = AuthApi;

//# sourceMappingURL=../../../dist/auth/actions/api/AuthApi.js.map
