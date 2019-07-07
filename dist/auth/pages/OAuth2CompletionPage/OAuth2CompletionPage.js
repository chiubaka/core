"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = require("query-string");
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const ProgressBar_1 = require("../../../app/components/ProgressBar");
const actions_1 = require("../../actions");
const AuthenticationState_1 = require("../../model/AuthenticationState");
const uri_1 = require("../../utils/uri");
function buildOAuth2CompletionPage(api) {
    class OAuth2CompletionPage extends React.Component {
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
        handleOAuth2AndRedirect(props) {
            const queryParams = query_string_1.parse(props.location.search);
            const code = queryParams.code;
            if (!props.loggedIn) {
                // TODO: Need to handle case where user is not logged in but login failed.
                const provider = props.match.params.provider;
                const { hostname, oAuth2CallbackBasePath, port, useSsl } = props;
                const oAuth2CallbackUri = uri_1.buildOAuth2CallbackUri(hostname, oAuth2CallbackBasePath, provider, port, useSsl);
                props.onOAuth2Completion(provider, code, oAuth2CallbackUri);
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
            hostname: state.service.hostname,
            loggedIn: state.auth.loginState === AuthenticationState_1.LoginState.LoggedIn,
            oAuth2CallbackBasePath: state.auth.oAuth2CallbackBasePath,
            port: state.service.port,
            useSsl: state.service.useSsl,
            redirectPath: state.auth.redirectPath,
        };
    }
    function mapDispatchToProps(dispatch) {
        return {
            clearRedirect: () => {
                dispatch(actions_1.clearRedirect());
            },
            onOAuth2Completion: (provider, code, oAuth2CallbackUri) => {
                dispatch(api.socialLogin(provider, code, oAuth2CallbackUri));
            },
        };
    }
    return react_redux_1.connect(mapStateToProps, mapDispatchToProps)(react_router_dom_1.withRouter(OAuth2CompletionPage));
}
exports.buildOAuth2CompletionPage = buildOAuth2CompletionPage;

//# sourceMappingURL=../../../dist/auth/pages/OAuth2CompletionPage/OAuth2CompletionPage.js.map
