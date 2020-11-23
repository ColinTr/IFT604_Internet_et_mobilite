import React from "react";
import KOBOARD from "../../config/AxiosHelper";
import SwalHelper from "../../config/SwalHelper";
import { Button, Card, CardBody, CardText, CardTitle } from "reactstrap";
import { MDBCol, MDBContainer, MDBRow } from "mdbreact";

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
        if (res.redirectUrl !== undefined) {
          SwalHelper.createPleaseReconnectLargePopUp(res);
        } else {
          that.setState({ listeNotesData: res });
        }
      })
      .catch((err) => {
        SwalHelper.createNoConnectionSmallPopUp(
          "Connexion au serveur impossible"
        );
      });
  }

  componentDidMount() {
    this.updateKonotes();
  }

  render() {
    return (
      <MDBContainer className="container-fluid">
        <MDBRow>
          {this.state.listeNotesData.map(function (noteData, index) {
            return (
              <MDBCol
                key={noteData._id}
                className="mb-3 col-12 col-md-6 col-lg-4 col-xl-3"
              >
                <Card>
                  <button className="noteCross">
                    <i className="fa fa-times" aria-hidden="true" />
                  </button>
                  <CardBody>
                    <CardTitle tag="h5">{noteData.title}</CardTitle>
                    <CardText>{noteData.content}</CardText>
                    <Button>Button</Button>
                  </CardBody>
                </Card>
              </MDBCol>
            );
          })}
        </MDBRow>
      </MDBContainer>
    );
  }
}

export default Konote;
