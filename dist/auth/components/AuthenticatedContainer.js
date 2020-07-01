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
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const AuthenticationState_1 = require("../model/AuthenticationState");
class AuthenticatedContainerImpl extends React.Component {
    componentWillMount() {
        this.checkAuthentication(this.props);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.checkAuthentication(nextProps);
        }
    }
    render() {
        if (this.props.isLoggedIn) {
            return (React.createElement("div", { id: this.props.id, className: this.props.className }, this.props.children));
        }
        else {
            return null;
        }
    }
    checkAuthentication(props) {
        const { history } = props;
        if (!props.isLoggedIn) {
            history.replace({ pathname: props.loginPath, state: { redirectPath: props.location.pathname } });
        }
    }
}
AuthenticatedContainerImpl.defaultProps = {
    loginPath: "/auth/login",
};
function mapStateToProps(state) {
    return {
        isLoggedIn: !(state.auth.loginState === AuthenticationState_1.LoginState.NotLoggedIn),
    };
}
exports.AuthenticatedContainer = react_redux_1.connect(mapStateToProps)(react_router_dom_1.withRouter(AuthenticatedContainerImpl));
//# sourceMappingURL=AuthenticatedContainer.js.map