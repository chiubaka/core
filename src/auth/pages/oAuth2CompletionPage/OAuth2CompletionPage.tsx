import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { parse } from "query-string";
import { Dispatch } from "redux";
import { AuthState, LoginState } from "../../model/AuthenticationState";
import { clearRedirect, login } from "../../actions/index";
import { connect } from "react-redux";
import { buildOAuth2CallbackUri } from "../../utils/uri";
import { OAuth2Props } from "../../../types/index";
import { ProgressBar } from "../../../app/components/ProgressBar";

export interface OAuth2CompletionPageParams {
  provider: string;
}

export interface OAuth2CompletionPageStateProps {
  loggedIn: boolean;
  redirectPath: string;
}

export interface OAuth2CompletionPageDispatchProps {
  clearRedirect: () => void;
  onOAuth2Completion: (provider: string, code: string, redirectUri: string) => void;
}

export interface OAuth2CompletionPageOwnProps extends OAuth2Props {}

export declare type OAuth2CompletionPageProps = RouteComponentProps<OAuth2CompletionPageParams> & OAuth2CompletionPageOwnProps
  & OAuth2CompletionPageStateProps & OAuth2CompletionPageDispatchProps;

class OAuth2CompletionPage extends React.Component<OAuth2CompletionPageProps> {
  public componentWillMount() {
    this.handleOAuth2AndRedirect(this.props);
  }

  public componentWillReceiveProps(nextProps: OAuth2CompletionPageProps) {
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

  private handleOAuth2AndRedirect(props: OAuth2CompletionPageProps) {
    const queryParams = parse(props.location.search);
    const code = queryParams.code;

    if (!props.loggedIn) {
      // TODO: Need to handle case where user is not logged in but login failed.
      const provider = props.match.params.provider;

      const { hostname, oAuth2CallbackBasePath, port, useSsl } = props;
      const oAuth2CallbackUri = buildOAuth2CallbackUri(hostname, oAuth2CallbackBasePath, provider, port, useSsl);

      props.onOAuth2Completion(provider, code, oAuth2CallbackUri);
    }
    else {
      props.clearRedirect();
      // TODO: Should not be "/" here, should be a parameterized default path
      props.history.replace(props.redirectPath ? props.redirectPath : "/");
    }
  }
}

function mapStateToProps(state: AuthState): OAuth2CompletionPageStateProps {
  return {
    loggedIn: state.auth.loginState === LoginState.LoggedIn,
    redirectPath: state.auth.redirectPath
  };
}

function mapDispatchToProps(dispatch: Dispatch<AuthState>): OAuth2CompletionPageDispatchProps {
  return {
    clearRedirect: () => {
      dispatch(clearRedirect());
    },
    onOAuth2Completion: (provider: string, code: string, oAuth2CallbackUri: string) => {
      dispatch(login(provider, code, oAuth2CallbackUri));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter<OAuth2CompletionPageProps>(OAuth2CompletionPage));