import * as React from "react";
import { PrivacyPolicyModal, PrivacyPolicyModalProps } from "../PrivacyPolicyModal/PrivacyPolicyModal";

export interface FooterProps extends PrivacyPolicyModalProps {
  disclaimer?: string;
}

export class Footer extends React.Component<FooterProps> {
  public render(): JSX.Element {
    const disclaimer = this.props.disclaimer;

    return (
      <div className="footer bg-dark px-3 py-5">
        <div className="container d-flex flex-row">
          <div className="copyright text-light">
            &copy; Chiubaka Technologies 2017. All rights reserved. {disclaimer ? this.props.disclaimer : ""}
          </div>
          <div style={{paddingTop: "5px", flexGrow: 1, textAlign: "right"}}>
            <a href="#" data-toggle="modal" data-target="#privacy-policy" title="Privacy Policy">Privacy Policy</a>
          </div>
        </div>
        <PrivacyPolicyModal {...this.props}/>
      </div>
    );
  }
}
