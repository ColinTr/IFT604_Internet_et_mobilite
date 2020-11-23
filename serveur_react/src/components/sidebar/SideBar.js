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
import { NavItem, NavLink, Nav } from "reactstrap";
import classNames from "classnames";
import { NavLink as RRNavLink } from "react-router-dom";

const SideBar = ({ isOpen, toggle }) => {
  return (
    <div className={classNames("sidebar", { "is-open": isOpen })}>
      <div className="sidebar-header">
        <span color="info" onClick={toggle} style={{ color: "#fff" }}>
          &times;
        </span>
        <h3>KoBoard</h3>
      </div>
      <div className="side-menu">
        <Nav vertical className="list-unstyled pb-3">
          <NavItem>
            <NavLink tag={RRNavLink} to={"/"} activeClassName="activeLink">
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={RRNavLink} to={"/kotes"} activeClassName="activeLink">
              <FontAwesomeIcon icon={faStickyNote} className="mr-2" />
              Kotes
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={RRNavLink}
              to={"/kourses"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              Kourse
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={RRNavLink}
              to={"/kotemps"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faCalendar} className="mr-2" />
              Kotemps
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={RRNavLink}
              to={"/kochat"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faComment} className="mr-2" />
              Kochat
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={RRNavLink}
              to={"/kognotte"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
              Kognotte
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              tag={RRNavLink}
              to={"/koulette"}
              activeClassName="activeLink"
            >
              <FontAwesomeIcon icon={faLifeRing} className="mr-2" />
              Koulette
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    </div>
  );
};

export default SideBar;
