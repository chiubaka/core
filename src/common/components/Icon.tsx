import * as React from "react";

export interface IIconProps {
  fixedWidth?: boolean;
  iconName: string;
  size?: "lg" | "2x" | "3x" | "4x" | "5x";
}

export class Icon extends React.Component<IIconProps> {
  public render(): JSX.Element {
    const { fixedWidth, iconName, size } = this.props;
    const sizeClass = size ? `fa-${size}` : "";
    const fixedWidthClass = fixedWidth ? "fa-fw" : "";
    return (
      <i className={`fa fa-${iconName} ${sizeClass} ${fixedWidthClass}`}/>
    );
  }
}
