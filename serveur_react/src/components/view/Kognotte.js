import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBModal,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from "mdbreact";

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

  const addTransaction = (form) => {
    const data = {
      from: form.From,
      to: form.To,
      montant: form.Montant,
      object: form.Objet,
      date: form.Date,
    };
    console.log(data);
    //KOBOARD.createPostAxiosRequest("kognotte", data);
  };

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

  /* Control of the modal form */
  const [formData, setFormData] = React.useState();
  const [isFormValid, setIsFormValid] = React.useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Launch add Transaction
    addTransaction(formData);
  };

  useEffect(() => {
    if (formData) {
      const res =
        formData.From !== undefined &&
        formData.To !== undefined &&
        formData.Montant !== undefined &&
        formData.Objet !== undefined &&
        formData.Date !== undefined;
      setIsFormValid(res);
    }
  }, [formData]);

  const [modal, setModal] = useState(false);

  function toogleModal() {
    setModal(!modal);
  }

  return (
    <div className="Kognotte">
      <MDBContainer className="containerBtnModal" fluid>
        <button
          className="btn btn-info btn-add-transaction"
          onClick={toogleModal}
        >
          <i className="fas fa-lg fa-plus" />
        </button>

        <MDBModal isOpen={modal} toggle={toogleModal}>
          <MDBModalHeader toggle={toogleModal}>
            Ajouter une transaction
          </MDBModalHeader>
          <MDBModalBody>
            <form className="ModalForm">
              <label>
                Payé par
                <select
                  name="From"
                  className="browser-default custom-select"
                  required
                  onChange={handleChange}
                >
                  <option value="">Payé par</option>
                  {users &&
                    users.map((user) => {
                      return (
                        <option key={user._id} value={user._id}>
                          {user.username}
                        </option>
                      );
                    })}
                </select>
              </label>

              <label>
                Participant(s)
                <select
                  name="To"
                  multiple
                  className="browser-default custom-select"
                  required
                  onChange={handleChange}
                >
                  {users &&
                    users.map((user) => {
                      return (
                        <option key={user._id} value={user._id}>
                          {user.username}
                        </option>
                      );
                    })}
                </select>
              </label>

              <label>
                Montant
                <input
                  name="Montant"
                  type="number"
                  className="form-control"
                  onChange={handleChange}
                />
              </label>

              <label>
                Objet
                <input
                  name="Objet"
                  className="form-control"
                  onChange={handleChange}
                />
              </label>

              <label>
                Date
                <input
                  name="Date"
                  type="date"
                  className="form-control"
                  onChange={handleChange}
                />
              </label>
            </form>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toogleModal}>
              Annuler
            </MDBBtn>
            <MDBBtn
              color="primary"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Ajouter
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
      </MDBContainer>

      <div className="Container">
        {soldes && (
          <div className="Soldes">
            <h1>Soldes</h1>
            {soldes.map((solde) => {
              return (
                <Solde
                  key={solde._id}
                  users={users}
                  {...solde}
                  soldeMax={soldeMax}
                />
              );
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
    </div>
  );
}

export default Kognotte;
