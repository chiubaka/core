import * as React from "react";
import { connect } from "react-redux";
import { IProductState, IServiceState } from "../../../app/model/index";

export interface IPrivacyPolicyModalProps {
  productName: string;
  hostname: string;
}

class PrivacyPolicyModalImpl extends React.Component<IPrivacyPolicyModalProps> {
  public render(): JSX.Element {
    const { productName, hostname } = this.props;

    return (
      <div
        className="modal fade"
        id="privacy-policy"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLongTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="privacy-policy-title">{productName} Privacy Policy</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>
                This Privacy Policy was last modified on October 13, 2017.
              </p>
              <p>
                Chiubaka Technologies (“us”, “we”, “our”) operates https://{hostname} (the “Site”). This page informs
                you of our policies regarding the collection, use, and disclosure of Personal Information we receive
                from users of the Site.
              </p>
              <p>
                We use your Personal Information only for providing and improving the Site. By using the Site, you agree
                to the collection and use of information in accordance with this policy.
              </p>

              <h4>Cookies</h4>
              <p>
                Cookies are files with small amounts of data, which may include an anonymous unique identifier. Cookies
                are sent to your browser from a web site and stored on your computer’s hard drive.
              </p>
              <p>
                Like many sites, we use “cookies” to collect information. Third parties may also use cookies and similar
                technologies to collect or receive information from this Site and elsewhere on the internet and use that
                information to provide measurement services and target ads. Specifically, this Site employs third party
                cookies from Google and Facebook to collect anonymous data about your usage of this site for analysis
                and advertisement targeting.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                However, if you do not accept cookies, you may not be able to use some portions of our Site.
              </p>

              <h4>Information Collection and Use</h4>
              <p>
                While using our Site, we may ask you to provide us with certain personally identifiable information that
                can be used to contact or identify you. Personally identifiable information may include, but is not
                limited to your name (“Personal Information”).
              </p>

              <h4>Log Data</h4>
              <p>
                Like many site operators, we collect information that your browser sends whenever you visit our Site
                (“Log Data”).
              </p>
              <p>
                This Log Data may include information such as your computer’s Internet Protocol (“IP”) address, browser
                type, browser version, the pages of our Site that you visit, the time and date of your visit, the time
                spent on those pages and other statistics.
              </p>
              <p>
                In addition, we use Google Analytics as a third-party service to collect, monitor, and analyze this
                data. Log Data about your Site usage is sent to Google Analytics via “cookies”. For a full disclosure of
                how Google makes use of this data, please see their privacy and
                terms <a href="https://www.google.com/policies/privacy/partners/">here</a>.
              </p>
              <p>
                This Site makes use of advanced Google Analytics Advertising Features such as Remarketing with Google
                Analytics, Google Display Network Impression Reporting, and Google Analytics Demographics and Interest
                Reporting. Log Data may be used along with other third-party advertising “cookies” to target
                advertisements for you on this website and on others.
              </p>
              <p>
                This Site also sends Log Data and information collected in third-party cookies to Facebook for use with
                Facebook Tools, which provide additional site analytics and ad targeting services.
              </p>
              <p>You have the right to opt-out of allowing your data to be used for analytics and advertising purposes.
                For Google Analytics, you may opt-out by following Google’s
                instructions <a href="https://tools.google.com/dlpage/gaoptout/">here</a>.
                You can find more information about opting out of third party advertising
                cookies <a href="http://www.aboutads.info/choices">here</a>.
              </p>

              <h4>Communications</h4>
              <p>
                We may use your Personal Information to contact you with newsletters, marketing, or promotional
                materials and other information that pertains to your usage of the Site.
              </p>

              <h4>Security</h4>
              <p>
                The security of your Personal Information is important to us, but remember that no method of
                transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use
                commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute
                security.
              </p>

              <h4>Changes to This Privacy Policy</h4>
              <p>
                This Privacy Policy is effective as of October 13, 2017 and will remain in effect except with respect
                to any changes in its provisions in the future, which will be in effect immediately after being posted
                on this page.
              </p>
              <p>
                We reserve the right to update or change our Privacy Policy at any time and you should check this
                Privacy Policy periodically. Your continued use of the Service after we post any modifications to the
                Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to
                abide and be bound by the modified Privacy Policy.
              </p>
              <p>
                If we make any material changes to this Privacy Policy, we will notify you either through the email
                address you have provided us, or by placing a prominent notice on our website.
              </p>

              <h4>Contact Us</h4>

              If you have any questions about this Privacy Policy, please contact us by sending an email
              to <a href={`mailto:privacy@${hostname}`}>privacy@{hostname}</a>.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IProductState & IServiceState) {
  return {
    productName: state.product.productName,
    hostname: state.service.hostname,
  };
}

export const PrivacyPolicyModal = connect(mapStateToProps)(PrivacyPolicyModalImpl);
