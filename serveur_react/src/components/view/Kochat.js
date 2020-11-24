import React from "react";
import { MDBCol, MDBContainer, MDBInput, MDBRow } from "mdbreact";
import TextareaPage from "./kochat/TextareaPage";

class Kochat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      message: "",
      myID: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <React.Fragment>
        <MDBContainer
          className="container-fluid"
          style={{ backgroundColor: "red" }}
        >
          <MDBRow className="justify-content-center">salut</MDBRow>
        </MDBContainer>
        <form onSubmit={this.handleSubmit} className="flex">
          <MDBContainer className="container-fluid">
            <MDBRow
              style={{ backgroundColor: "green" }}
              className="justify-content-center"
            >
              <MDBCol className="">
                <TextareaPage />
              </MDBCol>
              <MDBCol>
                <button>Envoyer</button>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </form>
      </React.Fragment>
    );
  }
}

export default Kochat;
