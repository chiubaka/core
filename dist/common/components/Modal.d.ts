import * as React from "react";
export interface IModalProps {
    footer?: JSX.Element[];
    id?: string;
    title: string;
}
export declare class Modal extends React.Component<IModalProps> {
    render(): JSX.Element;
}
