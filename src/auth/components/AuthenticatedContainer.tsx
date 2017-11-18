import * as React from "react";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import { AuthState, LoginState } from '../model/AuthenticationState';
import { connect, DispatchProp } from 'react-redux';

export interface AuthenticatedContainerStateProps {
  isLoggedIn: boolean;
}

export interface AuthenticatedContainerOwnProps {
  id?: string;
  className?: string;
  loginPath?: string;
}

declare type AuthenticatedContainerProps = RouteComponentProps<any> & AuthenticatedContainerStateProps 
  & AuthenticatedContainerOwnProps

class AuthenticatedContainer extends React.Component<AuthenticatedContainerProps, {}> {
  public static defaultProps: Partial<AuthenticatedContainerProps> = {
    loginPath: "/auth/login"
  };
  
  public componentWillMount() {
    this.checkAuthentication(this.props);
  }
  
  public componentWillReceiveProps(nextProps: AuthenticatedContainerProps) {
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
    }
    else {
      return null;
    }
  }

  private checkAuthentication(props: AuthenticatedContainerProps) {
    const { history } = props;
    if (!props.isLoggedIn) {
      history.replace({ pathname: props.loginPath, state: { redirectPath: props.location.pathname }});
    }
  }
}

function mapStateToProps<S extends AuthState>(state: S): AuthenticatedContainerStateProps {
  return {
    isLoggedIn: !(state.auth.loginState === LoginState.NotLoggedIn)
  };
}

export default connect(mapStateToProps)(withRouter<AuthenticatedContainerProps>(AuthenticatedContainer));