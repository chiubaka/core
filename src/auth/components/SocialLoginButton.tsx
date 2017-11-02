import * as React from "react";

export interface SocialLoginButtonProps {
  clientId: string;
  providerName: string;
  redirectUri: string;
}

export interface SocialLoginButtonState {
  oAuthUri: string;
}

export class SocialLoginButton extends React.Component<SocialLoginButtonProps, SocialLoginButtonState> {
  public static OAUTH2_GATEWAYS: {[provider: string]: string} = {
    facebook: "https://www.facebook.com/v2.10/dialog/oauth",
    "google-oauth2": "https://accounts.google.com/o/oauth2/v2/auth"
  };

  public static OAUTH2_ADDITIONAL_PARAMETERS: {[provider: string]: {[parameter: string]: string}} = {
    facebook: {
      response_type: "code"
    },
    "google-oauth2": {
      response_type: "code",
      scope: "profile email",
    }
  };

  public state = {
    oAuthUri: ""
  };

  public componentWillMount() {
    const { clientId, providerName, redirectUri } = this.props;

    if (!(providerName in SocialLoginButton.OAUTH2_GATEWAYS)) {
      console.error(`Unrecognized social auth provider ${providerName}.`);
    }

    let oAuthUri = `${SocialLoginButton.OAUTH2_GATEWAYS[providerName]}?client_id=${clientId}&redirect_uri=${redirectUri}`;

    const additionalParameters = SocialLoginButton.OAUTH2_ADDITIONAL_PARAMETERS[providerName];

    if (additionalParameters) {
      for (let key in additionalParameters) {
        oAuthUri += `&${key}=${additionalParameters[key]}`
      }
    }

    this.setState({...this.state, oAuthUri});
  }

  public render(): JSX.Element {
    const providerName = this.props.providerName;

    return (
      <a
        className={`btn btn-block btn-social btn-${providerName}`}
        href={`${this.state.oAuthUri}`}>
        <span className={`fa fa-${providerName}`}></span> Sign in with {providerName[0].toUpperCase() + providerName.slice(1)}
      </a>
    );
  }
}