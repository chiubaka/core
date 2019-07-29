import classnames from "classnames";
import * as React from "react";

export interface IProgressBarProps {
  striped?: boolean;
  animated?: boolean;
  progress: number;
}

export class ProgressBar extends React.Component<IProgressBarProps> {
  public render(): JSX.Element {
    const {striped, animated, progress} = this.props;
    const classNames = classnames(
      "progress-bar",
      striped ? "progress-bar-striped" : "",
      animated ? "progress-bar-animated" : "")
    ;
    return (
      <div className="progress">
        <div
          className={classNames}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{width: `${progress}%`}}
        />
      </div>
    );
  }
}
