"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const AuthenticationState_1 = require("../model/AuthenticationState");
const uri_1 = require("../utils/uri");
class SocialLoginButtonImpl extends React.Component {
    render() {
        const providerName = this.props.provider.providerName;
        return (React.createElement("a", { className: `btn btn-block btn-social btn-${providerName}`, href: `${this.props.oAuth2Uri}` },
            React.createElement("span", { className: `fa fa-${providerName}` }),
            "Sign in with ",
            providerName[0].toUpperCase() + providerName.slice(1)));
    }
}
SocialLoginButtonImpl.OAUTH2_GATEWAYS = {
    facebook: "https://www.facebook.com/v3.3/dialog/oauth",
    google: "https://accounts.google.com/o/oauth2/v2/auth",
};
// Provides provider providerName aliases as shims since social-app-django differentiates between Google and
// Google OAuth2. We don't support anything other than OAuth2, so internally there's no need for that.
SocialLoginButtonImpl.OAUTH2_PROVIDER_ALIAS = {
    google: "google-oauth2",
};
function mapStateToProps(state, ownProps) {
    const provider = ownProps.provider;
    const { clientId, providerName, responseType } = provider;
    if (!(providerName in SocialLoginButtonImpl.OAUTH2_GATEWAYS)) {
        console.error(`Unrecognized social auth provider ${providerName}.`);
    }
    const { hostname, port, useSsl } = state.service;
    const oAuth2CallbackBasePath = state.auth.oAuth2CallbackBasePath;
    const providerAlias = SocialLoginButtonImpl.OAUTH2_PROVIDER_ALIAS[providerName];
    const oAuth2Gateway = SocialLoginButtonImpl.OAUTH2_GATEWAYS[providerName];
    const scope = provider.scope.join(" ");
    let oAuth2Uri = `${oAuth2Gateway}?client_id=${clientId}&response_type=${responseType}&scope=${scope}`;
    if (responseType === AuthenticationState_1.OAuth2ResponseType.Code) {
        const redirectUri = uri_1.buildOAuth2CallbackUri(hostname, oAuth2CallbackBasePath, providerAlias ? providerAlias : providerName, port, useSsl);
        oAuth2Uri = `${oAuth2Uri}&redirect_uri=${redirectUri}`;
    }
    return {
        oAuth2Uri,
    };
}
exports.SocialLoginButton = react_redux_1.connect(mapStateToProps)(SocialLoginButtonImpl);

//# sourceMappingURL=../../dist/auth/components/SocialLoginButton.js.map
