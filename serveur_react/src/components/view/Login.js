import React, { Component } from "react";
import axios from "axios";
import Logo from "../../assets/img/logo_koboard_crop.png";
import { MDBCol, MDBContainer, MDBRow, MDBBtn } from "mdbreact";
import { Route } from "react-router-dom";

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
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:5000/konotes")
        .then((response) => {
          if (response.data.redirectUrl !== undefined) {
            that.setState({
              loggedIn: false,
              redirectUrl: response.data.redirectUrl,
            });
          } else {
            that.setState({
              loggedIn: true,
            });
          }
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
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
              <img src={Logo} alt="logo koboard" width="150" />
            </MDBRow>
            <MDBRow className="justify-content-center">
              <MDBBtn outline color="info" onClick={this.redirectionOAuth}>
                Authentification via Oauth
              </MDBBtn>
            </MDBRow>
          </MDBCol>
        </MDBContainer>
      );
    }
  }
}

export default Login;
