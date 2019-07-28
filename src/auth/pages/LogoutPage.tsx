import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { AuthApi, AuthDispatch as Dispatch } from "../actions";

export interface ILogoutPageDispatchProps {
  dispatchLogout: (api: AuthApi) => void;
}

interface ILogoutPageMergeProps {
  onLogout: () => void;
}

export interface ILogoutPageOwnProps extends RouteComponentProps<any> {
  api: AuthApi;
  redirectUri?: string;
}

export interface ILogoutPageProps extends
  Omit<ILogoutPageOwnProps, "api">,
  Omit<ILogoutPageDispatchProps, "dispatchLogout">,
  ILogoutPageMergeProps {}

class LogoutPageImpl extends React.Component<ILogoutPageProps, {}> {
  public componentWillMount() {
    this.props.onLogout();
  }

  public render(): JSX.Element {
    return null;
  }
}

function mapDispatchToProps(dispatch: Dispatch, ownProps: ILogoutPageOwnProps): ILogoutPageDispatchProps {
  return {
    dispatchLogout: (api: AuthApi) => {
      dispatch(api.logout());
      const redirectUri = ownProps.redirectUri ? ownProps.redirectUri : "/";
      ownProps.history.replace(redirectUri);
    },
  };
}

function mergeProps(_stateProps, dispatchProps, ownProps) {
  const api = ownProps.api;

  return {
    onLogout: () => {
      dispatchProps.dispatchLogout(api);
    },
  };
}

export const LogoutPage = withRouter(connect(null, mapDispatchToProps, mergeProps)(LogoutPageImpl));
