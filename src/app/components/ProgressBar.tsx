import * as React from "react";
import * as classnames from "classnames";

export interface ProgressBarProps {
  striped?: boolean;
  animated?: boolean;
  progress: number;
}

export class ProgressBar extends React.Component<ProgressBarProps> {
  public render(): JSX.Element {
    const {striped, animated, progress} = this.props;
    return (
      <div className="progress">
        <div
          className={classnames("progress-bar", striped ? "progress-bar-striped" : "", animated ? "progress-bar-animated" : "")}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{width: `${progress}%`}}
        >
        </div>
      </div>
    );
  }
}