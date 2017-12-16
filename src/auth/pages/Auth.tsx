import * as React from "react";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import LoginPage, { ILoginPageOwnProps } from "./LoginPage/LoginPage";
import LogoutPage from "./LogoutPage";
import OAuth2CompletionPage from "./OAuth2CompletionPage/OAuth2CompletionPage";

export class Auth extends React.Component<ILoginPageOwnProps> {
  public static defaultProps: Partial<ILoginPageOwnProps> = {
    // TODO: Figure out how to use SSL in local development, and remove this as an option--always use SSL
    useSsl: false,
    oAuth2CallbackBasePath: "/auth/login/oauth2/complete/",
  };

  constructor(props: ILoginPageOwnProps) {
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
      <OAuth2CompletionPage {...props} {...this.props}/>
    );
  }

  private renderLoginPage(props: RouteComponentProps<any>): JSX.Element {
    return (
      <LoginPage {...props} {...this.props}/>
    );
  }
}
