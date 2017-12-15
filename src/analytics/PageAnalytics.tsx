import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { AnalyticsInnerState, AnalyticsState } from "./model/AnalyticsState";

declare type PageStateProps = AnalyticsInnerState;

declare type PageProps<MatchParams> = PageStateProps & RouteComponentProps<MatchParams>;

declare global {
  interface Window {
    fbq: (type: string, event: string, options?: any) => void;
    gtag: (command: string, type: string, options?: any) => void;
  }
}

export function withPageAnalytics<WrappedComponentProps>(WrappedComponent: React.ComponentClass<RouteComponentProps<any>>) {
  class Page<MatchParams> extends React.Component<PageProps<MatchParams> & WrappedComponentProps> {
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

  function mapStateToProps(state: AnalyticsState): PageStateProps {
    return state.analytics;
  }

  return connect(mapStateToProps)(Page);
}
