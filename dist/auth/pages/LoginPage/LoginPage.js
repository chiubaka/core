"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@blueprintjs/core");
const classnames = require("classnames");
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const actions_1 = require("../../actions");
const SocialLoginButton_1 = require("../../components/SocialLoginButton");
const AuthenticationState_1 = require("../../model/AuthenticationState");
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            showSocialLogin: true,
        };
        this.editUsername = this.editUsername.bind(this);
        this.editPassword = this.editPassword.bind(this);
        this.handlePasswordKeyPress = this.handlePasswordKeyPress.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.toggleLoginType = this.toggleLoginType.bind(this);
    }
    componentWillReceiveProps(props) {
        this.checkAuthentication(props);
        this.setRedirect(props);
    }
    componentWillMount() {
        this.checkAuthentication(this.props);
        this.setRedirect(this.props);
    }
    render() {
        return (React.createElement("div", { className: "login-page container d-table" },
            React.createElement("div", { className: "content d-table-cell align-middle" },
                this.renderLogo(),
                React.createElement("span", { className: "product-name" }, this.props.productName),
                this.renderLoginForm(),
                this.renderSocialLoginButtons(),
                this.renderLoginTypeSwitch())));
    }
    renderLogo() {
        const logoPath = this.props.logoPath;
        if (logoPath) {
            return (React.createElement("img", { height: "250", className: "logo mx-auto d-block", src: this.props.logoPath }));
        }
        return null;
    }
    renderLoginForm() {
        const { username, password, showSocialLogin } = this.state;
        const { enableNonSocialLogin, socialProviders, useEmailAsUsername } = this.props;
        if (!enableNonSocialLogin || (socialProviders.length > 0 && showSocialLogin)) {
            return null;
        }
        return (React.createElement(core_1.ControlGroup, { className: "login-form", vertical: true },
            React.createElement(core_1.InputGroup, { onChange: this.editUsername, className: core_1.Classes.LARGE, leftIcon: useEmailAsUsername ? "envelope" : "person", placeholder: useEmailAsUsername ? "Email" : "Username", value: username }),
            React.createElement(core_1.InputGroup, { onChange: this.editPassword, onKeyUp: this.handlePasswordKeyPress, className: core_1.Classes.LARGE, type: "password", leftIcon: "lock", placeholder: "Password", value: password }),
            React.createElement(core_1.Button, { disabled: !(username && password), onClick: this.submitLogin, className: classnames(core_1.Classes.INTENT_PRIMARY, core_1.Classes.LARGE), text: "Login" })));
    }
    renderSocialLoginButtons() {
        if (this.props.enableNonSocialLogin && !this.state.showSocialLogin) {
            return null;
        }
        const providers = this.props.socialProviders;
        return providers.map((provider) => {
            const { clientId, providerName } = provider;
            return (React.createElement(SocialLoginButton_1.SocialLoginButton, Object.assign({ key: providerName, clientId: clientId, providerName: providerName }, this.props)));
        });
    }
    renderLoginTypeSwitch() {
        const { socialProviders, enableNonSocialLogin } = this.props;
        if (socialProviders.length === 0 || !enableNonSocialLogin) {
            return null;
        }
        if (this.state.showSocialLogin) {
            return (React.createElement("span", { className: "login-type-helper" },
                "Or login with your ",
                React.createElement("a", { onClick: this.toggleLoginType }, "username and password"),
                "."));
        }
        else {
            return (React.createElement("span", { className: "login-type-helper" },
                "Or login with your ",
                React.createElement("a", { onClick: this.toggleLoginType }, "favorite social network"),
                "."));
        }
    }
    editUsername(event) {
        const target = event.target;
        const value = target.value;
        this.setState(Object.assign({}, this.state, { username: value }));
    }
    editPassword(event) {
        const target = event.target;
        const value = target.value;
        this.setState(Object.assign({}, this.state, { password: value }));
    }
    handlePasswordKeyPress(event) {
        if (event.key === "Enter") {
            this.submitLogin();
        }
    }
    submitLogin() {
        const { username, password } = this.state;
        this.props.onSubmitLogin(username, password);
    }
    toggleLoginType() {
        this.setState(Object.assign({}, this.state, { showSocialLogin: !this.state.showSocialLogin }));
    }
    checkAuthentication(props) {
        if (props.loggedIn) {
            if (props.location.state && props.location.state.redirectPath) {
                props.history.push(props.location.state.redirectPath);
            }
            else {
                props.history.push(props.defaultRedirectPath);
            }
        }
    }
    setRedirect(props) {
        const redirectPath = props.location.state && props.location.state.redirectPath;
        if (redirectPath) {
            props.setRedirect(redirectPath);
        }
    }
}
LoginPage.defaultProps = {
    loggedIn: false,
    defaultRedirectPath: "/",
    socialProviders: [],
};
function mapStateToProps(state) {
    return {
        loggedIn: state.auth.loginState === AuthenticationState_1.LoginState.LoggedIn,
        logoPath: state.product.logoPath,
        productName: state.product.productName,
        socialProviders: state.auth.socialProviders,
        enableNonSocialLogin: state.auth.enableNonSocialLogin,
        useEmailAsUsername: state.auth.useEmailAsUsername,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        onSubmitLogin: (username, password) => {
            dispatch(actions_1.AuthApi.getInstance().login(username, password));
        },
        setRedirect: (redirectPath) => {
            dispatch(actions_1.setRedirect(redirectPath));
        },
    };
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(react_router_dom_1.withRouter(LoginPage));

//# sourceMappingURL=../../../dist/auth/pages/LoginPage/LoginPage.js.map
