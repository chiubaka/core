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
class Icon extends React.Component {
    render() {
        const { fixedWidth, iconName, size } = this.props;
        const sizeClass = size ? `fa-${size}` : "";
        const fixedWidthClass = fixedWidth ? "fa-fw" : "";
        return (React.createElement("i", { className: `fa fa-${iconName} ${sizeClass} ${fixedWidthClass}` }));
    }
}
exports.Icon = Icon;
//# sourceMappingURL=Icon.js.map