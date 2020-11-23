import React from "react";
import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from '../../config/SwalHelper'

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
            </div>
        );
    }
}

export default Konote;
