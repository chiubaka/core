"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const RestClient_1 = require("../../api/clients/RestClient");
const creators_1 = require("../actions/creators");
class AuthRestClient extends RestClient_1.RestClient {
    // TODO: Some code smell here around having to rename the singleton private var
    // Had to do this because apparently otherwise the type conflicts with the
    // super class... and then I was concerned that I'd accidentally get one instance
    // between this class and the super.
    static getInstance() {
        if (!AuthRestClient.authSingleton) {
            AuthRestClient.authSingleton = new AuthRestClient();
        }
        return AuthRestClient.authSingleton;
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
exports.AuthRestClient = AuthRestClient;

//# sourceMappingURL=../../dist/auth/clients/AuthRestClient.js.map
