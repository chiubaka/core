"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const util_1 = require("util");
const thunks_1 = require("../../auth/actions/thunks");
class Api {
    static unsuccessfulRequest(reason) {
        return {
            type: Api.UNSUCCESSFUL_API_REQUEST_TYPE,
            reason,
        };
    }
    // TODO: authPrefix should be customizable based on app configs somehow
    static apiHeaders(accessToken, authPrefix = "Bearer") {
        const headers = new Headers();
        if (accessToken) {
            headers.append("Authorization", `${authPrefix} ${accessToken}`);
        }
        headers.append("Content-Type", "application/json");
        return headers;
    }
    static encodeUrlParams(payload) {
        return Object.keys(payload).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(payload[key]);
        }).join("&");
    }
    errorTransformer(_url, error) {
        let errorMessage = "";
        for (const field in error) {
            if (error.hasOwnProperty(field)) {
                error[field].forEach((message) => {
                    errorMessage += message + " ";
                });
            }
        }
        return Promise.reject(errorMessage.trim());
    }
    handleUnsuccessfulRequest(reason, dispatch) {
        dispatch(Api.unsuccessfulRequest(reason));
    }
    actionCreator(pathname, payload, method, onSuccess, payloadTransformer, responseTransformer) {
        return (dispatch, getState) => {
            const transformedPayload = payloadTransformer ? payloadTransformer(payload) : payload;
            return this.requestWithPayload(pathname, transformedPayload, method, dispatch, getState().auth.token)
                .then((response) => {
                const transformedResponse = responseTransformer ? responseTransformer(response) : response;
                onSuccess(dispatch, transformedResponse);
                return transformedResponse;
            });
        };
    }
    getRequest(pathname, payload, dispatch, token) {
        return this.requestWithPayload(pathname, payload, "GET", dispatch, token);
    }
    postRequest(pathname, payload, dispatch, token) {
        return this.requestWithPayload(pathname, payload, "POST", dispatch, token);
    }
    putRequest(pathname, payload, dispatch, token) {
        return this.requestWithPayload(pathname, payload, "PUT", dispatch, token);
    }
    deleteRequest(pathname, dispatch, token) {
        return this.request(pathname, dispatch, token, {
            method: "DELETE",
        });
    }
    handleApiResponse(dispatch, response) {
        switch (response.status) {
            case HttpStatus.OK:
            case HttpStatus.CREATED:
                return response.json();
            case HttpStatus.NO_CONTENT:
                return null;
            case HttpStatus.UNAUTHORIZED:
                dispatch(thunks_1.completeLogoutAndRedirect());
                return Promise.reject("You are not logged in.");
            case HttpStatus.FORBIDDEN:
                return Promise.reject("You have insufficient permissions to perform this action.");
            case HttpStatus.BAD_REQUEST:
                return response.json().then(this.errorTransformer.bind(this, response.url));
            case HttpStatus.INTERNAL_SERVER_ERROR:
            case HttpStatus.GATEWAY_TIMEOUT:
                return Promise.reject("An unexpected error has occurred. Please try again later.");
            default:
                return Promise.reject(`Received unexpected status code ${response.status}`);
        }
    }
    requestWithPayload(pathname, payload, method, dispatch, token) {
        pathname = method === "GET" && !util_1.isNullOrUndefined(payload)
            ? `${pathname}?${Api.encodeUrlParams(payload)}`
            : pathname;
        return this.request(pathname, dispatch, token, {
            method,
            body: util_1.isNullOrUndefined(payload) || method === "GET" ? undefined : JSON.stringify(payload),
        });
    }
    request(pathname, dispatch, token, requestOptions = {}) {
        return fetch(pathname, Object.assign({ headers: Api.apiHeaders(token) }, requestOptions))
            .then((response) => {
            return this.handleApiResponse(dispatch, response);
        })
            .catch((reason) => {
            this.handleUnsuccessfulRequest(reason, dispatch);
            return Promise.reject(reason);
        });
    }
}
Api.UNSUCCESSFUL_API_REQUEST_TYPE = "UNSUCCESSFUL_API_REQUEST";
exports.Api = Api;

//# sourceMappingURL=../../dist/api/actions/Api.js.map
