"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_dom_1 = require("react-router-dom");
const react_redux_1 = require("react-redux");
const actions_1 = require("../actions");
const LoginPage_1 = require("./LoginPage/LoginPage");
const LogoutPage_1 = require("./LogoutPage");
const OAuth2CompletionPage_1 = require("./OAuth2CompletionPage/OAuth2CompletionPage");
function buildAuth(adapter) {
    const api = new actions_1.AuthApi(adapter);
    const LoginPage = LoginPage_1.buildLoginPage(api);
    const LogoutPage = LogoutPage_1.buildLogoutPage(api);
    const OAuth2CompletionPage = OAuth2CompletionPage_1.buildOAuth2CompletionPage(api);
    class AuthImpl extends React.Component {
        constructor(props) {
            super(props);
            this.renderOAuth2CompletionPage = this.renderOAuth2CompletionPage.bind(this);
            this.renderLoginPage = this.renderLoginPage.bind(this);
        }
        render() {
            const oAuth2CallbackBasePath = this.props.oAuth2CallbackBasePath;
            return (React.createElement("div", { id: "auth" },
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_dom_1.Route, { path: `${oAuth2CallbackBasePath}:provider`, render: this.renderOAuth2CompletionPage }),
                    React.createElement(react_router_dom_1.Route, { path: "/auth/login", render: this.renderLoginPage }),
                    React.createElement(react_router_dom_1.Route, { path: "/auth/logout", component: LogoutPage }))));
        }
        renderOAuth2CompletionPage(props) {
            return (React.createElement(OAuth2CompletionPage, Object.assign({}, props)));
        }
        renderLoginPage(props) {
            return (React.createElement(LoginPage, Object.assign({}, props)));
        }
    }
    function mapStateToProps(state) {
        return {
            oAuth2CallbackBasePath: state.auth.oAuth2CallbackBasePath,
        };
    }
    return react_redux_1.connect(mapStateToProps)(AuthImpl);
}
exports.buildAuth = buildAuth;
exports.Auth = buildAuth();

//# sourceMappingURL=../../dist/auth/pages/Auth.js.map
