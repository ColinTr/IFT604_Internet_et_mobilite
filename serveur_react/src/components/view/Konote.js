import React from "react";
import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from "../../config/SwalHelper";
import {Card, CardBody, CardText, CardTitle} from "reactstrap";
import {MDBBtn, MDBCol, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBRow} from "mdbreact";
import {Mention, MentionsInput} from 'react-mentions'
import * as Swal from "sweetalert2";

class Konote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listeNotesData: [],
            modal: false,
            users: [],
            newNoteTitle: "",
            newNoteText: "",
            idNoteToEdit: null,
        };

        this.createOrUpdateKonote = this.createOrUpdateKonote.bind(this);
    }

    updateKonotes() {
        let that = this;
        KOBOARD.createGetAxiosRequest("konotes")
            .then(dataNotes => {
                KOBOARD.createGetAxiosRequest("users")
                    .then(dataUsers => {
                        that.setState({listeNotesData: dataNotes, users: dataUsers});
                    });
            })
            .catch(err => {
                if (err.response !== undefined && err.response.status === 401) {
                    SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
                } else {
                    SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
                }
            });
    }

    deleteKonote(idKonote) {
        let that = this;
        Swal.fire({
            title: 'Êtes vous certain ?',
            text: "Impossible de récuperer la note une fois supprimée!",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.value) {
                KOBOARD.createDeleteAxiosRequest("konotes", idKonote)
                    .then(() => {
                        SwalHelper.createSmallSuccessPopUp("Note supprimée avec succès !");
                        that.updateKonotes();
                    })
                    .catch((err) => {
                        if (err.response !== undefined && err.response.status === 401) {
                            SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
                        } else {
                            SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
                        }
                    });
            }
        });
    };

    displayUpdateNoteModal(id, title, content) {
        let that = this;
        that.toggle();
        that.setState({
            newNoteText: this.swapTags(content),
            newNoteTitle: title,
            idNoteToEdit: id
        });
    }

    swapTags(text) {
        return text.replace(new RegExp("@[a-zA-Z0-9.]*", "gm"), function (match, token) {
            return "@[" + match.substring(1, match.length) + "](__1234__)";
        });
    }

    createOrUpdateKonote() {
        let that = this;

        if (this.state.idNoteToEdit !== null) {
            KOBOARD.createPutAxiosRequest("konotes", this.state.idNoteToEdit,
                {"note": {
                    _dashboard: "5fbbd16a57e2c761e0ef574e",
                    title: that.state.newNoteTitle,
                    content: document.getElementById("newNoteText").value,
                    author: localStorage.getItem("userid"),
                    users: []
                }})
                .then(() => {
                    SwalHelper.createSmallSuccessPopUp("Note modifiée avec succès !");
                    that.toggle();
                    that.updateKonotes();
                })
                .catch((err) => {
                    if (err.response !== undefined && err.response.status === 401) {
                        SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
                    } else {
                        SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
                    }
                });
        } else {
            KOBOARD.createPostAxiosRequest("konotes",
                {
                    _dashboard: "5fbbd16a57e2c761e0ef574e",
                    title: that.state.newNoteTitle,
                    content: document.getElementById("newNoteText").value,
                    author: localStorage.getItem("userid"),
                    users: []
                })
                .then(() => {
                    SwalHelper.createSmallSuccessPopUp("Note ajoutée avec succès !");
                    that.toggle();
                    that.updateKonotes();
                })
                .catch((err) => {
                    if (err.response !== undefined && err.response.status === 401) {
                        SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
                    } else {
                        SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
                    }
                });
        }
    }

    componentDidMount() {
        this.updateKonotes();
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            idNoteToEdit: null,
            newNoteText: "",
            newNoteTitle: ""
        });
    };

    handleChangeNewNote = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
        });
    };

    handleChange = (event, newValue, newPlainTextValue, mentions) => {
        this.setState({
            newNoteText: newValue,
            mentionData: {newValue, newPlainTextValue, mentions}
        })
    };

    render() {
        let that = this;

        const userMentionData = this.state.users.map(myUser => ({
            id: myUser._id,
            display: `${myUser.username}`
        }));

        return (
            <MDBContainer fluid>
                <button
                    className="btn btn-info"
                    style={{
                        borderRadius: "100px",
                        padding: "12px",
                        margin: 10,
                        height: "50px",
                        width: "50px",
                    }}
                    onClick={that.toggle}
                >
                    <i className="fas fa-lg fa-plus"/>
                </button>
                <MDBModal isOpen={that.state.modal} toggle={that.toggle}>
                    <MDBModalHeader toggle={that.toggle}>
                        Ajouter une nouvelle note
                    </MDBModalHeader>
                    <MDBModalBody>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.newNoteTitle}
                            onChange={this.handleChangeNewNote}
                            name="newNoteTitle"
                            placeholder="Titre de la note"
                        />
                        <MentionsInput
                            value={this.state.newNoteText}
                            onChange={this.handleChange}
                            name="newNoteText"
                            markup="@{{__type__||__id__||__display__}}"
                            placeholder="Écrire ici, utilisez le symbole @ pour tagger des membres"
                            className="mentions"
                            id="newNoteText"
                        >
                            <Mention
                                type="user"
                                trigger="@"
                                data={userMentionData}
                                className="mentions__mention"
                                displayTransform={(id, display) => {
                                    return "@" + display
                                }}
                            />
                        </MentionsInput>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={that.toggle}>
                            Annuler
                        </MDBBtn>
                        <MDBBtn color="primary" onClick={that.createOrUpdateKonote}>
                            Ajouter
                        </MDBBtn>
                    </MDBModalFooter>
                </MDBModal>

                <MDBContainer className="container-fluid">
                    <MDBRow>
                        {this.state.listeNotesData.map(function (noteData, index) {
                            return (
                                <MDBCol
                                    key={noteData._id}
                                    className="mb-3 col-12 col-md-6 col-lg-4 col-xl-3"
                                >
                                    <Card>
                                        <button className="noteCross" onClick={() => that.deleteKonote(noteData._id)}>
                                            <i className="fa fa-times" aria-hidden="true"/>
                                        </button>
                                        <button className="noteCross" aria-hidden="true" style={{marginRight: "25px"}}
                                                onClick={() => that.displayUpdateNoteModal(noteData._id, noteData.title, noteData.content)}>
                                            <i className="far fa-edit"/>
                                        </button>
                                        <CardBody>
                                            <CardTitle tag="h5">{noteData.title}</CardTitle>
                                            <CardText>
                                                {noteData.content}
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </MDBCol>
                            );
                        })}
                    </MDBRow>
                </MDBContainer>
            </MDBContainer>
        );
    }
}

export default Konote;