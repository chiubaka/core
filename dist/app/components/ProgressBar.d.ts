import * as React from "react";
export interface IProgressBarProps {
    striped?: boolean;
    animated?: boolean;
    progress: number;
}
export declare class ProgressBar extends React.Component<IProgressBarProps> {
    render(): JSX.Element;
}
