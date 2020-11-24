import React from "react";
import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from "../../config/SwalHelper";
import {Card, CardBody, CardText, CardTitle} from "reactstrap";
import {MDBCol, MDBContainer, MDBRow} from "mdbreact";

class Konote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listeNotesData: [],
        };
    }

    updateKonotes() {
        let that = this;
        KOBOARD.createGetAxiosRequest("konotes")
            .then(res => {
                that.setState({listeNotesData: res});
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
        console.log('bing')
    };

    editKonote(idKonote) {
        console.log('bong')
    }

    createKonote() {
        console.log('bang')
    }

    componentDidMount() {
        this.updateKonotes();
    }

    render() {
        let that = this;
        return (
            <MDBContainer fluid>
                <button className="btn-circle" color="info" onClick={() => that.createKonote()}>
                    <i className="fas fa-plus"/>
                </button>
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
                                        <button className="noteCross" aria-hidden="true" style={{marginRight: "25px"}}  onClick={() => that.editKonote(noteData._id)}>
                                            <i className="far fa-edit"/>
                                        </button>
                                        <CardBody>
                                            <CardTitle tag="h5">{noteData.title}</CardTitle>
                                            <CardText>{noteData.content}</CardText>
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