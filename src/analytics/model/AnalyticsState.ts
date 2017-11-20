export interface AnalyticsState {
  analytics: AnalyticsInnerState;
}

export interface AnalyticsInnerState {
  enableFacebookAnalytics: boolean;
  googleAnalyticsId?: string;
  googleEmailSignUpConversionEventId?: string;
}

export const DEFAULT_ANALYTICS_STATE: AnalyticsInnerState = {
  enableFacebookAnalytics: false
};