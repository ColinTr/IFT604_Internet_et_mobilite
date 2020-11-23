import React from "react";
import classNames from "classnames";
import { Container } from "reactstrap";
import { Switch, Route } from "react-router-dom";

import Topbar from "./Topbar";

const Content = ({ sidebarIsOpen, toggleSidebar }) => (
  <Container
    fluid
    className={classNames("content", { "is-open": sidebarIsOpen })}
  >
    <Topbar toggleSidebar={toggleSidebar} />
    <Switch>
      <Route exact path="/" component={() => "Hello"} />
      <Route exact path="/kochat" component={() => "kochat"} />
      <Route exact path="/kotes" component={() => "kotes"} />
      <Route exact path="/kourses" component={() => "kourses"} />
      <Route exact path="/kotemps" component={() => "kotemps"} />
      <Route exact path="/kognotte" component={() => "kognotte"} />
      <Route exact path="/koulette" component={() => "koulette"} />
    </Switch>
  </Container>
);

export default Content;
