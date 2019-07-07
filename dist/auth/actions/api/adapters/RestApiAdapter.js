"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthRestClient_1 = require("../../../clients/AuthRestClient");
const creators_1 = require("../../creators");
const thunks_1 = require("../../thunks");
class RestApiAdapter {
    constructor(client = new AuthRestClient_1.AuthRestClient()) {
        this.login = (username, password, dispatch, authState) => {
            const innerPayload = authState.useEmailAsUsername
                ? { email: username, password }
                : { username, password };
            // Some auth systems expect parameters in the form:
            // {
            //   user: {
            //     email: test@test.com
            //     password: testtest
            //   }
            // }
            const payload = authState.wrapParameters
                ? { user: innerPayload }
                : innerPayload;
            return this.client.postRequest("/api/login/username/jwt/", payload, dispatch, null)
                .then((response) => {
                if (response) {
                    if (response.token) {
                        dispatch(creators_1.completeLogin(response.token));
                    }
                    if (response.email) {
                        const user = RestApiAdapter.userFromJwtUserResponse(response);
                        dispatch(creators_1.successfulGetUserDetails(user));
                    }
                    else {
                        // TODO: Should really fix the Django server so that it returns the user details
                        // with the tokens--that would allow elimination of this branching code path.
                        // Have to grab new state because we've just updated through dispatch, in theory
                        const token = authState.token;
                        return this.client.getRequest("/api/users/me/", null, dispatch, token)
                            .then((userDetailsResponse) => {
                            dispatch(creators_1.successfulGetUserDetails(userDetailsResponse));
                        });
                    }
                }
            });
        };
        this.socialLogin = (provider, code, redirectUri, dispatch, authState) => {
            const payload = {
                provider,
                code,
                redirect_uri: redirectUri,
            };
            return this.client.postRequest("/api/login/social/jwt_user/", payload, dispatch, authState.token)
                .then((response) => {
                const user = RestApiAdapter.userFromJwtUserResponse(response);
                dispatch(creators_1.completeLogin(response.token));
                dispatch(creators_1.successfulGetUserDetails(user));
            });
        };
        this.logout = (dispatch, authState) => {
            return this.client.deleteRequest("/api/logout/jwt/", dispatch, authState.token)
                .then(() => {
                dispatch(thunks_1.completeLogoutAndRedirect());
            });
        };
        this.client = client;
    }
    static getInstance() {
        if (!RestApiAdapter.singleton) {
            RestApiAdapter.singleton = new RestApiAdapter();
        }
        return RestApiAdapter.singleton;
    }
    static userFromJwtUserResponse(response) {
        return {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
        };
    }
}
exports.RestApiAdapter = RestApiAdapter;

//# sourceMappingURL=../../../../dist/auth/actions/api/adapters/RestApiAdapter.js.map
