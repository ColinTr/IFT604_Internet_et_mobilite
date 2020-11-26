import React, {useState} from "react";
import SideBar from "../navigation/SideBar";
import MainView from "./MainView";

const Dashboard = () => {
    const [sidebarIsOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

    return (
        <React.Fragment>
            <div className="Dashboard h-auto">
                <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen}/>
                <MainView toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} className="testing"/>
            </div>
        </React.Fragment>
    );
};

export default Dashboard;
