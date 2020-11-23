import React from "react";
import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from '../../config/SwalHelper'
import {Button, Card, CardBody, CardText, CardTitle} from "reactstrap";
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
                if (res.redirectUrl !== undefined) {
                    SwalHelper.createPleaseReconnectLargePopUp(res)
                } else {
                    that.setState({listeNotesData: res});
                }
            })
            .catch(err => {
                    SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
                }
            );
    }

    componentDidMount() {
        this.updateKonotes();
    }

    render() {
        return (
            <div>
                Liste des notes ici...
                <MDBContainer>
                    <MDBRow>
                        {this.state.listeNotesData.map(function (noteData, index) {
                                return (
                                    <MDBCol>
                                        <Card key={noteData._id} style={{flex: 1}}>
                                            <button className="noteCross"><i className="fa fa-times"
                                                                             aria-hidden="true"/>
                                            </button>
                                            <CardBody>
                                                <CardTitle tag="h5">{noteData.title}</CardTitle>
                                                <CardText>{noteData.content}</CardText>
                                                <Button>Button</Button>
                                            </CardBody>
                                        </Card>
                                    </MDBCol>
                                );
                            }
                        )}
                    </MDBRow>
                </MDBContainer>
            </div>
        );
    }
}

export default Konote;
