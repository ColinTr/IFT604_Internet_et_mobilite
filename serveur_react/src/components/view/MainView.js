import React from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import Routes from "../route/Routes";

import Topbar from "../navigation/Topbar";

const MainView = ({ sidebarIsOpen, toggleSidebar }) => (
  <Container
    fluid
    className={classNames("content", { "is-open": sidebarIsOpen })}
  >
    <Topbar toggleSidebar={toggleSidebar} />
    <Routes />
  </Container>
);

export default MainView;
