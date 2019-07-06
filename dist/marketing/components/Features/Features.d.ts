import * as React from "react";
export interface ICallToAction {
    text: string;
    path: string;
}
export interface IFeature {
    iconName: string;
    name: string;
    description: string;
}
export interface IFeaturesProps {
    callToAction?: ICallToAction;
    emotionalBenefit: string;
    features: IFeature[];
    featuresPerRow?: number;
    sectionName: string;
}
export declare class Features extends React.Component<IFeaturesProps> {
    static defaultProps: Partial<IFeaturesProps>;
    private static renderFeature;
    private static renderCallToAction;
    render(): JSX.Element;
    private renderFeatures;
}
