import * as React from "react";
import { IOAuth2Props } from "../../types/index";
import { buildOAuth2CallbackUri } from "../utils/uri";

export interface ISocialLoginButtonProps extends IOAuth2Props {
  clientId: string;
  providerName: string;
  redirectPath?: string;
}

export interface ISocialLoginButtonState {
  oAuth2Uri: string;
}

export class SocialLoginButton extends React.Component<ISocialLoginButtonProps, ISocialLoginButtonState> {
  public static OAUTH2_GATEWAYS: {[provider: string]: string} = {
    facebook: "https://www.facebook.com/v2.10/dialog/oauth",
    google: "https://accounts.google.com/o/oauth2/v2/auth",
  };

  // Provides provider providerName aliases as shims since social-app-django differentiates between Google and
  // Google OAuth2. We don't support anything other than OAuth2, so internally there's no need for that.
  public static OAUTH2_PROVIDER_ALIAS: {[provider: string]: string} = {
    google: "google-oauth2",
  };

  public static OAUTH2_ADDITIONAL_PARAMETERS: {[provider: string]: {[parameter: string]: string}} = {
    facebook: {
      response_type: "code",
    },
    google: {
      response_type: "code",
      scope: "profile email",
    },
  };

  public state = {
    oAuth2Uri: "",
  };

  public componentWillMount() {
    const { clientId, providerName, hostname, oAuth2CallbackBasePath, port, useSsl } = this.props;
    const providerAlias = SocialLoginButton.OAUTH2_PROVIDER_ALIAS[providerName];

    const redirectUri = buildOAuth2CallbackUri(
      hostname,
      oAuth2CallbackBasePath,
      providerAlias ? providerAlias : providerName,
      port,
      useSsl,
    );

    if (!(providerName in SocialLoginButton.OAUTH2_GATEWAYS)) {
      console.error(`Unrecognized social auth provider ${providerName}.`);
    }

    const oAuth2Gateway = SocialLoginButton.OAUTH2_GATEWAYS[providerName];
    let oAuth2Uri = `${oAuth2Gateway}?client_id=${clientId}&redirect_uri=${redirectUri}`;
    const additionalParameters = SocialLoginButton.OAUTH2_ADDITIONAL_PARAMETERS[providerName];

    if (additionalParameters) {
      for (const key in additionalParameters) {
        if (additionalParameters.hasOwnProperty(key)) {
          oAuth2Uri += `&${key}=${additionalParameters[key]}`;
        }
      }
    }

    this.setState({...this.state, oAuth2Uri});
  }

  public render(): JSX.Element {
    const providerName = this.props.providerName;

    return (
      <a
        className={`btn btn-block btn-social btn-${providerName}`}
        href={`${this.state.oAuth2Uri}`}
      >
        <span className={`fa fa-${providerName}`}/>
        Sign in with {providerName[0].toUpperCase() + providerName.slice(1)}
      </a>
    );
  }
}
