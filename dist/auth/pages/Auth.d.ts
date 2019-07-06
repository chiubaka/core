import * as React from "react";
export interface IAuthStateProps {
    oAuth2CallbackBasePath: string;
}
export declare class AuthImpl extends React.Component<IAuthStateProps> {
    constructor(props: IAuthStateProps);
    render(): JSX.Element;
    private renderOAuth2CompletionPage;
    private renderLoginPage;
}
export declare const Auth: import("react-redux").ConnectedComponentClass<typeof AuthImpl, Pick<IAuthStateProps, never>>;
