import * as React from "react";
export interface INavbarEntry {
    text: string;
    path: string;
    current?: boolean;
}
export interface INavbarOwnProps {
    brandLink?: string;
    links: INavbarEntry[];
    logoSize?: number;
    light?: boolean;
}
export interface INavbarStateProps {
    logoPath?: string;
    productName: string;
}
export interface INavbarProps extends INavbarOwnProps, INavbarStateProps {
}
declare class NavbarImpl extends React.Component<INavbarProps> {
    static defaultProps: Partial<INavbarProps>;
    createLinks(): JSX.Element[];
    render(): JSX.Element;
}
export declare const Navbar: import("react-redux").ConnectedComponentClass<typeof NavbarImpl, Pick<INavbarProps, "light" | "brandLink" | "links" | "logoSize">>;
export {};
