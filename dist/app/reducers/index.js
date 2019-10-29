"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@blueprintjs/core");
const actions_1 = require("../../api/actions");
function identityReducer(defaultState) {
    return (state = defaultState, _action) => {
        return state;
    };
}
exports.identityReducer = identityReducer;
let ErrorToaster = null;
document.addEventListener("DOMContentLoaded", () => {
    ErrorToaster = core_1.Toaster.create();
});
function product(defaultState) {
    return (state = defaultState, action) => {
        switch (action.type) {
            case actions_1.Api.UNSUCCESSFUL_API_REQUEST_TYPE:
                const messages = new Set(ErrorToaster.getToasts().map((props) => props.message));
                const message = action.reason;
                if (!messages.has(message)) {
                    ErrorToaster.show({
                        message,
                        intent: core_1.Intent.DANGER,
                    });
                }
            default:
                return state;
        }
    };
}
exports.product = product;
//# sourceMappingURL=index.js.map