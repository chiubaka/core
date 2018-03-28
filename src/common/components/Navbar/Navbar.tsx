import * as classnames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { IProductState } from "../../../app/model/index";

export interface INavbarEntry {
  text: string;
  path: string;
  current?: boolean;
}

export interface INavbarOwnProps {
  brandLink?: string;
  links: INavbarEntry[];
  logoSize?: number;
  light?: boolean;
}

export interface INavbarStateProps {
  logoPath?: string;
  productName: string;
}

export interface INavbarProps extends INavbarOwnProps, INavbarStateProps {}

class NavbarImpl extends React.Component<INavbarProps> {
  public static defaultProps: Partial<INavbarProps> = {
    brandLink: "/",
    logoSize: 30,
  };

  public createLinks(): JSX.Element[] {
    return this.props.links.map((link, index) => {
      return (
        <li key={index} className={classnames("nav-item", link.current ? "active" : "")}>
          <NavLink
            className="nav-link"
            to={link.path}
          >
            {link.text}{link.current ? <span className="sr-only">(current)</span> : ""}
          </NavLink>
        </li>
      );
    });
  }

  public render(): JSX.Element {
    const { light, logoPath, productName } = this.props;

    const logoElement = logoPath ?
      (
        <img
          src={logoPath}
          width={this.props.logoSize}
          height={this.props.logoSize}
          alt={productName}
          className="d-inline-block align-top logo"
        />
      )
      : null;

    return (
      <nav className={classnames("navbar navbar-expand-sm", light ? "navbar-light" : "navbar-dark")}>
        <Link className="navbar-brand" to={this.props.brandLink}>
          {logoElement}
          <span className="product-name">{productName}</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"/>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto align-top">
            {this.createLinks()}
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state: IProductState): INavbarStateProps {
  return {
    logoPath: state.product.logoPath,
    productName: state.product.productName,
  };
}

export const Navbar = connect(mapStateToProps)(NavbarImpl);
