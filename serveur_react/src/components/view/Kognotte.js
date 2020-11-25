import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";

import KOBOARD from "../../config/AxiosHelper";

import Solde from "./kognotte/Solde";
import Transaction from "./kognotte/Transaction";

import "../../App.css";

function Kognotte() {
  const [soldes, setSoldes] = useState();
  const [soldeMax, setSoldeMax] = useState(250);

  const [transactions, setTransactions] = useState();

  useEffect(() => {
    const func = async () => {
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
    };
    func();
  }, []);

  return (
    <div className="Kognotte">
      {soldes && (
        <div className="Soldes">
          <h1>Soldes</h1>
          {soldes.map((solde) => {
            return <Solde key={solde._id} {...solde} soldeMax={soldeMax} />;
          })}
        </div>
      )}

      {transactions && (
        <div className="Transactions">
          <h1>Transactions</h1>
          <MDBTable responsive hover>
            <MDBTableHead>
              <tr>
                <th>Payé par</th>
                <th>Participant(s)</th>
                <th>Montant</th>
                <th>Objet</th>
                <th>Date</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {transactions.map((transaction) => {
                return <Transaction key={transaction._id} {...transaction} />;
              })}
            </MDBTableBody>
          </MDBTable>
        </div>
      )}
    </div>
  );
}

export default Kognotte;
