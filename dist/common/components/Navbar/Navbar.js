"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classnames = require("classnames");
const React = require("react");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
class NavbarImpl extends React.Component {
    createLinks() {
        return this.props.links.map((link, index) => {
            return (React.createElement("li", { key: index, className: classnames("nav-item", link.current ? "active" : "") },
                React.createElement(react_router_dom_1.NavLink, { className: "nav-link", to: link.path },
                    link.text,
                    link.current ? React.createElement("span", { className: "sr-only" }, "(current)") : "")));
        });
    }
    render() {
        const { light, logoPath, productName } = this.props;
        const logoElement = logoPath ?
            (React.createElement("img", { src: logoPath, width: this.props.logoSize, height: this.props.logoSize, alt: productName, className: "d-inline-block align-top logo" }))
            : null;
        return (React.createElement("nav", { className: classnames("navbar navbar-expand-sm", light ? "navbar-light" : "navbar-dark") },
            React.createElement(react_router_dom_1.Link, { className: "navbar-brand", to: this.props.brandLink },
                logoElement,
                React.createElement("span", { className: "product-name" }, productName)),
            React.createElement("button", { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#navbarSupportedContent", "aria-controls": "navbarSupportedContent", "aria-expanded": "false", "aria-label": "Toggle navigation" },
                React.createElement("span", { className: "navbar-toggler-icon" })),
            React.createElement("div", { className: "collapse navbar-collapse", id: "navbarSupportedContent" },
                React.createElement("ul", { className: "navbar-nav ml-auto align-top" }, this.createLinks()))));
    }
}
NavbarImpl.defaultProps = {
    brandLink: "/",
    logoSize: 30,
};
function mapStateToProps(state) {
    return {
        logoPath: state.product.logoPath,
        productName: state.product.productName,
    };
}
exports.Navbar = react_redux_1.connect(mapStateToProps)(NavbarImpl);

//# sourceMappingURL=../../../dist/common/components/Navbar/Navbar.js.map
