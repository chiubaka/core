import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IAuthState, LoginState } from "../model/AuthenticationState";

export interface IAuthenticatedContainerStateProps {
  isLoggedIn: boolean;
}

export interface IAuthenticatedContainerOwnProps {
  id?: string;
  className?: string;
  loginPath?: string;
}

export interface IAuthenticatedContainerProps extends RouteComponentProps<any>, IAuthenticatedContainerStateProps,
  IAuthenticatedContainerOwnProps {}

class AuthenticatedContainerImpl extends React.Component<IAuthenticatedContainerProps, {}> {
  public static defaultProps: Partial<IAuthenticatedContainerProps> = {
    loginPath: "/auth/login",
  };

  public componentWillMount() {
    this.checkAuthentication(this.props);
  }

  public componentWillReceiveProps(nextProps: IAuthenticatedContainerProps) {
    if (nextProps.location !== this.props.location) {
      this.checkAuthentication(nextProps);
    }
  }

  public render(): JSX.Element {
    if (this.props.isLoggedIn) {
      return (
        <div id={this.props.id} className={this.props.className}>
          {this.props.children}
        </div>
      );
    } else {
      return null;
    }
  }

  private checkAuthentication(props: IAuthenticatedContainerProps) {
    const { history } = props;
    if (!props.isLoggedIn) {
      history.replace({ pathname: props.loginPath, state: { redirectPath: props.location.pathname }});
    }
  }
}

function mapStateToProps<S extends IAuthState>(state: S): IAuthenticatedContainerStateProps {
  return {
    isLoggedIn: !(state.auth.loginState === LoginState.NotLoggedIn),
  };
}

export const AuthenticatedContainer = connect(
  mapStateToProps,
)(withRouter(AuthenticatedContainerImpl));
