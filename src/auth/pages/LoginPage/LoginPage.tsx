import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import * as classnames from "classnames";
import { Button, Classes, ControlGroup, InputGroup } from "@blueprintjs/core";
import { IProductState, IServiceState } from "../../../app/model/index";
import { ISocialLoginProvider } from "../../../app/types/index";
import { setRedirect } from "../../actions/index";
import { SocialLoginButton } from "../../components/SocialLoginButton";
import { IAuthState, LoginState } from "../../model/AuthenticationState";

export interface ILoginPageStateProps {
  loggedIn: boolean;
  logoPath?: string;
  productName: string;
  providers: ISocialLoginProvider[];
  enableUsernameLogin?: boolean;
}

export interface ILoginPageDispatchProps {
  setRedirect: (redirectPath: string) => void;
}

export interface ILoginPageOwnProps {
  defaultRedirectPath?: string;
}

export interface ILoginPageProps extends RouteComponentProps<any>, ILoginPageStateProps, ILoginPageDispatchProps,
  ILoginPageOwnProps {}

export interface ILoginPageState {
  showSocialLogin: boolean;
}

class LoginPage extends React.Component<ILoginPageProps, ILoginPageState> {
  public static defaultProps: Partial<ILoginPageProps> = {
    loggedIn: false,
    defaultRedirectPath: "/",
    providers: [],
  };

  constructor(props?: ILoginPageProps) {
    super(props);

    this.state = {
      showSocialLogin: true,
    };

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
          width="250"
          height="250"
          className="logo mx-auto d-block"
          src={this.props.logoPath}
        />
      );
    }

    return null;
  }

  private renderLoginForm(): JSX.Element {
    if (!this.props.enableUsernameLogin || (this.props.providers.length > 0 && this.state.showSocialLogin)) {
      return null;
    }

    return (
      <ControlGroup className="login-form" vertical={true}>
        <InputGroup className={Classes.LARGE} leftIconName="person" placeholder="Username"/>
        <InputGroup className={Classes.LARGE} type="password" leftIconName="lock" placeholder="Password" />
        <Button className={classnames(Classes.INTENT_PRIMARY, Classes.LARGE)} text="Login"/>
      </ControlGroup>
    );
  }

  private renderSocialLoginButtons(): JSX.Element[] {
    if (this.props.enableUsernameLogin && !this.state.showSocialLogin) {
      return null;
    }

    const providers = this.props.providers;

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
    if (this.props.providers.length === 0 || !this.props.enableUsernameLogin) {
      return null;
    }

    if (this.state.showSocialLogin) {
      return (
        <span className="login-type-helper">
          Or login with your <a onClick={this.toggleLoginType}>username and password</a>.
        </span>
      );
    }
    else {
      return (
        <span className="login-type-helper">
          Or login with your <a onClick={this.toggleLoginType}>favorite social network</a>.
        </span>
      )
    }
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
    providers: state.auth.providers,
    enableUsernameLogin: state.auth.enableUsernameLogin,
  };
}

function mapDispatchToProps(dispatch: Dispatch<IAuthState>): ILoginPageDispatchProps {
  return {
    setRedirect: (redirectPath: string) => {
      dispatch(setRedirect(redirectPath));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter<ILoginPageProps>(LoginPage));
