import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';

import { MDBModal, MDBModalBody, MDBModalHeader } from 'mdbreact';
import Swal from 'sweetalert2';

import "../../App.css";


function Koulette(){

    const [data, setData] = useState([]);
    const [resultIndex, setResultIndex] = useState();

    const [spin, setSpin] = useState(false);

    const [modal, setModal] = useState(false);
    function handleBtnAddItem(){
        setModal(true);
    }

    const [inputItem, setInputItem] = useState("");
    const [id, setId] = useState(0);

    function handleAddItem(){
        if(inputItem && !data.includes({option: inputItem}) && !spin){
            setData([...data, {id: id, option: inputItem}]);
            setId(id+1);
            setInputItem("");
        }
    }

    function handleRemoveItem(id){
        if(!spin){  
            setData(data.filter(item => item.id !== id));
        }
    }

    function dataVerification(){
        return data && data.length > 0;
    }

    function handleSpinBtnClick(){
        setResultIndex(Math.floor(Math.random() * data.length));
        setSpin(true);
    }

    function stopSpinning(){
        setSpin(false);

        Swal.fire({
            title: "Félicitations !",
            text: `${data[resultIndex].option} a gagné.`
        })
    }


    return(
        <div className="Koulette">

            <div className="DataArea">
                <button className="btn btn-info" disabled={spin} onClick={handleBtnAddItem}>Ajouter des joueurs</button>
                <MDBModal isOpen={modal} toggle={() => setModal(false)}>
                    <MDBModalHeader toggle={() => setModal(false)}>
                        Ajouter un joueur
                    </MDBModalHeader>
                    <MDBModalBody>

                        <div className="Input-Items">
                            <input autoFocus name="add-item" type="text" value={inputItem} className="form-control" disabled={spin} onChange={(e) => {setInputItem(e.target.value)}} onKeyDown={(e) => (e.key === 'Enter' ? handleAddItem(): null)}/>
                            <button className="btn btn-input-item" onClick={handleAddItem} disabled={spin}> Ajouter </button>
                        </div>
                        
                        <div className="Items-List">
                            {
                                data && data.length > 0 && 
                                data.map( (d) => {
                                    return (
                                    <div key={d.id} className="Item-Row">
                                        <span className="Item-Name">{d.option}</span>
                                        <button className="btn btn-delete" disabled={spin} onClick={() => handleRemoveItem(d.id)}>Supprimer</button>
                                    </div>
                                    );
                                })
                            }
                        </div>
                                 
                    </MDBModalBody>
                </MDBModal>

                <button className="btn btn-info" onClick={handleSpinBtnClick} disabled={!dataVerification()}>Lancer la roulette</button>
            </div>

            {
                data && data.length > 0 &&
                <div className="RouletteArea">
                    <div className="Roulette">
                        <Wheel
                        mustStartSpinning={spin}
                        onStopSpinning={stopSpinning}
                        prizeNumber={resultIndex}
                        data={data}
                        backgroundColors={['#3e3e3e', '#df3428']}
                        textColors={['#ffffff']}
                        radiusLineWidth={2}
                        outerBorderWidth={3}
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default Koulette;
