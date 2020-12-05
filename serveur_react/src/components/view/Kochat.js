import React from "react";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";

import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from "../../config/SwalHelper";
import io from "socket.io-client";
import dateFormat from "dateformat";

const KOBOARD_API_URI = process.env.REACT_APP_KOBOARD_API_URI;
const MONGODB_DASHBOARD_ID = process.env.REACT_APP_DASHBOARD_ID;

class Kochat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message: "",
            myID: "",
            author: localStorage.getItem("userid"),
            mySocket: "",
            users: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
    }

    updateKochat() {
        KOBOARD.createGetAxiosRequest("kochat")
            .then((messages) => {
                this.setState({messages: messages});
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

    getUsers() {
        KOBOARD.createGetAxiosRequest("users")
            .then((users) => {
                this.setState({users: users});
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

    componentWillUnmount() {
        this.state.mySocket.disconnect();
    }

    componentDidMount() {
        this.updateKochat();
        this.getUsers();

        const socket = io(KOBOARD_API_URI, {transports: ['websocket']});

        this.setState({mySocket: socket});

        socket.on("message", (message) => {
            let messages = this.state.messages;
            messages.push(message);
            this.setState({messages: messages});
            this.scrollToTheTop();
        });
    }

    /**
     * Press the ENTER Key for send a message
     * @param e
     */
    onEnterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.handleSendMessage(e);
        }
    };

    /**
     * When the
     */
    scrollToTheTop = () => {
        setTimeout(() => {
            const objDiv = document.getElementById("page-chat");
            objDiv.scrollTop = objDiv.scrollHeight;
        }, 1);
    };

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
        });
    };

    handleSendMessage = (event) => {
        event.preventDefault();

        if (!/^\s*$/.test(this.state.message)) {
            const data = {
                _dashboard: MONGODB_DASHBOARD_ID,
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
            this.setState({message: "", messages: messages});

            //Scroll after add data in the container
            this.scrollToTheTop();

            KOBOARD.createPostAxiosRequest("kochat", data)
                .then((messages) => {
                    console.log(messages);
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
                    } else {
                        console.log("pas de co");
                        SwalHelper.createNoConnectionSmallPopUp(
                            "Connexion au serveur impossible"
                        );
                    }
                });
        } else {
            this.setState({message: ""});
        }
    };

    render() {
        return (
            <MDBContainer>
                <MDBContainer id="page-chat" className="page-chat">
                    {this.state.messages.map((message, key) => {
                        if (message.author === this.state.author) {
                            return (
                                <MDBCol key={key}>
                                    <MDBRow className="my-row">
                                        <div className="my-message">{message.content}</div>
                                    </MDBRow>
                                    <MDBRow className="my-time">
                                        {dateFormat(message.date, "ddd, H:MM")}
                                    </MDBRow>
                                </MDBCol>
                            );
                        } else {
                            return (
                                <MDBCol key={key}>
                                    <MDBRow className="other-row">
                                        <div className="other-message">
                                            {this.state.users.map((user, index) => {
                                                if (user._id === message.author) {
                                                    return (<div key={index} id="tips" className="other-avatar"
                                                                 data-title={user.username}>{user.username.substring(0, 3).toUpperCase()}</div>);
                                                } else {
                                                    return null;
                                                }
                                            })}
                                            {message.content}
                                        </div>
                                    </MDBRow>
                                    <MDBRow className="other-time">
                                        {dateFormat(message.date, "ddd, H:MM")}
                                    </MDBRow>
                                </MDBCol>
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
                                  onKeyDown={this.onEnterPress}
                                  onChange={this.handleChange}
                                  value={this.state.message}
                                  className="form-control type_msg"
                                  placeholder="Ecrivez votre message..."
                              />
                            <div className="input-group-append">
                                <button type="submit" className="input-group-text">
                                    <i className="fas fa-location-arrow"/>
                                </button>
                            </div>
                        </div>
                    </form>
                </MDBContainer>
                <button type="button" className="btn btn-secondary tooltip" data-tooltip="salut"
                >
                    Tooltip on top
                </button>
            </MDBContainer>
        );
    }
}

export default Kochat;
