import React, {Component} from "react";
import queryString from 'query-string';

class CompleteAuthentication extends Component {

    componentDidMount() {
        const tokens = JSON.parse(queryString.parse(this.props.location.search).tokens);
        const email = queryString.parse(this.props.location.search).email;
        const userid = queryString.parse(this.props.location.search).userid;
        localStorage.setItem("access_token", tokens.access_token);
        localStorage.setItem("refresh_token", tokens.refresh_token);
        localStorage.setItem("email", email);
        localStorage.setItem("userid", userid);

        this.props.history.push('/dashboard')
    }

    render() {
        return (
            <div>{localStorage.getItem("email")}</div>
        )
    }
}

export default CompleteAuthentication;