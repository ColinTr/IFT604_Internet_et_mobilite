import React from "react";
import axios from "axios";

class Konote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listeNotesData: [],
    };
  }

  render() {
    return <div>Liste des konotes</div>;
  }
}

export default Konote;
