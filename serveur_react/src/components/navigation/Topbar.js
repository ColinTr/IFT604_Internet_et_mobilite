import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";

import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavbarToggler,
  MDBCollapse,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
} from "mdbreact";

function disconnect() {
  localStorage.clear();
}

const Topbar = ({ toggleSidebar }) => {
  const [topbarIsOpen, setTopbarOpen] = useState(true);
  const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);

  return (
    <MDBNavbar
      color="light"
      light
      className="navbar shadow-sm p-3 mb-5 bg-white rounded"
      expand="md"
    >
      <MDBBtn className="rounded" color="info" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faAlignLeft} />
      </MDBBtn>
      <MDBNavbarToggler onClick={toggleTopbar} />
      <MDBCollapse isOpen={topbarIsOpen} navbar>
        <MDBNavbarNav right className="ml-auto">
          <MDBNavItem>
            <MDBDropdown className="dropdown-menu-right">
              <MDBDropdownToggle nav caret>
                <MDBIcon icon="user" />
              </MDBDropdownToggle>
              <MDBDropdownMenu right>
                <MDBDropdownItem href="#">Mon profil</MDBDropdownItem>
                <MDBDropdownItem href="/login" onClick={disconnect}>
                  Se déconnecter
                </MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBNavItem>
        </MDBNavbarNav>
      </MDBCollapse>
    </MDBNavbar>
  );
};

export default Topbar;
