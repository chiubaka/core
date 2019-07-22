import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
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
export interface IOAuth2CompletionPageProps extends RouteComponentProps<IOAuth2CompletionPageParams>, IOAuth2CompletionPageStateProps, IOAuth2CompletionPageDispatchProps {
}
declare const _default: import("react-redux").ConnectedComponentClass<React.ComponentClass<Pick<IOAuth2CompletionPageProps, "redirectPath" | "oAuth2CallbackBasePath" | "loggedIn" | "clearRedirect" | "onOAuth2Completion">, any>, Pick<Pick<IOAuth2CompletionPageProps, "redirectPath" | "oAuth2CallbackBasePath" | "loggedIn" | "clearRedirect" | "onOAuth2Completion">, never>>;
export default _default;
