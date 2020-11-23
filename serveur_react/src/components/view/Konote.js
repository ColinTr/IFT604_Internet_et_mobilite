import React from "react";
import KOBOARD from "../../config/AxiosHelper";
import * as Swal from "sweetalert2";

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
            .then((res) => {
                if(res.redirectUrl !== undefined) {
                    Swal.fire({
                        title: "La session a expirée",
                        icon: 'error',
                        confirmButtonText: 'Se reconnecter'
                    }).then( (result) => {
                        if(result.value){
                            window.location.href = res.redirectUrl
                        }
                    });
                } else {
                    that.setState({ listeNotesData: res });
                }
            });
    }

    componentDidMount() {
        this.updateKonotes();
    }

    render() {
        return <div>{this.state.listeNotesData}</div>;
    }
}

export default Konote;
