import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { AuthApi, AuthDispatch as Dispatch, IAuthApiAdapter } from "../actions";

export interface ILogoutPageDispatchProps {
  onLogout: () => void;
}

export interface ILogoutPageOwnProps extends RouteComponentProps<any> {
  redirectUri?: string;
}

export interface ILogoutPageProps extends ILogoutPageOwnProps, ILogoutPageDispatchProps {}

export function buildLogoutPage(api: AuthApi) {
  class LogoutPage extends React.Component<ILogoutPageProps, {}> {
    public componentWillMount() {
      this.props.onLogout();
    }
  
    public render(): JSX.Element {
      return null;
    }
  }
  
  function mapDispatchToProps(dispatch: Dispatch, ownProps: ILogoutPageOwnProps): ILogoutPageDispatchProps {
    return {
      onLogout: () => {
        dispatch(api.logout());
        const redirectUri = ownProps.redirectUri ? ownProps.redirectUri : "/";
        ownProps.history.replace(redirectUri);
      },
    };
  }
  
  return withRouter(connect(null, mapDispatchToProps)(LogoutPage));
}
