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
const PrivacyPolicyModal_1 = require("../PrivacyPolicyModal/PrivacyPolicyModal");
class Footer extends React.Component {
    render() {
        const disclaimer = this.props.disclaimer;
        return (React.createElement("div", { className: "footer bg-dark px-3 py-5" },
            React.createElement("div", { className: "container d-flex flex-row" },
                React.createElement("div", { className: "copyright text-light" },
                    "\u00A9 Chiubaka Technologies, LLC 2018. All rights reserved. ",
                    disclaimer ? this.props.disclaimer : ""),
                React.createElement("div", { style: { paddingTop: "5px", flexGrow: 1, textAlign: "right" } },
                    React.createElement("a", { href: "#", "data-toggle": "modal", "data-target": "#privacy-policy", title: "Privacy Policy" }, "Privacy Policy"))),
            React.createElement(PrivacyPolicyModal_1.PrivacyPolicyModal, null)));
    }
}
exports.Footer = Footer;
//# sourceMappingURL=Footer.js.map