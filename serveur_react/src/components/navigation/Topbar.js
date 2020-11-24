import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";

import {
    MDBBtn,
    MDBCollapse,
    MDBContainer,
    MDBDropdown,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBDropdownToggle,
    MDBIcon,
    MDBNavbar,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBNavItem,
} from "mdbreact";

function disconnect() {
    localStorage.clear();
}

const Topbar = ({toggleSidebar}) => {
    const [topbarIsOpen, setTopbarOpen] = useState(true);
    const toggleTopbar = () => setTopbarOpen(!topbarIsOpen);

    return (
        <MDBNavbar
            color="light"
            light
            className="navbar shadow-sm p-3 mb-5 bg-white rounded"
            expand="md"
        >
            <MDBNavbarNav left>
                <MDBBtn className="rounded" color="info" onClick={toggleSidebar}>
                    {topbarIsOpen ? (
                        <FontAwesomeIcon icon={faArrowLeft} size="lg"/>
                    ) : (
                        <FontAwesomeIcon icon={faArrowRight} size="lg"/>
                    )}
                </MDBBtn>
            </MDBNavbarNav>
            <MDBNavbarNav right>
                <MDBContainer>
                    {localStorage.getItem("email").split("@")[0].replace('"', "") + " "}
                    <MDBNavbarToggler onClick={toggleTopbar}/>
                    <MDBCollapse isOpen={topbarIsOpen} navbar>
                        <MDBNavItem>
                            <MDBDropdown className="dropdown-menu-right">
                                <MDBDropdownToggle nav caret>
                                    <MDBIcon icon="user"/>
                                </MDBDropdownToggle>
                                <MDBDropdownMenu right>
                                    <MDBDropdownItem href="#">Mon profil</MDBDropdownItem>
                                    <MDBDropdownItem href="/login" onClick={disconnect}>
                                        Se déconnecter
                                    </MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavItem>
                    </MDBCollapse></MDBContainer>
            </MDBNavbarNav>
        </MDBNavbar>
    );
};

export default Topbar;
