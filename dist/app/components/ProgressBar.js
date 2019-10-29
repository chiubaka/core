"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
const React = __importStar(require("react"));
class ProgressBar extends React.Component {
    render() {
        const { striped, animated, progress } = this.props;
        const classNames = classnames_1.default("progress-bar", striped ? "progress-bar-striped" : "", animated ? "progress-bar-animated" : "");
        return (React.createElement("div", { className: "progress" },
            React.createElement("div", { className: classNames, role: "progressbar", "aria-valuenow": progress, "aria-valuemin": 0, "aria-valuemax": 100, style: { width: `${progress}%` } })));
    }
}
exports.ProgressBar = ProgressBar;
//# sourceMappingURL=ProgressBar.js.map