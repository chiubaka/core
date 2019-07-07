"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api_1 = require("../../../api/actions/Api");
const creators_1 = require("../creators");
const RestApiAdapter_1 = require("./RestApiAdapter");
class AuthApi extends Api_1.Api {
    constructor(adapter = RestApiAdapter_1.RestApiAdapter.getInstance()) {
        super(adapter);
    }
    login(username, password) {
        return (dispatch, getState) => {
            dispatch(creators_1.startLogin());
            return this.getAdapter().login(username, password, dispatch, getState().auth);
        };
    }
    socialLogin(provider, code, redirectUri) {
        return (dispatch, getState) => {
            dispatch(creators_1.startLogin());
            this.getAdapter().socialLogin(provider, code, redirectUri, dispatch, getState().auth);
        };
    }
    logout() {
        return (dispatch, getState) => {
            this.getAdapter().logout(dispatch, getState().auth);
        };
    }
}
exports.AuthApi = AuthApi;

//# sourceMappingURL=../../../dist/auth/actions/api/AuthApi.js.map
