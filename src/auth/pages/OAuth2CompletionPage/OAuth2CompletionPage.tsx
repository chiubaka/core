import { parse, ParsedQuery } from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ProgressBar } from "../../../app/components/ProgressBar";
import { AuthApi, AuthDispatch as Dispatch, clearRedirect } from "../../actions";
import { IAuthState, ISocialLoginProvider, LoginState, OAuth2ResponseType } from "../../model/AuthenticationState";
import { buildOAuth2CallbackUri } from "../../utils/uri";

export interface IOAuth2CompletionPageParams {
  provider: string;
}

export interface IOAuth2CompletionPageOwnProps extends RouteComponentProps<IOAuth2CompletionPageParams> {
  api: AuthApi;
}

export interface IOAuth2CompletionPageStateProps {
  loggedIn: boolean;
  oAuth2CallbackBasePath: string;
  redirectPath: string;
  providers: ISocialLoginProvider[];
}

export interface IOAuth2CompletionPageDispatchProps {
  clearRedirect: () => void;
  dispatchSocialLogin: (api: AuthApi, provider: string, code: string, redirectUri: string) => void;
  dispatchSocialLoginAccessToken: (api: AuthApi, provider: string, token: string) => void;
}

export interface IOAuth2CompletionPageMergeProps {
  onOAuth2Completion: (provider: string, queryParams: ParsedQuery) => void;
}

export interface IOAuth2CompletionPageProps extends
  RouteComponentProps<IOAuth2CompletionPageParams>,
  IOAuth2CompletionPageMergeProps {
    loggedIn: boolean;
    redirectPath: string;
    clearRedirect: () => void;
  }

class OAuth2CompletionPageImpl extends React.Component<IOAuth2CompletionPageProps> {
  public componentWillMount() {
    this.handleOAuth2AndRedirect(this.props);
  }

  public componentWillReceiveProps(nextProps: IOAuth2CompletionPageProps) {
    this.handleOAuth2AndRedirect(nextProps);
  }

  public render(): JSX.Element {
    return (
      <div className="oauth2-completion container d-table">
        <div className="d-table-cell align-middle">
          <ProgressBar progress={100} striped={true} animated={true}/>
        </div>
      </div>
    );
  }

  // If not logged in, this will trigger the login.
  // Once the user is logged in, the redux state should change, so new props
  // will be passed and this component should re-render, sparking the redirect
  // path.
  private handleOAuth2AndRedirect(props: IOAuth2CompletionPageProps) {
    const queryParams = parse(props.location.hash);
    if (!props.loggedIn) {
      // TODO: Need to handle case where user is not logged in but login failed.
      const provider = props.match.params.provider;

      props.onOAuth2Completion(provider, queryParams);
    } else {
      props.clearRedirect();
      // TODO: Should not be "/" here, should be a parameterized default path
      props.history.replace(props.redirectPath ? props.redirectPath : "/");
    }
  }
}

function mapStateToProps(state: IAuthState): IOAuth2CompletionPageStateProps {
  return {
    loggedIn: state.auth.loginState === LoginState.LoggedIn,
    oAuth2CallbackBasePath: state.auth.oAuth2CallbackBasePath,
    redirectPath: state.auth.redirectPath,
    providers: state.auth.socialProviders,
  };
}

function mapDispatchToProps(dispatch: Dispatch): IOAuth2CompletionPageDispatchProps {
  return {
    clearRedirect: () => {
      dispatch(clearRedirect());
    },
    dispatchSocialLogin: (api: AuthApi, provider: string, code: string, oAuth2CallbackUri: string) => {
      dispatch(api.socialLogin(provider, code, oAuth2CallbackUri));
    },
    dispatchSocialLoginAccessToken: (api: AuthApi, provider: string, token: string) => {
      dispatch(api.socialLoginAccessToken(provider, token));
    },
  };
}

function mergeProps(
  stateProps: IOAuth2CompletionPageStateProps,
  dispatchProps: IOAuth2CompletionPageDispatchProps,
  ownProps: IOAuth2CompletionPageOwnProps,
) {
  const api = ownProps.api;

  return {
    clearRedirect: dispatchProps.clearRedirect,
    loggedIn: stateProps.loggedIn,
    onOAuth2Completion: (providerName: string, queryParams: ParsedQuery) => {
      const provider = stateProps.providers.find((p) => p.providerName === providerName);

      switch (provider.responseType) {
        case (OAuth2ResponseType.Token): {
          return dispatchProps.dispatchSocialLoginAccessToken(api, providerName, queryParams.access_token as string);
        }
        case (OAuth2ResponseType.Code):
        default: {
          const { oAuth2CallbackBasePath } = stateProps;
          const oAuth2CallbackUri = buildOAuth2CallbackUri(
            oAuth2CallbackBasePath,
            providerName,
          );

          return dispatchProps.dispatchSocialLogin(api, providerName, queryParams.code as string, oAuth2CallbackUri);
        }
      }
    },
    redirectPath: stateProps.redirectPath,
  };
}

export const OAuth2CompletionPage = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(withRouter(OAuth2CompletionPageImpl) as any);
