import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";

import KOBOARD from "../../config/AxiosHelper";

import Solde from "./kognotte/Solde";
import Transaction from "./kognotte/Transaction";

import SwalHelper from "../../config/SwalHelper";
import * as Swal from "sweetalert2";

import "../../App.css";

function Kognotte() {
  const [users, setUsers] = useState();
  const [soldes, setSoldes] = useState();
  const [soldeMax, setSoldeMax] = useState();

  const [transactions, setTransactions] = useState();

  const deleteTransaction = async (id) => {
    Swal.fire({
      title: "Êtes vous certain ?",
      text: "Impossible de récuperer la note une fois supprimée!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.value) {
        KOBOARD.createDeleteAxiosRequest("kognotte", id)
          .then(() => {
            SwalHelper.createSmallSuccessPopUp(
              "Transaction supprimée avec succès !"
            );

            setTransactions(transactions.filter((elem) => elem._id !== id));
          })
          .catch((err) => {
            if (err.response !== undefined && err.response.status === 401) {
              SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
            } else {
              SwalHelper.createNoConnectionSmallPopUp(
                "Connexion au serveur impossible"
              );
            }
          });
      }
    });
  };

  useEffect(() => {
    var isMounted = true;
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
        if (isMounted) {
          setSoldeMax(max);
        }
      }
      if (isMounted) {
        setSoldes(s);
      }

      const t = await KOBOARD.createGetAxiosRequest("kognotte/transactions");
      if (isMounted) {
        setTransactions(t);
      }

      const u = await KOBOARD.createGetAxiosRequest(`users`);
      if (isMounted) {
        setUsers(u);
      }
    };
    func();
    return () => (isMounted = false);
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
                return (
                  <Transaction
                    key={transaction._id}
                    deleteTransaction={deleteTransaction}
                    users={users}
                    {...transaction}
                  />
                );
              })}
            </MDBTableBody>
          </MDBTable>
        </div>
      )}
    </div>
  );
}

export default Kognotte;
