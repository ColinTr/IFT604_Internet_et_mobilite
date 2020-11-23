import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faStickyNote,
  faShoppingCart,
  faCalendar,
  faComment,
  faDollarSign,
  faLifeRing,
} from "@fortawesome/free-solid-svg-icons";

import { MDBNavItem, MDBNavLink, MDBNavbarNav, MDBNavbarBrand } from "mdbreact";
import classNames from "classnames";
import { NavLink as RRNavLink } from "react-router-dom";

const SideBar = ({ isOpen, toggle }) => {
  return (
    <div className={classNames("sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header p-2">
        <h3>LOGO KoBoard</h3>
        <span color="info" onClick={toggle} style={{ color: "#fff" }}>
          &times;
        </span>
      </div>
      <div className="side-menu">
        <MDBNavbarNav className="list-unstyled pb-3">
          <MDBNavItem className="ml-2">
            <MDBNavLink
              className="pl-2 rounded"
              tag={RRNavLink}
              to={"/dashboard/home"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem className="ml-2">
            <MDBNavLink
              className="pl-2 rounded"
              tag={RRNavLink}
              to={"/dashboard/konotes"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faStickyNote} className="mr-2" />
              Konotes
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem className="ml-2">
            <MDBNavLink
              className="pl-2 rounded"
              tag={RRNavLink}
              to={"/dashboard/kourses"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              Kourse
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem className="ml-2">
            <MDBNavLink
              className="pl-2 rounded"
              tag={RRNavLink}
              to={"/dashboard/kotemps"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faCalendar} className="mr-2" />
              Kotemps
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem className="ml-2">
            <MDBNavLink
              className="pl-2 rounded"
              tag={RRNavLink}
              to={"/dashboard/kochat"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faComment} className="mr-2" />
              Kochat
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem className="ml-2">
            <MDBNavLink
              className="pl-2 rounded"
              tag={RRNavLink}
              to={"/dashboard/kognotte"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
              Kognotte
            </MDBNavLink>
          </MDBNavItem>
          <MDBNavItem className="ml-2">
            <MDBNavLink
              className="pl-2 rounded"
              tag={RRNavLink}
              to={"/dashboard/koulette"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
              Koulette
            </MDBNavLink>
          </MDBNavItem>
        </MDBNavbarNav>
      </div>
    </div>
  );
};

export default SideBar;
