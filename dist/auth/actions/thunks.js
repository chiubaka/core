"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connected_react_router_1 = require("connected-react-router");
const creators_1 = require("./creators");
// Performs the deletion of the JWT token before redirecting the user back out to the login page.
// NOTE: In almost all cases you want AuthApi.getInstance().logout() instead. That method also
// handles hitting the API backend to revoke the JWT token as an extra precaution.
function completeLogoutAndRedirect() {
    return (dispatch, _getState) => {
        dispatch(creators_1.completeLogout());
        dispatch(connected_react_router_1.push("/auth/login", {
            // TODO: This path should be configurable.
            redirectPath: "/app",
        }));
    };
}
exports.completeLogoutAndRedirect = completeLogoutAndRedirect;
//# sourceMappingURL=thunks.js.map