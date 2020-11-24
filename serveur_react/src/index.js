import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import {BrowserRouter as Router} from "react-router-dom";
// Import utile pour MDBReact
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

ReactDOM.render(
    <Router>
        <App/>
    </Router>,
    document.getElementById("root")
);

registerServiceWorker();