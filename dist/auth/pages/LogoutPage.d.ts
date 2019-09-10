/// <reference types="react-router" />
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AuthApi } from "../actions";
export interface ILogoutPageDispatchProps {
    dispatchLogout: (api: AuthApi) => void;
}
interface ILogoutPageMergeProps {
    onLogout: () => void;
}
export interface ILogoutPageOwnProps extends RouteComponentProps<any> {
    api: AuthApi;
    redirectUri?: string;
}
export interface ILogoutPageProps extends Omit<ILogoutPageOwnProps, "api">, Omit<ILogoutPageDispatchProps, "dispatchLogout">, ILogoutPageMergeProps {
}
declare class LogoutPageImpl extends React.Component<ILogoutPageProps, {}> {
    componentWillMount(): void;
    render(): JSX.Element;
}
export declare const LogoutPage: React.ComponentClass<Pick<Pick<ILogoutPageProps, "history" | "location" | "match" | "staticContext" | "redirectUri"> & ILogoutPageOwnProps, "api" | "redirectUri"> & {
    wrappedComponentRef?: React.Ref<React.Component<Pick<ILogoutPageProps, "history" | "location" | "match" | "staticContext" | "redirectUri"> & ILogoutPageOwnProps, any, any>>;
}, any> & import("react-router").WithRouterStatics<import("react-redux").ConnectedComponentClass<typeof LogoutPageImpl, Pick<ILogoutPageProps, "history" | "location" | "match" | "staticContext" | "redirectUri"> & ILogoutPageOwnProps>>;
export {};
