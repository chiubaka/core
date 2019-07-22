import { parse } from "query-string";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { ProgressBar } from "../../../app/components/ProgressBar";
import { AuthApi, AuthDispatch as Dispatch, clearRedirect } from "../../actions";
import { IAuthState, LoginState } from "../../model/AuthenticationState";
import { buildOAuth2CallbackUri } from "../../utils/uri";

export interface IOAuth2CompletionPageParams {
  provider: string;
}

export interface IOAuth2CompletionPageStateProps {
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

      const { oAuth2CallbackBasePath } = props;
      const oAuth2CallbackUri = buildOAuth2CallbackUri(oAuth2CallbackBasePath, provider);

      props.onOAuth2Completion(provider, code as string, oAuth2CallbackUri);
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
  };
}

function mapDispatchToProps(dispatch: Dispatch): IOAuth2CompletionPageDispatchProps {
  return {
    clearRedirect: () => {
      dispatch(clearRedirect());
    },
    onOAuth2Completion: (provider: string, code: string, oAuth2CallbackUri: string) => {
      dispatch(AuthApi.getInstance().socialLogin(provider, code, oAuth2CallbackUri));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter<IOAuth2CompletionPageProps>(OAuth2CompletionPage));
