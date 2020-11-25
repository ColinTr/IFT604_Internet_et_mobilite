import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableBody } from "mdbreact";

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
    if (props.users) {
      const from = props.users.find((user) => user._id === props.from);
      setUserFrom(from);

      const to = props.to.map((id) => {
        return props.users.find((user) => user._id === id);
      });
      setUsersTo(to);
    }
  }, [props.from, props.to, props.users]);

  return (
    <tr onClick={() => props.deleteTransaction(props._id)}>
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
