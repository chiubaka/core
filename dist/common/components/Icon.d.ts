import * as React from "react";
export interface IIconProps {
    fixedWidth?: boolean;
    iconName: string;
    size?: "lg" | "2x" | "3x" | "4x" | "5x";
}
export declare class Icon extends React.Component<IIconProps> {
    render(): JSX.Element;
}
