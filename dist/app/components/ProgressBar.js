"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classnames = require("classnames");
const React = require("react");
class ProgressBar extends React.Component {
    render() {
        const { striped, animated, progress } = this.props;
        const classNames = classnames("progress-bar", striped ? "progress-bar-striped" : "", animated ? "progress-bar-animated" : "");
        return (React.createElement("div", { className: "progress" },
            React.createElement("div", { className: classNames, role: "progressbar", "aria-valuenow": progress, "aria-valuemin": 0, "aria-valuemax": 100, style: { width: `${progress}%` } })));
    }
}
exports.ProgressBar = ProgressBar;

//# sourceMappingURL=../../dist/app/components/ProgressBar.js.map
