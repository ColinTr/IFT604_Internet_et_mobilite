import React, {Component} from "react";
import axios from "axios";
import Logo from "../../assets/img/logo_koboard_crop.png";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import SwalHelper from "../../config/SwalHelper";

const KOBOARD_API_URI = process.env.REACT_APP_KOBOARD_API_URI;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            redirectUrl: "",
        };
        this.redirectionOAuth = this.redirectionOAuth.bind(this);
    }

    checkAuthentification() {
        let that = this;
        // We try to access a random route to see if we are allowed to
        axios.get(KOBOARD_API_URI + "/konotes").then((response) => {
                that.setState({
                    loggedIn: true,
                });
            })
            .catch((err) => {
                // If we receive an error 401, it means the user isn't correctly authenticated
                if (err.response !== undefined && err.response.status === 401) {
                    that.setState({
                        loggedIn: false,
                        redirectUrl: err.response.data.redirectUrl,
                    });
                } else {
                    console.log(err);
                    SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
                }
            });
    }

    componentDidMount() {
        this.checkAuthentification();
    }

    redirectionOAuth() {
        window.location.href = this.state.redirectUrl;
    }

    render() {
        if (this.state.loggedIn === true) {
            return <div>You are already logged in</div>;
        } else {
            return (
                <MDBContainer className="container-fluid mt-5">
                    <MDBCol>
                        <MDBRow className="justify-content-center">
                            <img src={Logo} alt="logo koboard" width="150"/>
                        </MDBRow>
                        <MDBRow className="justify-content-center">
                            <MDBBtn outline color="info" onClick={this.redirectionOAuth}>
                                Se connecter avec Google
                            </MDBBtn>
                        </MDBRow>
                    </MDBCol>
                </MDBContainer>
            );
        }
    }
}

export default Login;