import * as React from "react";

export interface IModalProps {
  footer?: JSX.Element[];
  id?: string;
  title: string;
}

export class Modal extends React.Component<IModalProps> {
  public render(): JSX.Element {
    const {footer, id, title} = this.props;

    return (
      <div
        className="modal fade"
        id={id}
        tabIndex={-1}
        role="dialog"
        aria-labelledby={`${id}-label`}
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`${id}-label`}>{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              {footer}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
