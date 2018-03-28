import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { IAnalyticsInnerState, IAnalyticsState } from "./model/AnalyticsState";

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    fbq: (type: string, event: string, options?: any) => void;
    gtag: (command: string, type: string, options?: any) => void;
  }
}

export function withPageAnalytics<TOriginalProps extends RouteComponentProps<any>>(
  WrappedComponent: (React.ComponentClass<TOriginalProps> | React.StatelessComponent<TOriginalProps>),
): React.ComponentClass<TOriginalProps> {
  class Page extends React.Component<TOriginalProps & IAnalyticsInnerState> {
    public componentDidMount(): void {
      const path = this.props.location.pathname;
      if (this.props.enableFacebookAnalytics) {
        window.fbq("track", "ViewContent", {content_name: path});
      }
      if (this.props.googleAnalyticsId) {
        window.gtag("config", this.props.googleAnalyticsId, {page_path: path});
      }
    }

    public render(): JSX.Element {
      return (
        <WrappedComponent {...this.props}/>
      );
    }
  }

  function mapStateToProps(state: IAnalyticsState): IAnalyticsInnerState {
    return state.analytics;
  }

  return connect<IAnalyticsInnerState, null, TOriginalProps>(mapStateToProps)(Page);
}
