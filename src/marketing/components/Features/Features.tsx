import * as React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../../common/components/Icon";

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

export class Features extends React.Component<IFeaturesProps> {
  public static defaultProps: Partial<IFeaturesProps> = {
    featuresPerRow: 3,
  };

  private static renderFeature(feature: IFeature): JSX.Element {
    return (
      <li key={feature.name}>
        <div className="icon-container">
          <Icon iconName={feature.iconName}/>
        </div>
        <h5>{feature.name}</h5>
        <p>{feature.description}</p>
      </li>
    );
  }

  private static renderCallToAction(callToAction: ICallToAction): JSX.Element {
    if (!callToAction) {
      return null;
    }
    return (
      <Link to={callToAction.path}>
        <button className="btn call-to-action">{callToAction.text}</button>
      </Link>
    );
  }

  public render(): JSX.Element {
    const {emotionalBenefit, sectionName} = this.props;

    return (
      <section className="features container list">
        <div className="headers">
          <h6>{sectionName}</h6>
          <h2>{emotionalBenefit}</h2>
        </div>
        <div className="feature-rows d-flex flex-column">
          {this.renderFeatures(this.props.features, this.props.featuresPerRow)}
        </div>
        {Features.renderCallToAction(this.props.callToAction)}
      </section>
    );
  }

  private renderFeatures(features: IFeature[], featuresPerRow: number): JSX.Element[] {
    const featureRows = [];

    const featureElements = features.map((feature) => {
      return Features.renderFeature(feature);
    });

    let i = 0;
    while (featureElements.length > 0) {
      featureRows.push(
        <div key={i}>
          <ul>
            {featureElements.splice(0, featuresPerRow)}
          </ul>
        </div>,
      );
      i++;
    }

    return featureRows;
  }
}
