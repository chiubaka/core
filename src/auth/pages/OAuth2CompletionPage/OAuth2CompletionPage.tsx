import { parse } from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import { ProgressBar } from "../../../app/components/ProgressBar";
import { IServiceInnerState, IServiceState } from "../../../app/model/index";
import { clearRedirect, socialLogin } from "../../actions/index";
import { IAuthState, LoginState } from "../../model/AuthenticationState";
import { buildOAuth2CallbackUri } from "../../utils/uri";

export interface IOAuth2CompletionPageParams {
  provider: string;
}

export interface IOAuth2CompletionPageStateProps extends IServiceInnerState {
  loggedIn: boolean;
  oAuth2CallbackBasePath: string;
  redirectPath: string;
}

export interface IOAuth2CompletionPageDispatchProps {
  clearRedirect: () => void;
  onOAuth2Completion: (provider: string, code: string, redirectUri: string) => void;
}

export interface IOAuth2CompletionPageProps extends RouteComponentProps<IOAuth2CompletionPageParams>,
  IOAuth2CompletionPageStateProps, IOAuth2CompletionPageDispatchProps {}

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
    const code = queryParams.code;

    if (!props.loggedIn) {
      // TODO: Need to handle case where user is not logged in but login failed.
      const provider = props.match.params.provider;

      const { hostname, oAuth2CallbackBasePath, port, useSsl } = props;
      const oAuth2CallbackUri = buildOAuth2CallbackUri(hostname, oAuth2CallbackBasePath, provider, port, useSsl);

      props.onOAuth2Completion(provider, code, oAuth2CallbackUri);
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
  };
}

function mapDispatchToProps(dispatch: Dispatch<IAuthState>): IOAuth2CompletionPageDispatchProps {
  return {
    clearRedirect: () => {
      dispatch(clearRedirect());
    },
    onOAuth2Completion: (provider: string, code: string, oAuth2CallbackUri: string) => {
      dispatch(socialLogin(provider, code, oAuth2CallbackUri));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter<IOAuth2CompletionPageProps>(OAuth2CompletionPage));
