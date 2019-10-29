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
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const actions_1 = require("../actions");
const LoginPage_1 = require("./LoginPage");
const LogoutPage_1 = require("./LogoutPage");
const OAuth2CompletionPage_1 = require("./OAuth2CompletionPage");
class AuthImpl extends React.Component {
    constructor(props) {
        super(props);
        this.render = () => {
            const oAuth2CallbackBasePath = this.props.oAuth2CallbackBasePath;
            return (React.createElement("div", { id: "auth" },
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_dom_1.Route, { path: `${oAuth2CallbackBasePath}:provider`, render: this.renderOAuth2CompletionPage }),
                    React.createElement(react_router_dom_1.Route, { path: "/auth/login", render: this.renderLoginPage }),
                    React.createElement(react_router_dom_1.Route, { path: "/auth/logout", render: this.renderLogoutPage }))));
        };
        this.renderOAuth2CompletionPage = (props) => {
            return (React.createElement(OAuth2CompletionPage_1.OAuth2CompletionPage, Object.assign({}, props, { api: this.state.api })));
        };
        this.renderLoginPage = (props) => {
            return (React.createElement(LoginPage_1.LoginPage, Object.assign({}, props, { api: this.state.api })));
        };
        this.renderLogoutPage = () => {
            return (React.createElement(LogoutPage_1.LogoutPage, { api: this.state.api }));
        };
        this.state = {
            api: new actions_1.AuthApi(props.adapter),
        };
    }
}
function mapStateToProps(state) {
    return {
        oAuth2CallbackBasePath: state.auth.oAuth2CallbackBasePath,
    };
}
exports.Auth = react_redux_1.connect(mapStateToProps)(AuthImpl);
//# sourceMappingURL=Auth.js.map