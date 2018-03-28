import * as classnames from "classnames";
import * as React from "react";

export interface IJumbotronProps {
  backgroundColor?: string;
  backgroundImage?: string;
  className?: string;
  overlayOpacity?: number;
}

export class Jumbotron extends React.Component<IJumbotronProps> {
  public render(): JSX.Element {
    const {backgroundColor, backgroundImage, className} = this.props;
    const overlayOpacity = this.props.overlayOpacity ? this.props.overlayOpacity : 0;

    return (
      <div
        className={classnames("jumbotron-fluid", className)}
      >
        <div className="h-100 w-100 d-table">
          <div className="jumbotron-inner d-table-cell align-middle">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
