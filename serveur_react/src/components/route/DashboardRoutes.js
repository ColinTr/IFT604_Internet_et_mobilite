import { Redirect, Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import { MDBAnimation } from "mdbreact";

//Import des composants de la vue
import Kochat from "../view/Kochat";
import Kotemps from "../view/Kotemps";
import Konote from "../view/Konote";
import Koulette from "../view/Koulette";
import Kourse from "../view/Kourse";
import Kognotte from "../view/Kognotte";
import Login from "../view/Login";
import CompleteAuthentication from "../view/CompleteAuthentication";
import AuthRoute from "./AuthRoute";

class DashboardRoutes extends Component {
  render() {
    console.log("DASHBOARD ROUTE");
    return (
      <MDBAnimation type="fadeIn">
        <Route
          path="/dashboard"
          exact
          component={() => <Redirect to="/dashboard/home" />}
        />
        <AuthRoute exact path="/dashboard/home" component={() => "Hello"} />
        <AuthRoute exact path="/dashboard/kochat" component={Kochat} />
        <AuthRoute exact path="/dashboard/konotes" component={Konote} />
        <AuthRoute exact path="/dashboard/kourses" component={Kourse} />
        <AuthRoute exact path="/dashboard/kotemps" component={Kotemps} />
        <AuthRoute exact path="/dashboard/kognotte" component={Kognotte} />
        <AuthRoute exact path="/dashboard/koulette" component={Koulette} />
      </MDBAnimation>
    );
  }
}

export default DashboardRoutes;
