"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const actions_1 = require("../actions");
class LogoutPage extends React.Component {
    componentWillMount() {
        this.props.onLogout();
    }
    render() {
        return null;
    }
}
function mapDispatchToProps(dispatch, ownProps) {
    return {
        onLogout: () => {
            dispatch(actions_1.AuthApi.getInstance().logout());
            const redirectUri = ownProps.redirectUri ? ownProps.redirectUri : "/";
            ownProps.history.replace(redirectUri);
        },
    };
}
exports.default = react_router_dom_1.withRouter(react_redux_1.connect(null, mapDispatchToProps)(LogoutPage));

//# sourceMappingURL=../../dist/auth/pages/LogoutPage.js.map
