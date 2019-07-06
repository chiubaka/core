"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
class MailChimpSubscribeFormImpl extends React.Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit() {
        // TODO: Re-enable metrics in production
        if (this.props.enableFacebookAnalytics) {
            window.fbq("track", "Lead");
        }
        if (this.props.googleAnalyticsId) {
            window.gtag("event", "click", { event_category: "button", event_label: "Beta SignUp" });
        }
        if (this.props.googleEmailSignUpConversionEventId) {
            window.gtag("event", "conversion", {
                send_to: this.props.googleEmailSignUpConversionEventId,
            });
        }
    }
    render() {
        const { username, userId, listId, callToAction } = this.props;
        return (React.createElement("div", null,
            React.createElement("div", { id: "mc_embed_signup" },
                React.createElement("form", { action: `//${username}.us16.list-manage.com/subscribe/post?u=${userId}&amp;id=${listId}`, method: "post", id: "mc-embedded-subscribe-form", name: "mc-embedded-subscribe-form", className: "validate", target: "_blank", noValidate: true },
                    React.createElement("div", { id: "mc_embed_signup_scroll", className: "form-group" },
                        React.createElement("input", { type: "email", name: "EMAIL", className: "email form-control", id: "mce-EMAIL", placeholder: "Enter email address", required: true }),
                        React.createElement("div", { style: { position: "absolute", left: "-5000px" }, "aria-hidden": "true" },
                            React.createElement("input", { type: "text", name: `b_${userId}_${listId}`, tabIndex: -1, value: "" }))),
                    React.createElement("button", { type: "submit", name: "subscribe", id: "mc-embedded-subscribe", className: "btn call-to-action", onClick: this.onSubmit }, callToAction)))));
    }
}
function mapStateToProps(state) {
    return state.analytics;
}
exports.MailChimpSubscribeForm = react_redux_1.connect(mapStateToProps)(MailChimpSubscribeFormImpl);

//# sourceMappingURL=../../../dist/marketing/components/MailChimpSubscribeForm/MailChimpSubscribeForm.js.map
