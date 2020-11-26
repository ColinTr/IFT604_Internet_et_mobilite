import React from "react";
import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from "../../config/SwalHelper";
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCol,
    MDBContainer,
    MDBListGroup,
    MDBListGroupItem,
    MDBRow
} from "mdbreact";
import {Input} from "reactstrap";
import * as Swal from "sweetalert2";

class Kourse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listListKoursesData: []
        };

        this.createListKourses = this.createListKourses.bind(this);
        this.deleteListKourses = this.deleteListKourses.bind(this);
    }

    intervalID = 0;

    updateKourses() {
        let that = this;
        KOBOARD.createGetAxiosRequest("kourses")
            .then(dataNotes => {
                that.setState({listListKoursesData: dataNotes});
            })
            .catch(err => {
                if (err.response !== undefined && err.response.status === 401) {
                    SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
                } else {
                    SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
                }
            });
    }

    componentDidMount() {
        this.updateKourses();

        this.updateKourses = this.updateKourses.bind(this);

        this.intervalID = setInterval(() => {
            this.updateKourses();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }

    deleteListKourses(idListeKourses) {
        let that = this;
        Swal.fire({
            title: 'Êtes vous certain ?',
            text: "Impossible de récuperer la liste une fois supprimée!",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.value) {
                KOBOARD.createDeleteAxiosRequest("kourses", idListeKourses)
                    .then(() => {
                        SwalHelper.createSmallSuccessPopUp("Liste supprimée avec succès!");
                        that.updateKourses();
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
    }

    deleteElementOfListKourses(idListeKourses, kourseId) {
        let that = this;
        Swal.fire({
            title: 'Êtes vous certain ?',
            text: "Impossible de récuperer l'élément une fois supprimé!",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Supprimer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                that.state.listListKoursesData.forEach((listeKourses, index1) => {
                    if (listeKourses._id === idListeKourses) {
                        let newList = [];
                        listeKourses.elements.forEach((element, index2) => {
                            if (element._id !== kourseId) {
                                newList.push(element);
                            }
                        });
                        KOBOARD.createPutAxiosRequest("kourses", idListeKourses,
                            {
                                elements: newList
                            })
                            .then(() => {
                                SwalHelper.createSmallSuccessPopUp("Liste modifiée avec succès!");
                                that.updateKourses();
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
            }
        });
    }

    editElementOfListKourses(idListeKourses, kourseId, previousValue) {
        let that = this;
        Swal.fire({
            title: 'Modifier un élément de la liste de kourses',
            input: 'text',
            inputPlaceholder: 'Contenu de l\'élément',
            showCancelButton: true,
            confirmButtonText: 'Modifier',
            cancelButtonText: 'Annuler',
            inputValue: previousValue
        }).then((result) => {
            if (result.isConfirmed) {
                that.state.listListKoursesData.forEach((listeKourses, index1) => {
                    if (listeKourses._id === idListeKourses) {
                        listeKourses.elements.forEach((element, index2) => {
                            if (element._id === kourseId) {
                                element.content = result.value === "" ? "∅" : result.value;
                                KOBOARD.createPutAxiosRequest("kourses", idListeKourses,
                                    {
                                        elements: listeKourses.elements
                                    })
                                    .then(() => {
                                        SwalHelper.createSmallSuccessPopUp("Liste modifiée avec succès!");
                                        that.updateKourses();
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
                    }
                });
            }
        });
    }

    editListKourses(idListeKourses, previousValue) {
        let that = this;
        Swal.fire({
            title: 'Modifier le titre de liste de kourses',
            input: 'text',
            inputPlaceholder: 'Titre de la liste',
            showCancelButton: true,
            confirmButtonText: 'Modifier',
            cancelButtonText: 'Annuler',
            inputValue: previousValue
        }).then((result) => {
            if (result.isConfirmed) {
                KOBOARD.createPutAxiosRequest("kourses", idListeKourses,
                    {
                        title: result.value === "" ? "∅" : result.value
                    })
                    .then(() => {
                        SwalHelper.createSmallSuccessPopUp("Liste modifiée avec succès!");
                        that.updateKourses();
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
    }

    createListKourses() {
        let that = this;
        Swal.fire({
            title: 'Créer une nouvelle liste de kourses',
            input: 'text',
            inputPlaceholder: 'Titre de la liste',
            showCancelButton: true,
            confirmButtonText: 'Ajouter',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                KOBOARD.createPostAxiosRequest("kourses",
                    {
                        _dashboard: "5fbbd16a57e2c761e0ef574e",
                        title: result.value === "" ? "∅" : result.value,
                        elements: []
                    })
                    .then(() => {
                        SwalHelper.createSmallSuccessPopUp("Liste ajoutée avec succès!");
                        that.updateKourses();
                    })
                    .catch((err) => {
                        if (err.response !== undefined && err.response.status === 401) {
                            SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
                        } else {
                            SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
                        }
                    });
            }
        })
    }

    createElementInListKourses(listeKoursesId) {
        let that = this;
        Swal.fire({
            title: 'Ajouter un élément',
            input: 'text',
            inputPlaceholder: 'Élément',
            showCancelButton: true,
            confirmButtonText: 'Ajouter',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                this.state.listListKoursesData.forEach((listeKourses, index) => {
                    if (listeKourses._id === listeKoursesId) {
                        let newElements = listeKourses.elements;
                        newElements.push({content: result.value === "" ? "∅" : result.value, bought: false});
                        KOBOARD.createPutAxiosRequest("kourses", listeKoursesId,
                            {
                                _id: listeKoursesId,
                                _dashboard: "5fbbd16a57e2c761e0ef574e",
                                title: listeKourses.title,
                                elements: newElements
                            })
                            .then(() => {
                                SwalHelper.createSmallSuccessPopUp("Élement modifié avec succès!");
                                that.updateKourses();
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
            }
        })
    }

    toggleCheckbox(listeKoursesId, koursesId, wasBought) {
        let that = this;
        this.state.listListKoursesData.forEach((listeKourses, index) => {
            if (listeKourses._id === listeKoursesId) {
                listeKourses.elements.forEach((koursesElement, index2) => {
                    if (koursesElement._id === koursesId) {
                        listeKourses.elements[index2].bought = !wasBought;
                        KOBOARD.createPutAxiosRequest("kourses", listeKourses._id,
                            {
                                _id: listeKoursesId,
                                _dashboard: "5fbbd16a57e2c761e0ef574e",
                                title: listeKourses.title,
                                elements: listeKourses.elements
                            })
                            .then(() => {
                                SwalHelper.createSmallSuccessPopUp("Élement modifié avec succès!");
                                that.updateKourses();
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
            }
        });
    }

    render() {
        let that = this;
        return (
            <MDBContainer fluid>
                <button
                    className="btn btn-info"
                    style={{
                        borderRadius: "100px",
                        padding: "12px",
                        margin: 10,
                        height: "50px",
                        width: "50px"
                    }}
                    onClick={this.createListKourses}
                >
                    <i className="fas fa-lg fa-plus"/>
                </button>
                <MDBContainer className="d-flex justify-content-center">
                    <MDBRow>
                        {this.state.listListKoursesData.map(function (listeKoursesData, index) {
                            return (
                                <MDBCol style={{minWidth: "275px"}}
                                        key={listeKoursesData._id}
                                        className="mb-3 col-12 col-md-6 col-lg-4 col-xl-3">
                                    <MDBCard>
                                        <div style={{paddingBottom: "10px"}}>
                                            <button className="noteCross"
                                                    onClick={() => that.deleteListKourses(listeKoursesData._id)}>
                                                <i className="far fa-trash-alt"/>
                                            </button>
                                            <button className="noteCross" aria-hidden="true"
                                                    style={{marginRight: "30px"}}
                                                    onClick={() => {
                                                        that.editListKourses(listeKoursesData._id, listeKoursesData.title)
                                                    }}>
                                                <i className="far fa-edit"/>
                                            </button>
                                            <button className="noteCross" aria-hidden="true"
                                                    style={{marginRight: "60px"}}
                                                    onClick={() => {
                                                        that.createElementInListKourses(listeKoursesData._id)
                                                    }}>
                                                <i className="fas fa-plus-circle"/>
                                            </button>
                                        </div>
                                        <MDBCardBody>
                                            <MDBCardTitle>{listeKoursesData.title}</MDBCardTitle>
                                            <div>
                                                <MDBListGroup>
                                                    {listeKoursesData.elements.map(function (koursesData) {
                                                        return (
                                                            <MDBListGroupItem style={{alignItems: "center"}}
                                                                              key={koursesData._id}>
                                                                <div
                                                                    className={koursesData.bought ? "crossed-line koursesListText" : "koursesListText"}>
                                                                    <button className="noteCross" aria-hidden="true"
                                                                            style={{
                                                                                marginRight: "20px",
                                                                                marginTop: "-2px",
                                                                                marginBottom: 0,
                                                                                marginLeft: 0
                                                                            }}
                                                                            onClick={() => {
                                                                                that.deleteElementOfListKourses(listeKoursesData._id, koursesData._id)
                                                                            }}>
                                                                        <i className="far fa-trash-alt fa-xs"/>
                                                                    </button>
                                                                    <button className="noteCross" aria-hidden="true"
                                                                            style={{
                                                                                marginRight: "35px",
                                                                                marginTop: "-1px",
                                                                                marginBottom: 0,
                                                                                marginLeft: 0
                                                                            }}
                                                                            onClick={() => {
                                                                                that.editElementOfListKourses(listeKoursesData._id, koursesData._id, koursesData.content)
                                                                            }}>
                                                                        <i className="fas fa-pencil-alt fa-xs"/>
                                                                    </button>

                                                                    <Input type="checkbox" className="noteCross"
                                                                           style={{marginRight: "10px"}}
                                                                           defaultChecked={koursesData.bought}
                                                                           onClick={() => {
                                                                               that.toggleCheckbox(listeKoursesData._id, koursesData._id, koursesData.bought)
                                                                           }}/>

                                                                    {koursesData.content}
                                                                </div>
                                                            </MDBListGroupItem>
                                                        );
                                                    })}
                                                </MDBListGroup>
                                            </div>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            );
                        })}
                    </MDBRow>
                </MDBContainer>
            </MDBContainer>
        );
    }
}

export default Kourse;
