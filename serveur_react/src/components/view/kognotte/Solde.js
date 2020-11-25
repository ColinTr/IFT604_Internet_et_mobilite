import { MDBTable, MDBTableBody } from "mdbreact";
import React, { useEffect, useState } from "react";
import KOBOARD from "../../../config/AxiosHelper";

import "../../../App.css";

function formatNumber(x) {
  return (Math.floor(x * 100) / 100).toFixed(2);
}

function Solde(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    const func = async () => {
      const u = await KOBOARD.createGetAxiosRequest(`users/${props._user}`);
      setUser(u);
    };
    func();
  }, [props._user]);

  return (
    <div className="Solde">
      {user && (
        <React.Fragment>
          <h4>{user.name}</h4>
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

  var bgcolor;
  var fillerMargin;

  if (value > 0) {
    bgcolor = "green";
    fillerMargin = `0 0 0 ${(max / width) * 100}%`;
  } else {
    bgcolor = "red";
    fillerMargin = `0 0 0 ${(max / width) * 100 + (value / width) * 100}%`;
  }

  const progressContainer = {
    height: 20,
    backgroundColor: "#e0e0de",
    borderRadius: 50,
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
