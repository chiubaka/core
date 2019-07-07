import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { AuthApi } from "../actions";
export interface ILogoutPageDispatchProps {
    onLogout: () => void;
}
export interface ILogoutPageOwnProps extends RouteComponentProps<any> {
    redirectUri?: string;
}
export interface ILogoutPageProps extends ILogoutPageOwnProps, ILogoutPageDispatchProps {
}
export declare function buildLogoutPage(api: AuthApi): React.ComponentClass<Pick<Pick<ILogoutPageProps, "match" | "location" | "history" | "staticContext" | "redirectUri"> & ILogoutPageOwnProps, "redirectUri">, any>;
