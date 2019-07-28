import * as React from "react";
import { connect } from "react-redux";
import { IAuthState } from "../model/AuthenticationState";
import { buildOAuth2CallbackUri } from "../utils/uri";

export interface ISocialLoginButtonOwnProps {
  clientId: string;
  providerName: string;
}

export interface ISocialLoginButtonStateProps {
  oAuth2Uri: string;
}

export interface ISocialLoginButtonProps extends ISocialLoginButtonOwnProps, ISocialLoginButtonStateProps {}

class SocialLoginButtonImpl extends React.Component<ISocialLoginButtonProps> {
  public static OAUTH2_GATEWAYS: {[provider: string]: string} = {
    facebook: "https://www.facebook.com/v3.3/dialog/oauth",
    google: "https://accounts.google.com/o/oauth2/v2/auth",
  };

  // Provides provider providerName aliases as shims since social-app-django differentiates between Google and
  // Google OAuth2. We don't support anything other than OAuth2, so internally there's no need for that.
  public static OAUTH2_PROVIDER_ALIAS: {[provider: string]: string} = {
    google: "google-oauth2",
  };

  public static OAUTH2_ADDITIONAL_PARAMETERS: {[provider: string]: {[parameter: string]: string}} = {
    facebook: {
      response_type: "token",
    },
    google: {
      response_type: "code",
      scope: "profile email",
    },
  };

  public render(): JSX.Element {
    const providerName = this.props.providerName;

    return (
      <a
        className={`btn btn-block btn-social btn-${providerName}`}
        href={`${this.props.oAuth2Uri}`}
      >
        <span className={`fa fa-${providerName}`}/>
        Sign in with {providerName[0].toUpperCase() + providerName.slice(1)}
      </a>
    );
  }
}

function mapStateToProps(state: IAuthState,
                         ownProps: ISocialLoginButtonOwnProps): ISocialLoginButtonStateProps {
  const { clientId, providerName } = ownProps;
  const oAuth2CallbackBasePath = state.auth.oAuth2CallbackBasePath;
  const providerAlias = SocialLoginButtonImpl.OAUTH2_PROVIDER_ALIAS[ownProps.providerName];

  const redirectUri = buildOAuth2CallbackUri(
    oAuth2CallbackBasePath,
    providerAlias ? providerAlias : providerName,
  );

  if (!(providerName in SocialLoginButtonImpl.OAUTH2_GATEWAYS)) {
    console.error(`Unrecognized social auth provider ${providerName}.`);
  }

  const oAuth2Gateway = SocialLoginButtonImpl.OAUTH2_GATEWAYS[providerName];
  let oAuth2Uri = `${oAuth2Gateway}?client_id=${clientId}&redirect_uri=${redirectUri}`;
  const additionalParameters = SocialLoginButtonImpl.OAUTH2_ADDITIONAL_PARAMETERS[providerName];

  if (additionalParameters) {
    for (const key in additionalParameters) {
      if (additionalParameters.hasOwnProperty(key)) {
        oAuth2Uri += `&${key}=${additionalParameters[key]}`;
      }
    }
  }

  return {
    oAuth2Uri,
  };
}

export const SocialLoginButton = connect(mapStateToProps)(SocialLoginButtonImpl);
