import React, {Component} from "react";

import Logo from "../../assets/img/logo_koboard_crop.png";
import {MDBBtn, MDBCol, MDBContainer, MDBRow} from "mdbreact";
import SwalHelper from "../../config/SwalHelper";
import AxiosHelper from "../../config/AxiosHelper";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			redirectUrl: "",
		};
		this.redirectionOAuth = this.redirectionOAuth.bind(this);
		this.redirectionDashboard = this.redirectionDashboard.bind(this);
		this.disconnect = this.disconnect.bind(this);
	}

	checkAuthentification() {
		let that = this;
		// We try to access a random route to see if we are allowed to
		AxiosHelper.createGetAxiosRequest("konotes")
			.then((response) => {
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
		if (localStorage.getItem("access_token") !== null) {
			this.setState({loggedIn: true});
		}

		this.checkAuthentification();
	}

	disconnect(){
		localStorage.clear()
		this.setState({loggedIn: false});
	}

	redirectionDashboard() {
		this.props.history.push('/dashboard');
	}

	redirectionOAuth() {
		window.location.href = this.state.redirectUrl;
	}

	render() {
		if (this.state.loggedIn === true) {
			return (
				<MDBContainer className="container-fluid mt-5">
					<MDBCol>
						<MDBRow className="justify-content-center">
							<img src={Logo} alt="logo koboard" width="150"/>
						</MDBRow>
						<MDBRow className="justify-content-center">
							<span className="text-info" style={{fontWeight:500}}>Vous êtes déjà connecté !</span>
						</MDBRow>
						<MDBRow className="justify-content-center">
							<MDBBtn outline color="info" className="btn-login-page" onClick={this.redirectionDashboard}>
								Aller au Dashboard
							</MDBBtn>
							<MDBBtn outline color="info" className="btn-login-page" onClick={this.disconnect}>
								Se déconnecter
							</MDBBtn>
						</MDBRow>
					</MDBCol>
				</MDBContainer>
			)
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