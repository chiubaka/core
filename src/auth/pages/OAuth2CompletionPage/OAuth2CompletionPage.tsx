import { parse, ParsedQuery } from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ProgressBar } from "../../../app/components/ProgressBar";
import { IServiceInnerState, IServiceState } from "../../../app/model";
import { AuthApi, AuthDispatch as Dispatch, clearRedirect } from "../../actions";
import { IAuthState, LoginState, OAuth2ResponseType, ISocialLoginProvider } from "../../model/AuthenticationState";
import { buildOAuth2CallbackUri } from "../../utils/uri";

export interface IOAuth2CompletionPageParams {
  provider: string;
}

export interface IOAuth2CompletionPageStateProps extends IServiceInnerState {
  loggedIn: boolean;
  oAuth2CallbackBasePath: string;
  redirectPath: string;
  providers: ISocialLoginProvider[];
}

export interface IOAuth2CompletionPageDispatchProps {
  clearRedirect: () => void;
  socialLogin: (provider: string, code: string, redirectUri: string) => void;
  socialLoginAccessToken: (provider: string, token: string) => void;
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

export function buildOAuth2CompletionPage(api: AuthApi) {
  class OAuth2CompletionPage extends React.Component<IOAuth2CompletionPageProps> {
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

    private handleOAuth2AndRedirect(props: IOAuth2CompletionPageProps) {
      const queryParams = parse(props.location.search);
  
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
  
  function mapStateToProps(state: IAuthState & IServiceState): IOAuth2CompletionPageStateProps {
    return {
      hostname: state.service.hostname,
      loggedIn: state.auth.loginState === LoginState.LoggedIn,
      oAuth2CallbackBasePath: state.auth.oAuth2CallbackBasePath,
      port: state.service.port,
      useSsl: state.service.useSsl,
      redirectPath: state.auth.redirectPath,
      providers: state.auth.socialProviders,
    };
  }

  function mapDispatchToProps(dispatch: Dispatch): IOAuth2CompletionPageDispatchProps {
    return {
      clearRedirect: () => {
        dispatch(clearRedirect());
      },
      socialLogin: (provider: string, code: string, oAuth2CallbackUri: string) => {
        dispatch(api.socialLogin(provider, code, oAuth2CallbackUri));
      },
      socialLoginAccessToken: (provider: string, token: string) => {
        dispatch(api.socialLoginAccessToken(provider, token));
      }
    };
  }

  function mergeProps(stateProps: IOAuth2CompletionPageStateProps, dispatchProps: IOAuth2CompletionPageDispatchProps) {
    return {
      onOAuth2Completion: (providerName: string, queryParams: ParsedQuery) => {
        const provider = stateProps.providers.find((p) => p.providerName === providerName);

        switch (provider.responseType) {
          case (OAuth2ResponseType.Token): {
            return dispatchProps.socialLoginAccessToken(providerName, queryParams.token as string);
          }
          case (OAuth2ResponseType.Code):
          default: {
            const { hostname, oAuth2CallbackBasePath, port, useSsl } = stateProps;
            const oAuth2CallbackUri = buildOAuth2CallbackUri(hostname, oAuth2CallbackBasePath, providerName, port, useSsl);

            return dispatchProps.socialLogin(providerName, queryParams.code as string, oAuth2CallbackUri);
          }
        }
      }
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(withRouter<IOAuth2CompletionPageProps>(OAuth2CompletionPage) as any);
}
