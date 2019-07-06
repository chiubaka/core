"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classnames = require("classnames");
const React = require("react");
class Jumbotron extends React.Component {
    render() {
        const { className } = this.props;
        return (React.createElement("div", { className: classnames("jumbotron-fluid", className) },
            React.createElement("div", { className: "h-100 w-100 d-table" },
                React.createElement("div", { className: "jumbotron-inner d-table-cell align-middle" }, this.props.children))));
    }
}
exports.Jumbotron = Jumbotron;

//# sourceMappingURL=../../../dist/marketing/components/Jumbotron/Jumbotron.js.map
