import { Button, Classes, ControlGroup, InputGroup } from "@blueprintjs/core";
import * as classnames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { IProductState, IServiceState } from "../../../app/model";
import { ISocialLoginProvider } from "../../../app/types";
import { AuthApi, AuthDispatch as Dispatch, setRedirect } from "../../actions";
import { SocialLoginButton } from "../../components/SocialLoginButton";
import { IAuthState, LoginState } from "../../model/AuthenticationState";

export interface ILoginPageStateProps {
  loggedIn: boolean;
  logoPath?: string;
  productName: string;
  socialProviders: ISocialLoginProvider[];
  enableNonSocialLogin: boolean;
  useEmailAsUsername: boolean;
}

export interface ILoginPageDispatchProps {
  onSubmitLogin: (username: string, password: string) => void;
  setRedirect: (redirectPath: string) => void;
}

export interface ILoginPageOwnProps extends RouteComponentProps<any> {
  defaultRedirectPath?: string;
}

export interface ILoginPageProps extends ILoginPageStateProps, ILoginPageDispatchProps,
  ILoginPageOwnProps {}

export interface ILoginPageState {
  username: string;
  password: string;
  showSocialLogin: boolean;
}

class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {
  public static defaultProps: Partial<ILoginPageProps> = {
    loggedIn: false,
    defaultRedirectPath: "/",
    socialProviders: [],
  };

  constructor(props?: ILoginPageProps) {
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

  public componentWillReceiveProps(props?: ILoginPageProps) {
    this.checkAuthentication(props);
    this.setRedirect(props);
  }

  public componentWillMount() {
    this.checkAuthentication(this.props);
    this.setRedirect(this.props);
  }

  public render(): JSX.Element {
    return (
      <div className="login-page container d-table">
        <div className="content d-table-cell align-middle">
          {this.renderLogo()}
          <span className="product-name">
            {this.props.productName}
          </span>
          {this.renderLoginForm()}
          {this.renderSocialLoginButtons()}
          {this.renderLoginTypeSwitch()}
        </div>
      </div>
    );
  }

  private renderLogo() {
    const logoPath = this.props.logoPath;
    if (logoPath) {
      return (
        <img
          height="250"
          className="logo mx-auto d-block"
          src={this.props.logoPath}
        />
      );
    }

    return null;
  }

  private renderLoginForm(): JSX.Element {
    const { username, password, showSocialLogin } = this.state;
    const { enableNonSocialLogin, socialProviders, useEmailAsUsername } = this.props;

    if (!enableNonSocialLogin || (socialProviders.length > 0 && showSocialLogin)) {
      return null;
    }

    return (
      <ControlGroup className="login-form" vertical={true}>
        <InputGroup
          onChange={this.editUsername}
          className={Classes.LARGE}
          leftIcon={useEmailAsUsername ? "envelope" : "person"}
          placeholder={useEmailAsUsername ? "Email" : "Username"}
          value={username}
        />
        <InputGroup
          onChange={this.editPassword}
          onKeyUp={this.handlePasswordKeyPress}
          className={Classes.LARGE}
          type="password"
          leftIcon="lock"
          placeholder="Password"
          value={password}
        />
        <Button
          disabled={!(username && password)}
          onClick={this.submitLogin}
          className={classnames(Classes.INTENT_PRIMARY, Classes.LARGE)}
          text="Login"
        />
      </ControlGroup>
    );
  }

  private renderSocialLoginButtons(): JSX.Element[] {
    if (this.props.enableNonSocialLogin && !this.state.showSocialLogin) {
      return null;
    }

    const providers = this.props.socialProviders;

    return providers.map((provider) => {
      const {clientId, providerName} = provider;

      return (
        <SocialLoginButton
          key={providerName}
          clientId={clientId}
          providerName={providerName}
          {...this.props}
        />
      );
    });
  }

  private renderLoginTypeSwitch(): JSX.Element {
    const { socialProviders, enableNonSocialLogin } = this.props;

    if (socialProviders.length === 0 || !enableNonSocialLogin) {
      return null;
    }

    if (this.state.showSocialLogin) {
      return (
        <span className="login-type-helper">
          Or login with your <a onClick={this.toggleLoginType}>username and password</a>.
        </span>
      );
    } else {
      return (
        <span className="login-type-helper">
          Or login with your <a onClick={this.toggleLoginType}>favorite social network</a>.
        </span>
      );
    }
  }

  private editUsername(event: React.FormEvent<any>) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.setState({...this.state, username: value});
  }

  private editPassword(event: React.FormEvent<any>) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.setState({...this.state, password: value});
  }

  private handlePasswordKeyPress(event: React.KeyboardEvent<any>) {
    if (event.key === "Enter") {
      this.submitLogin();
    }
  }

  private submitLogin() {
    const { username, password } = this.state;
    this.props.onSubmitLogin(username, password);
  }

  private toggleLoginType() {
    this.setState({...this.state, showSocialLogin: !this.state.showSocialLogin});
  }

  private checkAuthentication(props: ILoginPageProps) {
    if (props.loggedIn) {
      if (props.location.state && props.location.state.redirectPath) {
        props.history.push(props.location.state.redirectPath);
      } else {
        props.history.push(props.defaultRedirectPath);
      }
    }
  }

  private setRedirect(props: ILoginPageProps) {
    const redirectPath = props.location.state && props.location.state.redirectPath;

    if (redirectPath) {
      props.setRedirect(redirectPath);
    }
  }
}

function mapStateToProps(state: IAuthState & IProductState & IServiceState): ILoginPageStateProps {
  return {
    loggedIn: state.auth.loginState === LoginState.LoggedIn,
    logoPath: state.product.logoPath,
    productName: state.product.productName,
    socialProviders: state.auth.socialProviders,
    enableNonSocialLogin: state.auth.enableNonSocialLogin,
    useEmailAsUsername: state.auth.useEmailAsUsername,
  };
}

function mapDispatchToProps(dispatch: Dispatch): ILoginPageDispatchProps {
  return {
    onSubmitLogin: (username: string, password: string) => {
      dispatch(AuthApi.getInstance().login(username, password));
    },
    setRedirect: (redirectPath: string) => {
      dispatch(setRedirect(redirectPath));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(LoginPage) as any);
