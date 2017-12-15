import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import { completeLogout } from "../actions/index";
import { AuthState } from "../model/AuthenticationState";

export interface LogoutPageDispatchProps {
  onLogout: () => void;
}

declare type LogoutPageOwnProps = RouteComponentProps<any> & {
  redirectUri?: string;
};

declare type LogoutPageProps = LogoutPageOwnProps & LogoutPageDispatchProps;

class LogoutPage extends React.Component<LogoutPageProps, {}> {
  public componentWillMount() {
    this.props.onLogout();
  }

  public render(): JSX.Element {
    return null;
  }
}

function mapDispatchToProps(dispatch: Dispatch<AuthState>, ownProps: LogoutPageOwnProps): LogoutPageDispatchProps {
  return {
    onLogout: () => {
      dispatch(completeLogout());
      const redirectUri = ownProps.redirectUri ? ownProps.redirectUri : "/";
      ownProps.history.replace(redirectUri);
    },
  };
}

export default connect(null, mapDispatchToProps)(withRouter<LogoutPageProps>(LogoutPage));
