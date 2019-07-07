import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { connect } from "react-redux";
import { IServiceState } from "../../app/model/index";
import { AuthApi, IAuthApiAdapter } from "../actions";
import { IAuthState } from "../model/AuthenticationState";
import { buildLoginPage } from "./LoginPage/LoginPage";
import { buildLogoutPage } from "./LogoutPage";
import { buildOAuth2CompletionPage } from "./OAuth2CompletionPage/OAuth2CompletionPage";

export interface IAuthStateProps {
  oAuth2CallbackBasePath: string;
}

function buildAuth(adapter?: IAuthApiAdapter) {
  const api = new AuthApi(adapter);

  const LoginPage = buildLoginPage(api);
  const LogoutPage = buildLogoutPage(api);
  const OAuth2CompletionPage = buildOAuth2CompletionPage(api);

  class Auth extends React.Component<IAuthStateProps> {
    constructor(props: IAuthStateProps) {
      super(props);

      this.renderOAuth2CompletionPage = this.renderOAuth2CompletionPage.bind(this);
      this.renderLoginPage = this.renderLoginPage.bind(this);
    }

    public render(): JSX.Element {
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
            <Route path="/auth/logout" component={LogoutPage}/>
          </Switch>
        </div>
      );
    }

    private renderOAuth2CompletionPage(props: RouteComponentProps<any>): JSX.Element {
      return (
        <OAuth2CompletionPage {...props}/>
      );
    }

    private renderLoginPage(props: RouteComponentProps<any>): JSX.Element {
      return (
        <LoginPage {...props}/>
      );
    }
  }

  function mapStateToProps(state: IAuthState & IServiceState) {
    return {
      oAuth2CallbackBasePath: state.auth.oAuth2CallbackBasePath,
    };
  }

  return connect(mapStateToProps)(Auth);
}
