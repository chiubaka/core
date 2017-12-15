import * as React from "react";
import { connect } from "react-redux";
import { AnalyticsInnerState, AnalyticsState } from "../../../analytics/model/AnalyticsState";

export declare type MailChimpSubscribeFormStateProps = AnalyticsInnerState;

export interface MailChimpSubscribeFormOwnProps {
  username: string;
  userId: string;
  listId: string;
  callToAction: string;
}

export declare type MailChimpSubscribeFormProps = MailChimpSubscribeFormOwnProps & MailChimpSubscribeFormStateProps;

declare global {
  interface Window {
    fbq: (type: string, event: string, options?: any) => void;
    gtag: (command: string, type: string, options?: any) => void;
  }
}

class MailChimpSubscribeForm extends React.Component<MailChimpSubscribeFormProps> {
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
          <form action={`//${username}.us16.list-manage.com/subscribe/post?u=${userId}&amp;id=${listId}`} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
            <div id="mc_embed_signup_scroll" className="form-group">
              <input type="email" name="EMAIL" className="email form-control" id="mce-EMAIL" placeholder="Enter email address" required/>
              <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true"><input type="text" name={`b_${userId}_${listId}`} tabIndex={-1} value=""/></div>
            </div>
            <button type="submit" name="subscribe" id="mc-embedded-subscribe" className="btn call-to-action" onClick={this.onSubmit}>{callToAction}</button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: AnalyticsState): MailChimpSubscribeFormStateProps {
  return state.analytics;
}

export default connect(mapStateToProps)(MailChimpSubscribeForm);
