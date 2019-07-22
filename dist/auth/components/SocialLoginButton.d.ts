import * as React from "react";
export interface ISocialLoginButtonOwnProps {
    clientId: string;
    providerName: string;
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
    static OAUTH2_ADDITIONAL_PARAMETERS: {
        [provider: string]: {
            [parameter: string]: string;
        };
    };
    render(): JSX.Element;
}
export declare const SocialLoginButton: import("react-redux").ConnectedComponentClass<typeof SocialLoginButtonImpl, Pick<ISocialLoginButtonProps, "clientId" | "providerName"> & ISocialLoginButtonOwnProps>;
export {};
