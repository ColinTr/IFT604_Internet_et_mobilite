import { Route, Switch } from "react-router-dom";
import React from "react";
import { MDBAnimation } from "mdbreact";

//Import des composants de la vue
import Kochat from "../view/Kochat";
import Kotemps from "../view/Kotemps";
import Konote from "../view/Konote";
import Koulette from "../view/Koulette";
import Kourse from "../view/Kourse";
import Kognotte from "../view/Kognotte";

const Routes = () => {
  return (
    <MDBAnimation type="fadeIn">
      <Switch>
        <Route exact path="/" component={() => "Hello"} />
        <Route exact path="/kochat" component={Kochat} />
        <Route exact path="/konotes" component={Konote} />
        <Route exact path="/kourses" component={Kourse} />
        <Route exact path="/kotemps" component={Kotemps} />
        <Route exact path="/kognotte" component={Kognotte} />
        <Route exact path="/koulette" component={Koulette} />
      </Switch>
    </MDBAnimation>
  );
};

export default Routes;
