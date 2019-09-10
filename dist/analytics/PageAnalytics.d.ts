import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
declare global {
    interface Window {
        fbq: (type: string, event: string, options?: any) => void;
        gtag: (command: string, type: string, options?: any) => void;
    }
}
export declare function withPageAnalytics<TOriginalProps extends RouteComponentProps<any>>(WrappedComponent: (React.ComponentClass<TOriginalProps> | React.StatelessComponent<TOriginalProps>)): import("react-redux").ConnectedComponentClass<any, Pick<unknown, never>>;
