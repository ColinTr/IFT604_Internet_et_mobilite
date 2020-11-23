import React from "react";
import axios from "axios";

class Konote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listeNotesData: []
        };
    }

    updateListeNotes() {
        let that = this;
        console.log("getting list notes...");
        axios.get('http://localhost:5000/notes')
            .then(response => {
                that.state.listeNotesData = response
            })
            .catch(err => {

            });
    }

    // This is called when an instance of a component is being created and inserted into the DOM.
    componentDidMount() {
        this.updateListeNotes();

        this.updateListeNotes = this.updateListeNotes.bind(this);

        this.intervalID = setInterval(() => {
            this.updateListeNotes();
        }, 10000);
    }

    render() {
        return (
            <div>
                Liste des konotes
            </div>
        );
    }
}

export default Konote;