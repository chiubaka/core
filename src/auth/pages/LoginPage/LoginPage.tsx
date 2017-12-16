import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import { ISocialLoginProvider, IProductProps } from "../../../types/index";
import { setRedirect } from "../../actions/index";
import { SocialLoginButton } from "../../components/SocialLoginButton";
import { AuthState, LoginState } from "../../model/AuthenticationState";
import { OAuth2CompletionPageOwnProps } from "../OAuth2CompletionPage/OAuth2CompletionPage";

export interface LoginPageStateProps {
  loggedIn: boolean;
}

export interface LoginPageDispatchProps {
  setRedirect: (redirectPath: string) => void;
}

export interface LoginPageOwnProps extends IProductProps, OAuth2CompletionPageOwnProps {
  defaultRedirectPath?: string;
  providers?: ISocialLoginProvider[];
}

declare type LoginPageProps = RouteComponentProps<any> & LoginPageStateProps & LoginPageDispatchProps & LoginPageOwnProps;

class LoginPage extends React.Component<LoginPageProps, React.ComponentState> {
  public static defaultProps: Partial<LoginPageProps> = {
    loggedIn: false,
    defaultRedirectPath: "/",
    providers: [],
  };

  constructor(props?: LoginPageProps) {
    super(props);
  }

  public componentWillReceiveProps(props?: LoginPageProps) {
    this.checkAuthentication(props);
    this.setRedirect(props);
  }

  public componentWillMount() {
    this.checkAuthentication(this.props);
    this.setRedirect(this.props);
  }

  public createSocialLoginButtons(): JSX.Element[] {
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

  public render(): JSX.Element {
    return (
      <div className="login-page container d-table">
        <div className="content d-table-cell align-middle">
          <img
            width="250"
            height="250"
            className="logo mx-auto d-block"
            src={this.props.logo}
          />
          <span className="product-name">
            {this.props.productName}
          </span>
          {this.createSocialLoginButtons()}
        </div>
      </div>
    );
  }

  private checkAuthentication(props: LoginPageProps) {
    if (props.loggedIn) {
      if (props.location.state && props.location.state.redirectPath) {
        props.history.push(props.location.state.redirectPath);
      } else {
        props.history.push(props.defaultRedirectPath);
      }
    }
  }

  private setRedirect(props: LoginPageProps) {
    const redirectPath = props.location.state && props.location.state.redirectPath;

    if (redirectPath) {
      props.setRedirect(redirectPath);
    }
  }
}

function mapStateToProps(state: AuthState): LoginPageStateProps {
  return {
    loggedIn: state.auth.loginState === LoginState.LoggedIn,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AuthState>): LoginPageDispatchProps {
  return {
    setRedirect: (redirectPath: string) => {
      dispatch(setRedirect(redirectPath));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter<LoginPageProps>(LoginPage));
