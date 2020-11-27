import { MDBTable, MDBTableBody } from "mdbreact";
import React, { useEffect, useState } from "react";

import "../../../App.css";

function formatNumber(x) {
  return (Math.floor(x * 100) / 100).toFixed(2);
}

function Solde(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    setUser(props.users.find((user) => user._id === props._user));
  }, [props._user, props.users]);

  return (
    <div className="Solde">
      {user && (
        <React.Fragment>
          <h4>{user.username}</h4>
          <MDBTable borderless>
            <MDBTableBody>
              <tr>
                <td className="Center">
                  {formatNumber(props.value)} €
                  <ProgressBar
                    max={props.soldeMax}
                    value={formatNumber(props.value)}
                  />
                </td>
              </tr>
            </MDBTableBody>
          </MDBTable>
        </React.Fragment>
      )}
    </div>
  );
}

function ProgressBar(props) {
  const { max, value } = props;

  const width = max * 2;

  var bgcolor = "#e0e0de";
  var fillerMargin;

  if (value > 0) {
    bgcolor = "green";
    fillerMargin = `0 0 0 ${(max / width) * 100}%`;
  } 
  if (value < 0) {
    bgcolor = "red";
    fillerMargin = `0 0 0 ${(max / width) * 100 + (value / width) * 100}%`;
  }

  const progressContainer = {
    height: 20,
    backgroundColor: "#e0e0de",
    borderRadius: 3,
    margin: 10,
  };

  const progressBar = {
    height: "100%",
    width: `${(Math.abs(value) / width) * 100}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    margin: fillerMargin,
  };

  return (
    <div style={progressContainer} className="barContainer">
      <div style={progressBar} className="barColor"></div>
    </div>
  );
}

export default Solde;
