import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { AuthState, LoginState } from '../model/AuthenticationState';
import { Dispatch } from 'redux';
// TODO: Uncomment when logout is figured out again.
// import { logout } from '../actions/index';

export interface LogoutPageStateProps {
  accessToken: string;
  loggedIn: boolean;
}

export interface LogoutPageDispatchProps {
  onLogout: (accessToken: string) => void;
}

export interface LogoutPageOwnProps {
  redirectPath?: string;
}

declare type LogoutPageProps = RouteComponentProps<any> & LogoutPageStateProps & LogoutPageDispatchProps
  & LogoutPageOwnProps;

class LogoutPage extends React.Component<LogoutPageProps, {}> {
  public static defaultProps: Partial<LogoutPageProps> = {
    redirectPath: "/"
  };

  public componentWillReceiveProps(props?: LogoutPageProps) {
    this.checkAuthentication(props);
  }

  public componentWillMount() {
    this.checkAuthentication(this.props);
    this.props.onLogout(this.props.accessToken);
  }

  public render(): JSX.Element {
    return null;
  }

  private checkAuthentication(props: LogoutPageProps) {
    if (!props.loggedIn) {
      props.history.push(props.redirectPath);
    }
  }
}

function mapStateToProps(state: AuthState): LogoutPageStateProps {
  return {
    accessToken: state.auth.accessToken,
    loggedIn: state.auth.loginState === LoginState.LoggedIn
  };
}

function mapDispatchToProps(dispatch: Dispatch<AuthState>): LogoutPageDispatchProps {
  return {
    onLogout: (accessToken: string) => {
      // TODO: Uncomment when logout is figured out again.
      // dispatch(logout(accessToken));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter<LogoutPageProps>(LogoutPage));