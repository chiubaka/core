import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
export interface ILogoutPageDispatchProps {
    onLogout: () => void;
}
export interface ILogoutPageOwnProps extends RouteComponentProps<any> {
    redirectUri?: string;
}
export interface ILogoutPageProps extends ILogoutPageOwnProps, ILogoutPageDispatchProps {
}
declare const _default: React.ComponentClass<Pick<Pick<ILogoutPageProps, "match" | "location" | "history" | "staticContext" | "redirectUri"> & ILogoutPageOwnProps, "redirectUri">, any>;
export default _default;
