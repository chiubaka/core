"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const Api_1 = require("../../api/actions/Api");
const creators_1 = require("./creators");
const thunks_1 = require("./thunks");
class AuthApi extends Api_1.Api {
    static getInstance() {
        if (!AuthApi.singleton) {
            AuthApi.singleton = new AuthApi();
        }
        return AuthApi.singleton;
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
    login(username, password) {
        return (dispatch, getState) => {
            dispatch(creators_1.startLogin());
            const authState = getState().auth;
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
            const payload = getState().auth.wrapParameters
                ? { user: innerPayload }
                : innerPayload;
            return this.postRequest("/api/login/username/jwt/", payload, dispatch, null)
                .then((response) => {
                if (response) {
                    if (response.token) {
                        dispatch(creators_1.completeLogin(response.token));
                    }
                    if (response.email) {
                        const user = AuthApi.userFromJwtUserResponse(response);
                        dispatch(creators_1.successfulGetUserDetails(user));
                    }
                    else {
                        // TODO: Should really fix the Django server so that it returns the user details
                        // with the tokens--that would allow elimination of this branching code path.
                        // Have to grab new state because we've just updated through dispatch, in theory
                        const token = getState().auth.token;
                        return this.getRequest("/api/users/me/", null, dispatch, token)
                            .then((userDetailsResponse) => {
                            dispatch(creators_1.successfulGetUserDetails(userDetailsResponse));
                        });
                    }
                }
            });
        };
    }
    socialLogin(provider, code, redirectUri) {
        return (dispatch, getState) => {
            dispatch(creators_1.startLogin());
            const payload = {
                provider,
                code,
                redirect_uri: redirectUri,
            };
            return this.postRequest("/api/login/social/jwt_user/", payload, dispatch, getState().auth.token)
                .then((response) => {
                const user = AuthApi.userFromJwtUserResponse(response);
                dispatch(creators_1.completeLogin(response.token));
                dispatch(creators_1.successfulGetUserDetails(user));
            });
        };
    }
    logout() {
        return (dispatch, getState) => {
            const token = getState().auth.token;
            return this.deleteRequest("/api/logout/jwt/", dispatch, token)
                .then(() => {
                dispatch(thunks_1.completeLogoutAndRedirect());
            });
        };
    }
    errorTransformer(_url, _error) {
        return Promise.reject("Invalid credentials.");
    }
    handleUnsuccessfulRequest(reason, dispatch) {
        super.handleUnsuccessfulRequest(reason, dispatch);
        dispatch(creators_1.failLogin(reason));
    }
    handleApiResponse(dispatch, response) {
        switch (response.status) {
            case HttpStatus.OK:
            case HttpStatus.CREATED:
                // Handle pulling the JWT token out of the headers if it appears there.
                const authorizationHeader = response.headers.get("Authorization");
                if (authorizationHeader !== null) {
                    const token = authorizationHeader.split(" ")[1];
                    dispatch(creators_1.completeLogin(token));
                }
                return super.handleApiResponse(dispatch, response);
            case HttpStatus.NO_CONTENT:
                return Promise.resolve("Successfully logged out.");
            case HttpStatus.UNAUTHORIZED:
                return Promise.reject("Invalid credentials.");
            default:
                super.handleApiResponse(dispatch, response);
        }
        return super.handleApiResponse(dispatch, response);
    }
}
exports.AuthApi = AuthApi;

//# sourceMappingURL=../../dist/auth/actions/AuthApi.js.map
