"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Icon_1 = require("../../../common/components/Icon");
class Features extends React.Component {
    static renderFeature(feature) {
        return (React.createElement("li", { key: feature.name },
            React.createElement("div", { className: "icon-container" },
                React.createElement(Icon_1.Icon, { iconName: feature.iconName })),
            React.createElement("h5", null, feature.name),
            React.createElement("p", null, feature.description)));
    }
    static renderCallToAction(callToAction) {
        if (!callToAction) {
            return null;
        }
        return (React.createElement(react_router_dom_1.Link, { to: callToAction.path },
            React.createElement("button", { className: "btn call-to-action" }, callToAction.text)));
    }
    render() {
        const { emotionalBenefit, sectionName } = this.props;
        return (React.createElement("section", { className: "features container list" },
            React.createElement("div", { className: "headers" },
                React.createElement("h6", null, sectionName),
                React.createElement("h2", null, emotionalBenefit)),
            React.createElement("div", { className: "feature-rows d-flex flex-column" }, this.renderFeatures(this.props.features, this.props.featuresPerRow)),
            Features.renderCallToAction(this.props.callToAction)));
    }
    renderFeatures(features, featuresPerRow) {
        const featureRows = [];
        const featureElements = features.map((feature) => {
            return Features.renderFeature(feature);
        });
        let i = 0;
        while (featureElements.length > 0) {
            featureRows.push(React.createElement("div", { key: i },
                React.createElement("ul", null, featureElements.splice(0, featuresPerRow))));
            i++;
        }
        return featureRows;
    }
}
Features.defaultProps = {
    featuresPerRow: 3,
};
exports.Features = Features;
//# sourceMappingURL=Features.js.map