import React from "react";
import { MDBContainer, MDBRow } from "mdbreact";

import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from "../../config/SwalHelper";
import io from "socket.io-client";

class Kochat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      message: "",
      myID: "",
      author: localStorage.getItem("userid"),
      mySocket: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
  }

  //5fb68a07f0d0e501888bc079
  updateKochat() {
    KOBOARD.createGetAxiosRequest("kochat")
      .then((messages) => {
        this.setState({ messages: messages });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
        } else {
          SwalHelper.createNoConnectionSmallPopUp(
            "Connexion au serveur impossible"
          );
        }
      });
  }

  componentDidMount() {
    this.updateKochat();

    const socket = io("http://localhost:5000");

    this.setState({ mySocket: socket });

    socket.on("connect", () => {
      console.log(socket.id); // true
    });

    socket.on("message", (message) => {
      let messages = this.state.messages;
      messages.push(message);
      this.setState({ messages: messages });
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSendMessage = (event) => {
    event.preventDefault();

    if (!/^\s*$/.test(this.state.message)) {
      const data = {
        _dashboard: "5fbbd16a57e2c761e0ef574e",
        content: this.state.message,
        author: this.state.author,
        taggedUsers: "",
      };

      const dataNewMessage = {
        content: this.state.message,
        author: this.state.author,
      };

      let messages = this.state.messages;
      messages.push(dataNewMessage);

      this.state.mySocket.emit("message", dataNewMessage);

      //Clean the input text and change messages list
      this.setState({ message: "", messages: messages });

      KOBOARD.createPostAxiosRequest("kochat", data)
        .then((messages) => {
          console.log(messages);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
          } else {
            SwalHelper.createNoConnectionSmallPopUp(
              "Connexion au serveur impossible"
            );
          }
        });
    } else {
      this.setState({ message: "" });
    }
  };

  render() {
    return (
      <React.Fragment>
        <MDBContainer className="page-chat">
          {this.state.messages.map((message, key) => {
            if (message.author === this.state.author) {
              return (
                <MDBRow key={key} className="my-row">
                  <div className="my-message">{message.content}</div>
                </MDBRow>
              );
            } else {
              return (
                <MDBRow key={key} className="other-row">
                  <div className="other-message">{message.content}</div>
                </MDBRow>
              );
            }
          })}
        </MDBContainer>
        <MDBContainer className="mb-3 card-footer bg-container-send-message">
          <form onSubmit={this.handleSendMessage}>
            <div className="input-group">
              <textarea
                rows="1"
                name="message"
                onChange={this.handleChange}
                value={this.state.message}
                className="form-control type_msg"
                placeholder="Ecrivez votre message..."
              ></textarea>
              <div className="input-group-append">
                <button type="submit" className="input-group-text">
                  <i className="fas fa-location-arrow"></i>
                </button>
              </div>
            </div>
          </form>
        </MDBContainer>
      </React.Fragment>
    );
  }
}

export default Kochat;
