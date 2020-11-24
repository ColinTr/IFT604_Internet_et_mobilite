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
            newNoteText: '',
            modal: false,
            users: []
        };

        this.createKonote = this.createKonote.bind(this);
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
            type: 'warning',
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
                        console.log(err)
                    })
            }
        })
    };

    editKonote(idKonote) {
        console.log('bong')
    }

    createKonote() {
        let that = this;
        KOBOARD.createPostAxiosRequest("konotes",
            {
                _dashboard: "5fbbd16a57e2c761e0ef574e",
                title: document.getElementById("newNoteTitle").value,
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
                console.log(err)
            })
    }

    componentDidMount() {
        this.updateKonotes();
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    handleChange = (event, newValue, newPlainTextValue, mentions) => {
        this.setState({
            value: newValue,
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
                <button className="btn btn-info"
                        style={{borderRadius: "100px", padding: "12px", margin: 10, height: "50px", width: "50px"}}
                        onClick={that.toggle}>
                    <i className="fas fa-lg fa-plus"/>
                </button>
                <MDBModal isOpen={that.state.modal} toggle={that.toggle}>
                    <MDBModalHeader toggle={that.toggle}>Ajouter une nouvelle note</MDBModalHeader>
                    <MDBModalBody>
                        <input
                            type="text"
                            className="form-control"
                            id="newNoteTitle"
                            placeholder="Titre de la note"
                        />
                        <MentionsInput
                            value={this.state.value}
                            onChange={that.handleChange}
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
                            />
                        </MentionsInput>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={that.toggle}>Annuler</MDBBtn>
                        <MDBBtn color="primary" onClick={that.createKonote}>Ajouter</MDBBtn>
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
                                                onClick={() => that.editKonote(noteData._id)}>
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