import * as React from "react";
import { ISocialLoginProvider } from "../model/AuthenticationState";
export interface ISocialLoginButtonOwnProps {
    provider: ISocialLoginProvider;
}
export interface ISocialLoginButtonStateProps {
    oAuth2Uri: string;
}
export interface ISocialLoginButtonProps extends ISocialLoginButtonOwnProps, ISocialLoginButtonStateProps {
}
declare class SocialLoginButtonImpl extends React.Component<ISocialLoginButtonProps> {
    static OAUTH2_GATEWAYS: {
        [provider: string]: string;
    };
    static OAUTH2_PROVIDER_ALIAS: {
        [provider: string]: string;
    };
    render(): JSX.Element;
}
export declare const SocialLoginButton: import("react-redux").ConnectedComponentClass<typeof SocialLoginButtonImpl, Pick<ISocialLoginButtonProps, "provider"> & ISocialLoginButtonOwnProps>;
export {};
