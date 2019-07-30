import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { connect } from "react-redux";
import { AuthApi, IAuthApiAdapter } from "../actions";
import { IAuthState as IAuthGlobalState } from "../model/AuthenticationState";
import { LoginPage } from "./LoginPage";
import { LogoutPage } from "./LogoutPage";
import { OAuth2CompletionPage } from "./OAuth2CompletionPage";

interface IAuthOwnProps {
  adapter?: IAuthApiAdapter;
}

interface IAuthStateProps {
  oAuth2CallbackBasePath: string;
}

interface IAuthProps extends IAuthOwnProps, IAuthStateProps {}

interface IAuthState {
  api: AuthApi;
}

class AuthImpl extends React.Component<IAuthProps, IAuthState> {
  public state: IAuthState;

  constructor(props: IAuthProps) {
    super(props);

    this.state = {
      api: new AuthApi(props.adapter),
    };
  }

  public render = (): JSX.Element => {
    const oAuth2CallbackBasePath = this.props.oAuth2CallbackBasePath;
    return (
      <div id="auth">
        <Switch>
          <Route
            path={`${oAuth2CallbackBasePath}:provider`}
            render={this.renderOAuth2CompletionPage}
          />
          <Route
            path="/auth/login"
            render={this.renderLoginPage}
          />
          <Route path="/auth/logout" render={this.renderLogoutPage}/>
        </Switch>
      </div>
    );
  }

  private renderOAuth2CompletionPage = (props: RouteComponentProps<any>): JSX.Element => {
    return (
      <OAuth2CompletionPage {...props} api={this.state.api}/>
    );
  }

  private renderLoginPage = (props: RouteComponentProps<any>): JSX.Element => {
    return (
      <LoginPage {...props} api={this.state.api}/>
    );
  }

  private renderLogoutPage = () => {
    return (
      <LogoutPage api={this.state.api}/>
    );
  }
}

function mapStateToProps(state: IAuthGlobalState) {
  return {
    oAuth2CallbackBasePath: state.auth.oAuth2CallbackBasePath,
  };
}

export const Auth = connect(mapStateToProps)(AuthImpl as any);
