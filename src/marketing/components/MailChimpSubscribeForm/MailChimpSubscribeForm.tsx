import * as React from "react";
import { connect } from "react-redux";
import { IAnalyticsInnerState, IAnalyticsState } from "../../../analytics/model/AnalyticsState";

export interface IMailChimpSubscribeFormOwnProps {
  username: string;
  userId: string;
  listId: string;
  callToAction: string;
}

export interface IMailChimpSubscribeFormProps extends IMailChimpSubscribeFormOwnProps, IAnalyticsInnerState {}

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    fbq: (type: string, event: string, options?: any) => void;
    gtag: (command: string, type: string, options?: any) => void;
  }
}

class MailChimpSubscribeForm extends React.Component<IMailChimpSubscribeFormProps> {
  constructor() {
    super();

    this.onSubmit = this.onSubmit.bind(this);
  }

  public onSubmit(): void {
    // TODO: Re-enable metrics in production
    if (this.props.enableFacebookAnalytics) {
      window.fbq("track", "Lead");
    }
    if (this.props.googleAnalyticsId) {
      window.gtag("event", "click", {event_category: "button", event_label: "Beta SignUp"});
    }
    if (this.props.googleEmailSignUpConversionEventId) {
      window.gtag("event", "conversion", {
        send_to: this.props.googleEmailSignUpConversionEventId,
      });
    }
  }

  public render(): JSX.Element {
    const {username, userId, listId, callToAction} = this.props;

    return (
      <div>
        <div id="mc_embed_signup">
          <form
            action={`//${username}.us16.list-manage.com/subscribe/post?u=${userId}&amp;id=${listId}`}
            method="post"
            id="mc-embedded-subscribe-form"
            name="mc-embedded-subscribe-form"
            className="validate"
            target="_blank"
            noValidate={true}
          >
            <div id="mc_embed_signup_scroll" className="form-group">
              <input
                type="email"
                name="EMAIL"
                className="email form-control"
                id="mce-EMAIL"
                placeholder="Enter email address"
                required={true}
              />
              <div
                style={{position: "absolute", left: "-5000px"}}
                aria-hidden="true"
              >
                <input type="text" name={`b_${userId}_${listId}`} tabIndex={-1} value=""/>
              </div>
            </div>
            <button
              type="submit"
              name="subscribe"
              id="mc-embedded-subscribe"
              className="btn call-to-action"
              onClick={this.onSubmit}
            >
              {callToAction}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAnalyticsState): IAnalyticsInnerState {
  return state.analytics;
}

export default connect(mapStateToProps)(MailChimpSubscribeForm);
