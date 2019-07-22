import * as React from "react";
import { IAnalyticsInnerState } from "../../../analytics/model/AnalyticsState";
export interface IMailChimpSubscribeFormOwnProps {
    username: string;
    userId: string;
    listId: string;
    callToAction: string;
}
export interface IMailChimpSubscribeFormProps extends IMailChimpSubscribeFormOwnProps, IAnalyticsInnerState {
}
declare global {
    interface Window {
        fbq: (type: string, event: string, options?: any) => void;
        gtag: (command: string, type: string, options?: any) => void;
    }
}
declare class MailChimpSubscribeFormImpl extends React.Component<IMailChimpSubscribeFormProps> {
    constructor(props: IMailChimpSubscribeFormProps);
    onSubmit(): void;
    render(): JSX.Element;
}
export declare const MailChimpSubscribeForm: import("react-redux").ConnectedComponentClass<typeof MailChimpSubscribeFormImpl, Pick<IMailChimpSubscribeFormProps, "username" | "callToAction" | "userId" | "listId">>;
export {};
