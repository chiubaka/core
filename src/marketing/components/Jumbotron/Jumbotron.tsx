import classnames from "classnames";
import * as React from "react";

export interface IJumbotronProps {
  className?: string;
}

export class Jumbotron extends React.Component<IJumbotronProps> {
  public render(): JSX.Element {
    const {className} = this.props;

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
