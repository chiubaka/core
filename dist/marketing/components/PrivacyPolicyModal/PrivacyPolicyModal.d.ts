import * as React from "react";
export interface IPrivacyPolicyModalProps {
    productName: string;
}
declare class PrivacyPolicyModalImpl extends React.Component<IPrivacyPolicyModalProps> {
    render(): JSX.Element;
}
export declare const PrivacyPolicyModal: import("react-redux").ConnectedComponentClass<typeof PrivacyPolicyModalImpl, Pick<IPrivacyPolicyModalProps, never>>;
export {};
