"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = require("query-string");
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const ProgressBar_1 = require("../../../app/components/ProgressBar");
const actions_1 = require("../../actions");
const AuthenticationState_1 = require("../../model/AuthenticationState");
const uri_1 = require("../../utils/uri");
class OAuth2CompletionPageImpl extends React.Component {
    componentWillMount() {
        this.handleOAuth2AndRedirect(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.handleOAuth2AndRedirect(nextProps);
    }
    render() {
        return (React.createElement("div", { className: "oauth2-completion container d-table" },
            React.createElement("div", { className: "d-table-cell align-middle" },
                React.createElement(ProgressBar_1.ProgressBar, { progress: 100, striped: true, animated: true }))));
    }
    // If not logged in, this will trigger the login.
    // Once the user is logged in, the redux state should change, so new props
    // will be passed and this component should re-render, sparking the redirect
    // path.
    handleOAuth2AndRedirect(props) {
        const queryParams = query_string_1.parse(props.location.hash);
        if (!props.loggedIn) {
            // TODO: Need to handle case where user is not logged in but login failed.
            const provider = props.match.params.provider;
            props.onOAuth2Completion(provider, queryParams);
        }
        else {
            props.clearRedirect();
            // TODO: Should not be "/" here, should be a parameterized default path
            props.history.replace(props.redirectPath ? props.redirectPath : "/");
        }
    }
}
function mapStateToProps(state) {
    return {
        loggedIn: state.auth.loginState === AuthenticationState_1.LoginState.LoggedIn,
        oAuth2CallbackBasePath: state.auth.oAuth2CallbackBasePath,
        redirectPath: state.auth.redirectPath,
        providers: state.auth.socialProviders,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        clearRedirect: () => {
            dispatch(actions_1.clearRedirect());
        },
        dispatchSocialLogin: (api, provider, code, oAuth2CallbackUri) => {
            dispatch(api.socialLogin(provider, code, oAuth2CallbackUri));
        },
        dispatchSocialLoginAccessToken: (api, provider, token) => {
            dispatch(api.socialLoginAccessToken(provider, token));
        },
    };
}
function mergeProps(stateProps, dispatchProps, ownProps) {
    const api = ownProps.api;
    return {
        clearRedirect: dispatchProps.clearRedirect,
        loggedIn: stateProps.loggedIn,
        onOAuth2Completion: (providerName, queryParams) => {
            const provider = stateProps.providers.find((p) => p.providerName === providerName);
            switch (provider.responseType) {
                case (AuthenticationState_1.OAuth2ResponseType.Token): {
                    return dispatchProps.dispatchSocialLoginAccessToken(api, providerName, queryParams.access_token);
                }
                case (AuthenticationState_1.OAuth2ResponseType.Code):
                default: {
                    const { oAuth2CallbackBasePath } = stateProps;
                    const oAuth2CallbackUri = uri_1.buildOAuth2CallbackUri(oAuth2CallbackBasePath, providerName);
                    return dispatchProps.dispatchSocialLogin(api, providerName, queryParams.code, oAuth2CallbackUri);
                }
            }
        },
        redirectPath: stateProps.redirectPath,
    };
}
exports.OAuth2CompletionPage = react_redux_1.connect(mapStateToProps, mapDispatchToProps, mergeProps)(react_router_dom_1.withRouter(OAuth2CompletionPageImpl));
//# sourceMappingURL=OAuth2CompletionPage.js.map