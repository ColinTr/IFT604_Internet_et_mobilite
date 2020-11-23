import React, { useState } from "react";

import SideBar from "./components/navigation/SideBar";
import MainView from "./components/view/MainView";
import "./App.css";

const App = () => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  return (
    <div className="App wrapper">
      <SideBar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
      <MainView toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
    </div>
  );
};

export default App;
