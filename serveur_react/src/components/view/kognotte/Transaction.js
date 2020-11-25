import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableBody, MDBDropdownToggle } from "mdbreact";
import KOBOARD from "../../../config/AxiosHelper";

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

  const test = async () => {
    console.log("test");
  };

  return (
    <tr onClick={test}>
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
