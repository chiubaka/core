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
class Jumbotron extends React.Component {
    render() {
        const { className } = this.props;
        return (React.createElement("div", { className: classnames_1.default("jumbotron-fluid", className) },
            React.createElement("div", { className: "h-100 w-100 d-table" },
                React.createElement("div", { className: "jumbotron-inner d-table-cell align-middle" }, this.props.children))));
    }
}
exports.Jumbotron = Jumbotron;
//# sourceMappingURL=Jumbotron.js.map