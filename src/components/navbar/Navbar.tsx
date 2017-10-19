import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import * as classnames from "classnames";

export interface NavbarProps {
  logo?: string;
  productName: string;
  links: NavbarEntry[];
}

export interface NavbarEntry {
  text: string;
  path: string;
  current?: boolean;
}

export class Navbar extends React.Component<NavbarProps> {
  public createLinks(): JSX.Element[] {
    return this.props.links.map((link, index) => {
      return (
        <li key={index} className={classnames("nav-item", link.current ? "active" : "")}>
          <NavLink className="nav-link" to={link.path}>{link.text}{link.current ? <span className="sr-only">(current)</span> : ""}</NavLink>
        </li>
      );
    });
  }

  public render(): JSX.Element {
    const { logo, productName } = this.props;

    return (
      <div className="container pt-3">
        <nav className="navbar navbar-expand-sm navbar-light">
          <Link className="navbar-brand" to="/">
            {logo ? <img src={logo} width="30" height="30" alt={productName} className="d-inline-block align-top"/> : ""}
            {productName}
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto align-top">
              {this.createLinks()}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}