import React from "react";
import classNames from "classnames";
import {Container} from "reactstrap";
import DashboardRoutes from "../route/DashboardRoutes";

import Topbar from "../navigation/Topbar";

const MainView = ({sidebarIsOpen, toggleSidebar}) => (
    <Container
        fluid
        className={classNames("content", {"is-open": sidebarIsOpen})}
    >
        <Topbar toggleSidebar={toggleSidebar}/>
        <DashboardRoutes/>
    </Container>
);

export default MainView;
