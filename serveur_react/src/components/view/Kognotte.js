import React, { useEffect, useState } from "react";
import { MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";

import KOBOARD from "../../config/AxiosHelper";

import Solde from "./kognotte/Solde";
import Transaction from "./kognotte/Transaction";

import SwalHelper from "../../config/SwalHelper";
import * as Swal from "sweetalert2";

import Select from 'react-select';
import makeAnimated from 'react-select/animated';


import "../../App.css";

function Kognotte() {

  const [refresh, setRefresh] = useState(false);

  const [users, setUsers] = useState();
  const [soldes, setSoldes] = useState();
  const [soldeMax, setSoldeMax] = useState(100);
  const [transactions, setTransactions] = useState();

  useEffect(() => {
    var isMounted = true;
    const func = async () => {
      try{
        const soldesResponse = await KOBOARD.createGetAxiosRequest("kognotte/soldes");
        const transactionsResponse = await KOBOARD.createGetAxiosRequest("kognotte/transactions");
        const usersResponse = await KOBOARD.createGetAxiosRequest(`users`);

        var max = 100;
        if (soldesResponse) {
          max = Math.abs(Math.max.apply(Math,soldesResponse.map( o => o.value)));
        }
        
        if (isMounted) {
          setUsers(usersResponse);
          setSoldes(soldesResponse);
          setSoldeMax(max);
          setTransactions(transactionsResponse);
        }
      }
      catch(err){
        if (err.response !== undefined && err.response.status === 401) {
          SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
        } else {
            SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
        }
      }
    };
    func();
    return () => (isMounted = false);
  }, [refresh]);

  useEffect(() => {
    const timer = setTimeout( () => {
      setRefresh(!refresh)
    }, 30 * 1000);
    return () => clearTimeout(timer);
  }, [refresh])


  /* Modal add transaction */

  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const animatedComponents = makeAnimated();

  /* FormData */
  const [formFrom, setFormFrom] = useState();
  const [formTo, setFormTo] = useState();
  const [formMontant, setFormMontant] = useState();
  const [formObjet, setFormObjet] = useState();
  const [formDate, setFormDate] = useState();

  /* Form Validator */
  const [formValidator, setFormValidator] = useState(true);
  useEffect(() => {
    setFormValidator( formFrom === undefined || 
                      formTo === undefined  || formTo === null || formTo.length === 0  ||   
                      formMontant === undefined || 
                      formObjet === undefined || 
                      formDate === undefined);
    
  }, [formFrom, formTo, formMontant, formObjet, formDate]);

  const addTransaction = () => {
    if(formValidator){
      SwalHelper.createNoConnectionSmallPopUp("Les champs du formulaires sont invalides");
    }

    const toValues = formTo.map((to) => to.value);
    const data = {
      from: formFrom,
      to: toValues,
      montant: formMontant,
      object: formObjet,
      date: new Date(formDate)
    }

    KOBOARD.createPostAxiosRequest("kognotte", data)
    .then((v) => {
      console.log(v);
      SwalHelper.createSmallSuccessPopUp("Transaction ajoutée avec succès !");
      toggle();

      setRefresh(!refresh);
    })
    .catch((err) => {
        if (err.response !== undefined && err.response.status === 401) {
            SwalHelper.createPleaseReconnectLargePopUp(err.response.data);
        } else {
            SwalHelper.createNoConnectionSmallPopUp("Connexion au serveur impossible");
        }
    });

  };


  /* delete transaction */

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

            setRefresh(!refresh);
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
    <div className="Kognotte">

      <MDBContainer fluid>
        <button className="btn btn-info btn-toogle-modal" onClick={toggle}>
          <i className="fas fa-lg fa-plus"/>
        </button>
        <MDBModal isOpen={modal} toggle={toggle}>
          <MDBModalHeader toggle={toggle}>
            Ajouter une transaction
          </MDBModalHeader>
          <MDBModalBody>
            <form className="ModalBody">
              <p>Payé par</p>
              {
                users &&
                <Select name="from" onChange={(obj) => {setFormFrom(obj.value)}} options={users.map( user => {return {value: user._id, label: user.username}})} />
              }

              <p>Participants</p>
              {
                users &&
                <Select name="to" onChange={(obj) => {setFormTo(obj)}} closeMenuOnSelect={false} components={animatedComponents} isMulti isSearchable options={users.map( user => {return {value: user._id, label: user.username}})} />
              }

              <p>Montant</p>
              <input name="montant" type="number" className="form-control" onChange={(e) => {setFormMontant(e.target.value)}} />
              
              <p>Objet</p>
              <input name="objet" type="text" className="form-control" onChange={(e) => {setFormObjet(e.target.value)}} />

              <p>Date</p>
              <input name="date" type="date" className="form-control" onChange={(e) => {setFormDate(e.target.value)}} />
            </form>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggle}>
                Annuler
            </MDBBtn>
            <MDBBtn color="primary" onClick={addTransaction} disabled={formValidator}>
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
              return <Solde key={solde._id} users={users} {...solde} soldeMax={soldeMax} />;
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
                  <th>Actions</th>
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
