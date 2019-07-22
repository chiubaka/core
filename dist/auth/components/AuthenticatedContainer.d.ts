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
export declare const AuthenticatedContainer: import("react-redux").ConnectedComponentClass<React.ComponentClass<Pick<IAuthenticatedContainerProps, "id" | "className" | "isLoggedIn" | "loginPath">, any>, Pick<Pick<IAuthenticatedContainerProps, "id" | "className" | "isLoggedIn" | "loginPath">, "id" | "className" | "loginPath">>;
