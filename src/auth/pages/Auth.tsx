import * as React from "react";
import { Route, Switch } from "react-router";

import LoginPage, { LoginPageOwnProps } from "./LoginPage/LoginPage";
import LogoutPage from "./LogoutPage";
import OAuth2CompletionPage from "./OAuth2CompletionPage/OAuth2CompletionPage";

export default class Auth extends React.Component<LoginPageOwnProps> {
  public static defaultProps: Partial<LoginPageOwnProps> = {
    // TODO: Figure out how to use SSL in local development, and remove this as an option--always use SSL
    useSsl: false,
    oAuth2CallbackBasePath: "/auth/login/oauth2/complete/",
  };

  public render(): JSX.Element {
    const oAuth2CallbackBasePath = this.props.oAuth2CallbackBasePath;
    return (
      <div id="auth">
        <Switch>
          <Route path={`${oAuth2CallbackBasePath}:provider`} render={(props) => {
            return (
              <OAuth2CompletionPage {...props} {...this.props}/>
            );
          }}/>
          <Route path="/auth/login" render={(props) => {
            return (
              <LoginPage {...props} {...this.props}/>
            );
          }}/>
          <Route path="/auth/logout" component={LogoutPage}/>
        </Switch>
      </div>
    );
  }
}
