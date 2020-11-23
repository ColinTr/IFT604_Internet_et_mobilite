import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            redirectUrl: "",
        };
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

    render() {
        if (this.state.loggedIn === true) {
            return <div>You are already logged in</div>;
        } else {
            return (
                <div>
                    <a href={this.state.redirectUrl}>You must log in to continue</a>
                </div>
            );
        }
    }
}

export default Login;
