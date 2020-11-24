import React, { useEffect, useState } from "react";
import { MDBProgress } from "mdbreact";

import KOBOARD from "../../config/AxiosHelper";

import "../../App.css";

function Kognotte() {
  const [soldes, setSoldes] = useState();
  const [soldeMax, setSoldeMax] = useState(250);

  const [transactions, setTransactions] = useState();

  useEffect(async () => {
    const s = await KOBOARD.createGetAxiosRequest("kognotte/soldes");
    if (s) {
      var max = Math.abs(
        Math.max.apply(
          Math,
          s.map(function (o) {
            return o.value;
          })
        )
      );
      setSoldeMax(max);
    }
    setSoldes(s);

    const t = await KOBOARD.createGetAxiosRequest("kognotte/transactions");
    setTransactions(t);
  }, []);

  return (
    <div className="Kognotte">
      <div className="Soldes">
        {soldes &&
          soldes.map((solde) => {
            return <Solde {...solde} soldeMax={soldeMax} />;
          })}
      </div>
      <div className="Transactions">
        {transactions &&
          transactions.map((transaction) => {
            return <Transaction {...transaction} />;
          })}
      </div>
    </div>
  );
}

function Solde(props) {
  const [user, setUser] = useState();

  useEffect(async () => {
    const u = await KOBOARD.createGetAxiosRequest(`users/${props._user}`);
    setUser(u);
    console.log(u);
  }, []);

  return (
    <div className="Solde">
      {user && <h4>{user.name}</h4>}
      <ProgressBar max={props.soldeMax} value={props.value} />
    </div>
  );
}

function ProgressBar(props) {
  const { max, value } = props;

  const width = max * 2;

  var bgcolor;
  var fillerMargin;
  var textAlign;

  if (value > 0) {
    bgcolor = "green";
    textAlign = "left";
    fillerMargin = `0 0 0 ${(max / width) * 100}%`;
  } else {
    bgcolor = "red";
    textAlign = "right";
    fillerMargin = `0 0 0 ${(max / width) * 100 + (value / width) * 100}%`;
  }

  const progressContainer = {
    height: 20,
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 50,
  };

  const progressBar = {
    height: "100%",
    width: `${(Math.abs(value) / width) * 100}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
    margin: fillerMargin,
    "text-align": textAlign,
  };

  const progressText = {
    margin: 15,
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div style={progressContainer} className="barContainer">
      <div style={progressBar} className="barColor">
        {value != 0 && (
          <div>
            <p style={progressText}>{value} €</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Transaction(props) {
  return <p>{props.montant}</p>;
}

export default Kognotte;
