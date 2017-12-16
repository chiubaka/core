import * as classnames from "classnames";
import * as React from "react";
import { Link, NavLink } from "react-router-dom";

export interface INavbarProps {
  brandLink?: string;
  links: INavbarEntry[];
  logo?: string;
  logoSize?: number;
  productName: string;
}

export interface INavbarEntry {
  text: string;
  path: string;
  current?: boolean;
}

export class Navbar extends React.Component<INavbarProps> {
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
    const { logo, productName } = this.props;

    const logoElement = logo ?
      (
        <img
          src={logo}
          width={this.props.logoSize}
          height={this.props.logoSize}
          alt={productName}
          className="d-inline-block align-top logo"
        />
      )
      : null;

    return (
      <nav className="navbar navbar-expand-sm navbar-light">
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
