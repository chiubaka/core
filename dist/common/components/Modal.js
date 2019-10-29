"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
class Modal extends React.Component {
    render() {
        const { footer, id, title } = this.props;
        return (React.createElement("div", { className: "modal fade", id: id, tabIndex: -1, role: "dialog", "aria-labelledby": `${id}-label`, "aria-hidden": "true" },
            React.createElement("div", { className: "modal-dialog", role: "document" },
                React.createElement("div", { className: "modal-content" },
                    React.createElement("div", { className: "modal-header" },
                        React.createElement("h5", { className: "modal-title", id: `${id}-label` }, title),
                        React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                    React.createElement("div", { className: "modal-body" }, this.props.children),
                    React.createElement("div", { className: "modal-footer" }, footer)))));
    }
}
exports.Modal = Modal;
//# sourceMappingURL=Modal.js.map