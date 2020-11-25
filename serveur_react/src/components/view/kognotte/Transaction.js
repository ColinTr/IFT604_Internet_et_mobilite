import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableBody } from "mdbreact";
import KOBOARD from "../../../config/AxiosHelper";

function formatNumber(x) {
  return (Math.floor(x * 100) / 100).toFixed(2);
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

  return (
    <tr>
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
      <td>{props.date}</td>
    </tr>
  );
}

export default Transaction;
