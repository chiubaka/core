"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Icon extends React.Component {
    render() {
        const { fixedWidth, iconName, size } = this.props;
        const sizeClass = size ? `fa-${size}` : "";
        const fixedWidthClass = fixedWidth ? "fa-fw" : "";
        return (React.createElement("i", { className: `fa fa-${iconName} ${sizeClass} ${fixedWidthClass}` }));
    }
}
exports.Icon = Icon;

//# sourceMappingURL=../../dist/common/components/Icon.js.map
