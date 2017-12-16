import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import { completeLogout } from "../actions/index";
import { IAuthState } from "../model/AuthenticationState";

export interface ILogoutPageDispatchProps {
  onLogout: () => void;
}

export interface ILogoutPageOwnProps extends RouteComponentProps<any> {
  redirectUri?: string;
}

export interface ILogoutPageProps extends ILogoutPageOwnProps, ILogoutPageDispatchProps {}

class LogoutPage extends React.Component<ILogoutPageProps, {}> {
  public componentWillMount() {
    this.props.onLogout();
  }

  public render(): JSX.Element {
    return null;
  }
}

function mapDispatchToProps(dispatch: Dispatch<IAuthState>, ownProps: ILogoutPageOwnProps): ILogoutPageDispatchProps {
  return {
    onLogout: () => {
      dispatch(completeLogout());
      const redirectUri = ownProps.redirectUri ? ownProps.redirectUri : "/";
      ownProps.history.replace(redirectUri);
    },
  };
}

export default connect(null, mapDispatchToProps)(withRouter<ILogoutPageProps>(LogoutPage));
