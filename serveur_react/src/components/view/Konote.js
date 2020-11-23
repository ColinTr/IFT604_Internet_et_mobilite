import React from "react";
import KOBOARD from "../../config/AxiosHelper";

class Konote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listeNotesData: [],
        };
    }

    updateKonotes() {
        let that = this;
        KOBOARD.createGetAxiosRequest("konotes").then((res) => {
            that.setState({ listeNotesData: res });
        });
    }

    componentDidMount() {
        this.updateKonotes()
    }

    render() {
        return <div>{this.state.listeNotesData}</div>;
    }
}

export default Konote;
