/// <reference types="react-router" />
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
export interface IAuthenticatedContainerStateProps {
    isLoggedIn: boolean;
}
export interface IAuthenticatedContainerOwnProps {
    id?: string;
    className?: string;
    loginPath?: string;
}
export interface IAuthenticatedContainerProps extends RouteComponentProps<any>, IAuthenticatedContainerStateProps, IAuthenticatedContainerOwnProps {
}
declare class AuthenticatedContainerImpl extends React.Component<IAuthenticatedContainerProps, {}> {
    static defaultProps: Partial<IAuthenticatedContainerProps>;
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: IAuthenticatedContainerProps): void;
    render(): JSX.Element;
    private checkAuthentication;
}
export declare const AuthenticatedContainer: import("react-redux").ConnectedComponentClass<React.ComponentClass<Pick<IAuthenticatedContainerProps, "id" | "isLoggedIn" | "className" | "loginPath"> & {
    wrappedComponentRef?: React.Ref<AuthenticatedContainerImpl>;
}, any> & import("react-router").WithRouterStatics<typeof AuthenticatedContainerImpl>, Pick<Pick<IAuthenticatedContainerProps, "id" | "isLoggedIn" | "className" | "loginPath"> & {
    wrappedComponentRef?: React.Ref<AuthenticatedContainerImpl>;
}, "id" | "className" | "loginPath" | "wrappedComponentRef">>;
export {};
