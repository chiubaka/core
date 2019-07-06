"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const uri_1 = require("../utils/uri");
class SocialLoginButtonImpl extends React.Component {
    render() {
        const providerName = this.props.providerName;
        return (React.createElement("a", { className: `btn btn-block btn-social btn-${providerName}`, href: `${this.props.oAuth2Uri}` },
            React.createElement("span", { className: `fa fa-${providerName}` }),
            "Sign in with ",
            providerName[0].toUpperCase() + providerName.slice(1)));
    }
}
SocialLoginButtonImpl.OAUTH2_GATEWAYS = {
    facebook: "https://www.facebook.com/v2.10/dialog/oauth",
    google: "https://accounts.google.com/o/oauth2/v2/auth",
};
// Provides provider providerName aliases as shims since social-app-django differentiates between Google and
// Google OAuth2. We don't support anything other than OAuth2, so internally there's no need for that.
SocialLoginButtonImpl.OAUTH2_PROVIDER_ALIAS = {
    google: "google-oauth2",
};
SocialLoginButtonImpl.OAUTH2_ADDITIONAL_PARAMETERS = {
    facebook: {
        response_type: "code",
    },
    google: {
        response_type: "code",
        scope: "profile email",
    },
};
function mapStateToProps(state, ownProps) {
    const { clientId, providerName } = ownProps;
    const { hostname, port, useSsl } = state.service;
    const oAuth2CallbackBasePath = state.auth.oAuth2CallbackBasePath;
    const providerAlias = SocialLoginButtonImpl.OAUTH2_PROVIDER_ALIAS[ownProps.providerName];
    const redirectUri = uri_1.buildOAuth2CallbackUri(hostname, oAuth2CallbackBasePath, providerAlias ? providerAlias : providerName, port, useSsl);
    if (!(providerName in SocialLoginButtonImpl.OAUTH2_GATEWAYS)) {
        console.error(`Unrecognized social auth provider ${providerName}.`);
    }
    const oAuth2Gateway = SocialLoginButtonImpl.OAUTH2_GATEWAYS[providerName];
    let oAuth2Uri = `${oAuth2Gateway}?client_id=${clientId}&redirect_uri=${redirectUri}`;
    const additionalParameters = SocialLoginButtonImpl.OAUTH2_ADDITIONAL_PARAMETERS[providerName];
    if (additionalParameters) {
        for (const key in additionalParameters) {
            if (additionalParameters.hasOwnProperty(key)) {
                oAuth2Uri += `&${key}=${additionalParameters[key]}`;
            }
        }
    }
    return {
        oAuth2Uri,
    };
}
exports.SocialLoginButton = react_redux_1.connect(mapStateToProps)(SocialLoginButtonImpl);

//# sourceMappingURL=../../dist/auth/components/SocialLoginButton.js.map
