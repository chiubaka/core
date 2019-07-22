"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
class PrivacyPolicyModalImpl extends React.Component {
    render() {
        const { productName, hostname } = this.props;
        return (React.createElement("div", { className: "modal fade", id: "privacy-policy", tabIndex: -1, role: "dialog", "aria-labelledby": "exampleModalLongTitle", "aria-hidden": "true" },
            React.createElement("div", { className: "modal-dialog", role: "document" },
                React.createElement("div", { className: "modal-content" },
                    React.createElement("div", { className: "modal-header" },
                        React.createElement("h5", { className: "modal-title", id: "privacy-policy-title" },
                            productName,
                            " Privacy Policy"),
                        React.createElement("button", { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                            React.createElement("span", { "aria-hidden": "true" }, "\u00D7"))),
                    React.createElement("div", { className: "modal-body" },
                        React.createElement("p", null, "This Privacy Policy was last modified on March 26, 2018."),
                        React.createElement("p", null,
                            "Chiubaka Technologies, LLC (\u201Cus\u201D, \u201Cwe\u201D, \u201Cour\u201D) operates https://",
                            hostname,
                            " (the \u201CSite\u201D). This page informs you of our policies regarding the collection, use, and disclosure of Personal Information we receive from users of the Site."),
                        React.createElement("p", null, "We use your Personal Information only for providing and improving the Site. By using the Site, you agree to the collection and use of information in accordance with this policy."),
                        React.createElement("h4", null, "Cookies"),
                        React.createElement("p", null, "Cookies are files with small amounts of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer\u2019s hard drive."),
                        React.createElement("p", null, "Like many sites, we use \u201Ccookies\u201D to collect information. Third parties may also use cookies and similar technologies to collect or receive information from this Site and elsewhere on the internet and use that information to provide measurement services and target ads. Specifically, this Site employs third party cookies from Google and Facebook to collect anonymous data about your usage of this site for analysis and advertisement targeting."),
                        React.createElement("p", null, "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site."),
                        React.createElement("h4", null, "Information Collection and Use"),
                        React.createElement("p", null, "While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to your name (\u201CPersonal Information\u201D)."),
                        React.createElement("h4", null, "Log Data"),
                        React.createElement("p", null, "Like many site operators, we collect information that your browser sends whenever you visit our Site (\u201CLog Data\u201D)."),
                        React.createElement("p", null, "This Log Data may include information such as your computer\u2019s Internet Protocol (\u201CIP\u201D) address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, the time spent on those pages and other statistics."),
                        React.createElement("p", null,
                            "In addition, we use Google Analytics as a third-party service to collect, monitor, and analyze this data. Log Data about your Site usage is sent to Google Analytics via \u201Ccookies\u201D. For a full disclosure of how Google makes use of this data, please see their privacy and terms ",
                            React.createElement("a", { href: "https://www.google.com/policies/privacy/partners/" }, "here"),
                            "."),
                        React.createElement("p", null, "This Site makes use of advanced Google Analytics Advertising Features such as Remarketing with Google Analytics, Google Display Network Impression Reporting, and Google Analytics Demographics and Interest Reporting. Log Data may be used along with other third-party advertising \u201Ccookies\u201D to target advertisements for you on this website and on others."),
                        React.createElement("p", null, "This Site also sends Log Data and information collected in third-party cookies to Facebook for use with Facebook Tools, which provide additional site analytics and ad targeting services."),
                        React.createElement("p", null,
                            "You have the right to opt-out of allowing your data to be used for analytics and advertising purposes. For Google Analytics, you may opt-out by following Google\u2019s instructions ",
                            React.createElement("a", { href: "https://tools.google.com/dlpage/gaoptout/" }, "here"),
                            ". You can find more information about opting out of third party advertising cookies ",
                            React.createElement("a", { href: "http://www.aboutads.info/choices" }, "here"),
                            "."),
                        React.createElement("h4", null, "Communications"),
                        React.createElement("p", null, "We may use your Personal Information to contact you with newsletters, marketing, or promotional materials and other information that pertains to your usage of the Site."),
                        React.createElement("h4", null, "Security"),
                        React.createElement("p", null, "The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security."),
                        React.createElement("h4", null, "Changes to This Privacy Policy"),
                        React.createElement("p", null, "This Privacy Policy is effective as of October 13, 2017 and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page."),
                        React.createElement("p", null, "We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy."),
                        React.createElement("p", null, "If we make any material changes to this Privacy Policy, we will notify you either through the email address you have provided us, or by placing a prominent notice on our website."),
                        React.createElement("h4", null, "Contact Us"),
                        "If you have any questions about this Privacy Policy, please contact us by sending an email to ",
                        React.createElement("a", { href: `mailto:privacy@${hostname}` },
                            "privacy@",
                            hostname),
                        "."),
                    React.createElement("div", { className: "modal-footer" },
                        React.createElement("button", { type: "button", className: "btn btn-secondary", "data-dismiss": "modal" }, "Close"))))));
    }
}
function mapStateToProps(state) {
    return {
        productName: state.product.productName,
        hostname: state.service.hostname,
    };
}
exports.PrivacyPolicyModal = react_redux_1.connect(mapStateToProps)(PrivacyPolicyModalImpl);

//# sourceMappingURL=../../../dist/marketing/components/PrivacyPolicyModal/PrivacyPolicyModal.js.map
