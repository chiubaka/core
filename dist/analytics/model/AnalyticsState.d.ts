export interface IAnalyticsState {
    analytics: IAnalyticsInnerState;
}
export interface IAnalyticsInnerState {
    enableFacebookAnalytics: boolean;
    googleAnalyticsId?: string;
    googleEmailSignUpConversionEventId?: string;
}
export declare const DEFAULT_ANALYTICS_STATE: IAnalyticsInnerState;
