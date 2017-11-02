import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { parse } from "query-string";
import { Dispatch } from "redux";
import { AuthState } from "../model/AuthenticationState";
import { login } from "../actions/index";
import { connect } from "react-redux";
import { buildOAuthCallbackUri, buildUri } from "../utils/uri";

export interface OAuth2CompletionPageParams {
  provider: string;
}

export interface OAuth2CompletionPageDispatchProps {
  onOAuth2Completion: (provider: string, code: string, redirectUri: string) => void;
}

export interface OAuth2CompletionPageOwnProps {
  hostname: string;
  port?: number;
  oAuth2CallbackBasePath?: string;
  useSsl?: boolean;
}

export declare type OAuth2CompletionPageProps = RouteComponentProps<OAuth2CompletionPageParams> & OAuth2CompletionPageOwnProps
  & OAuth2CompletionPageDispatchProps;

class OAuth2CompletionPage extends React.Component<OAuth2CompletionPageProps> {
  public componentWillMount() {
    const provider = this.props.match.params.provider;
    const code = parse(this.props.location.search).code;

    const { hostname, oAuth2CallbackBasePath, port, useSsl } = this.props;
    const redirectUri = buildOAuthCallbackUri(hostname, oAuth2CallbackBasePath, provider, port, useSsl);

    this.props.onOAuth2Completion(provider, code, redirectUri);
  }

  public render(): JSX.Element {
    return (
      <div>
        {this.props.match.params.provider} OAuth2 Complete!
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<AuthState>): OAuth2CompletionPageDispatchProps {
  return {
    onOAuth2Completion: (provider: string, code: string, redirectUri: string) => {
      dispatch(login(provider, code, redirectUri));
    }
  };
}

export default connect(null, mapDispatchToProps)(withRouter<OAuth2CompletionPageProps>(OAuth2CompletionPage));