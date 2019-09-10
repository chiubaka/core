import { ParsedQuery } from "query-string";
import { RouteComponentProps } from "react-router-dom";
import { AuthApi } from "../../actions";
import { ISocialLoginProvider } from "../../model/AuthenticationState";
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
export interface IOAuth2CompletionPageProps extends RouteComponentProps<IOAuth2CompletionPageParams>, IOAuth2CompletionPageMergeProps {
    loggedIn: boolean;
    redirectPath: string;
    clearRedirect: () => void;
}
export declare const OAuth2CompletionPage: import("react-redux").ConnectedComponentClass<any, Pick<unknown, never> & IOAuth2CompletionPageOwnProps>;
