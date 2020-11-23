import React from "react";
import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from '../../config/SwalHelper'
import {Button, Card, CardBody, CardDeck, CardImg, CardText, CardTitle} from "reactstrap";

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
        console.log(this.state.listeNotesData);
        return (
            <div>
                Liste des notes ici...
                <CardDeck style={{display: 'flex', flexDirection: 'row'}}>
                    {this.state.listeNotesData.map(function (noteData, index) {
                            return (
                                <Card key={noteData._id} style={{flex: 1}}>
                                    <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap"/>
                                    <CardBody>
                                        <CardTitle tag="h5">{noteData.title}</CardTitle>
                                        <CardText>{noteData.content}</CardText>
                                        <Button>Button</Button>
                                    </CardBody>
                                </Card>
                            );
                        }
                    )}
                </CardDeck>
            </div>
        );
    }
}

export default Konote;
