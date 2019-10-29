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
class LogoutPageImpl extends React.Component {
    componentWillMount() {
        this.props.onLogout();
    }
    render() {
        return null;
    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        dispatchLogout: (api) => {
            dispatch(api.logout());
            const redirectUri = ownProps.redirectUri ? ownProps.redirectUri : "/";
            ownProps.history.replace(redirectUri);
        },
    };
}
function mergeProps(_stateProps, dispatchProps, ownProps) {
    const api = ownProps.api;
    return {
        onLogout: () => {
            dispatchProps.dispatchLogout(api);
        },
    };
}
exports.LogoutPage = react_router_dom_1.withRouter(react_redux_1.connect(null, mapDispatchToProps, mergeProps)(LogoutPageImpl));
//# sourceMappingURL=LogoutPage.js.map