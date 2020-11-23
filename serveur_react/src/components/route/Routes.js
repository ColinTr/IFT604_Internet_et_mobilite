import {Redirect, Route, Switch} from "react-router-dom";
import React, {Component} from "react";
import {MDBAnimation} from "mdbreact";

//Import des composants de la vue
import Kochat from "../view/Kochat";
import Kotemps from "../view/Kotemps";
import Konote from "../view/Konote";
import Koulette from "../view/Koulette";
import Kourse from "../view/Kourse";
import Kognotte from "../view/Kognotte";
import Login from "../view/Login";
import CompleteAuthentication from "../view/CompleteAuthentication";

class Routes extends Component {
    checkAuthentification() {
        return localStorage.getItem('token') !== null;
    }

    render() {
        return (
            <MDBAnimation type="fadeIn">
                <Switch>
                    <Route exact path="/" component={() => "Hello"}/>
                    <Route exact path="/kochat" component={Kochat}/>
                    <Route exact path="/konotes" render={() => (
                        this.checkAuthentification() ? (
                            <Konote />
                        ) : (
                            <Redirect to="/login"/>
                        )
                    )}/>
                    <Route exact path="/kourses" component={Kourse}/>
                    <Route exact path="/kotemps" component={Kotemps}/>
                    <Route exact path="/kognotte" component={Kognotte}/>
                    <Route exact path="/koulette" component={Koulette}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/completeAuthentication" component={CompleteAuthentication}/>
                </Switch>
            </MDBAnimation>
        );
    }
}

export default Routes;
