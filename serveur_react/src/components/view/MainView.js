import React from "react";
import classNames from "classnames";
import {Container} from "reactstrap";
import DashboardRoutes from "../route/DashboardRoutes";

import Topbar from "../navigation/Topbar";

const MainView = ({sidebarIsOpen, toggleSidebar}) => (
    <div className="MainView" style={{"overflowY": "auto"}}>
        <Container
            fluid
            className={classNames("content", {"is-open": sidebarIsOpen})}
        >
            <Topbar toggleSidebar={toggleSidebar}/>
            <DashboardRoutes/>
        </Container>
    </div>
);

export default MainView;
