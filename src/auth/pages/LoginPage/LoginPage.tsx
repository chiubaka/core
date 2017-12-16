import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import { IOAuth2Props, IProductProps, ISocialLoginProvider } from "../../../types/index";
import { setRedirect } from "../../actions/index";
import { SocialLoginButton } from "../../components/SocialLoginButton";
import { IAuthState, LoginState } from "../../model/AuthenticationState";

export interface ILoginPageStateProps {
  loggedIn: boolean;
}

export interface ILoginPageDispatchProps {
  setRedirect: (redirectPath: string) => void;
}

export interface ILoginPageOwnProps extends IProductProps, IOAuth2Props {
  defaultRedirectPath?: string;
  providers?: ISocialLoginProvider[];
}

export interface ILoginPageProps extends RouteComponentProps<any>, ILoginPageStateProps, ILoginPageDispatchProps,
  ILoginPageOwnProps {}

class LoginPage extends React.Component<ILoginPageProps, React.ComponentState> {
  public static defaultProps: Partial<ILoginPageProps> = {
    loggedIn: false,
    defaultRedirectPath: "/",
    providers: [],
  };

  constructor(props?: ILoginPageProps) {
    super(props);
  }

  public componentWillReceiveProps(props?: ILoginPageProps) {
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

function mapStateToProps(state: IAuthState): ILoginPageStateProps {
  return {
    loggedIn: state.auth.loginState === LoginState.LoggedIn,
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
