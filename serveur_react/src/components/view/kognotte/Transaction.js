import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableBody } from "mdbreact";
import KOBOARD from "../../../config/AxiosHelper";
import SwalHelper from "../../../config/SwalHelper";
import * as Swal from "sweetalert2";

function formatNumber(x) {
  return (Math.floor(x * 100) / 100).toFixed(2);
}

function formatDate(date) {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);

  return formattedDate;
}

function Transaction(props) {
  const [userFrom, setUserFrom] = useState();
  const [usersTo, setUsersTo] = useState();

  useEffect(() => {
    const func = async () => {
      const users = await KOBOARD.createGetAxiosRequest(`users`);

      const from = users.find((user, index) => user._id === props.from);
      setUserFrom(from);

      const to = props.to.map((id) => {
        return users.find((user, index) => user._id === id);
      });
      setUsersTo(to);
    };
    func();
  }, [props.from, props.to]);

  const deleteTransaction = async () => {
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
        KOBOARD.createDeleteAxiosRequest("kognotte", props._id)
          .then(() => {
            SwalHelper.createSmallSuccessPopUp(
              "Transaction supprimée avec succès !"
            );
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

  return (
    <tr onClick={deleteTransaction}>
      <td>{userFrom && userFrom.username}</td>
      <td>
        {usersTo && (
          <MDBTable>
            <MDBTableBody>
              {usersTo.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        )}
      </td>
      <td>{formatNumber(props.montant)} €</td>
      <td>{props.object}</td>
      <td>{formatDate(new Date(props.date))}</td>
    </tr>
  );
}

export default Transaction;
