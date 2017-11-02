import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { AuthState, LoginState } from '../model/AuthenticationState';
import { SocialLoginButton } from "../components/SocialLoginButton";
import { ISocialLoginProvider, ProductProps } from "../../types/index";
import { OAuth2CompletionPageOwnProps } from "./OAuth2CompletionPage";
import { buildOAuthCallbackUri, buildUri } from "../utils/uri";

export interface LoginPageStateProps {
  loggedIn: boolean;
}

export interface LoginPageOwnProps extends ProductProps, OAuth2CompletionPageOwnProps {
  defaultRedirectPath?: string;
  providers?: ISocialLoginProvider[];
}

declare type LoginPageProps = RouteComponentProps<any> & LoginPageStateProps & LoginPageOwnProps;

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
  }

  public componentWillMount() {
    this.checkAuthentication(this.props);
  }

  public createSocialLoginButtons(): JSX.Element[] {
    const {providers, hostname, oAuth2CallbackBasePath, port, useSsl } = this.props;


    return providers.map((provider) => {
      const {clientId, name} = provider;
      const redirectUri = buildOAuthCallbackUri(hostname, oAuth2CallbackBasePath, name, port, useSsl);
      return (
        <SocialLoginButton key={name} clientId={clientId} providerName={name} redirectUri={redirectUri}/>
      );
    });
  }
  
  public render(): JSX.Element {
    console.log(this.props.match);
    console.log(this.props.location);
    return (
      <div className="login-page">
        <div className="horizontal-center vertical-center">
          <div className="content">
            <img
              className="logo"
              src={this.props.logo}
            />
            {this.createSocialLoginButtons()}
          </div>
        </div>
      </div>
    );
  }

  private checkAuthentication(props: LoginPageProps) {
    if (props.loggedIn) {
      if (props.location.state && props.location.state.nextPathname) {
        props.history.push(props.location.state.nextPathname);
      }
      else {
        props.history.push(props.defaultRedirectPath);
      }
    }
  }
}

function mapStateToProps(state: AuthState): LoginPageStateProps {
  return {
    loggedIn: state.auth.loginState === LoginState.LoggedIn
  };
}

export default connect(mapStateToProps)(withRouter<LoginPageProps>(LoginPage));