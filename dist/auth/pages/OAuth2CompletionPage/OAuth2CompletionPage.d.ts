import { ParsedQuery } from "query-string";
import { RouteComponentProps } from "react-router-dom";
import { IServiceInnerState } from "../../../app/model";
import { AuthApi } from "../../actions";
import { ISocialLoginProvider } from "../../model/AuthenticationState";
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
export interface IOAuth2CompletionPageProps extends RouteComponentProps<IOAuth2CompletionPageParams>, IOAuth2CompletionPageMergeProps {
    loggedIn: boolean;
    redirectPath: string;
    clearRedirect: () => void;
}
export declare function buildOAuth2CompletionPage(api: AuthApi): import("react-redux").ConnectedComponentClass<any, Pick<unknown, never>>;
