import React, {useState} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import "./App.css";
import Login from "./components/view/Login";
import Dashboard from "./components/view/Dashboard";
import AuthRoute from "./components/route/AuthRoute";
import CompleteAuthentication from "./components/view/CompleteAuthentication";

const App = () => {
    const [sidebarIsOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

    return (
        <div className="App wrapper">
            <Switch>
                <Route exact path="/login" component={Login}/>
                <AuthRoute path="/dashboard" component={Dashboard}/>
                <Route
                    exact
                    path="/completeAuthentication"
                    component={CompleteAuthentication}
                />
                <Route path="/" exact component={() => <Redirect to="/login"/>}/>
            </Switch>
        </div>
    );
};

export default App;
