import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import KOBOARD from "../../config/AxiosHelper";

import "../../App.css";
import { MDBModal, MDBModalBody, MDBModalHeader } from 'mdbreact';

function Koulette(){

    const [data, setData] = useState();
    const [result, setResult] = useState();

    const [spin, setSpin] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect( () => {
        var isMounted = true;
        async function fetchAndSetData(){
            const users = await KOBOARD.createGetAxiosRequest(`users`);
            const d = users.map((user) => { return {option: user.username}});
            if(isMounted){
                setData(d);
            }
        }
        fetchAndSetData();
        return () => isMounted = false;
    }, []);

    function handleBtnClick(){
        setResult(Math.floor(Math.random() * data.length));
        setSpin(true);
        setShowResult(false);
    }

    function stopSpinning(){
        setSpin(false);
        setShowResult(true);
    }

    return(
        <div className="Koulette">
            {
                data &&
                <React.Fragment>
                    <div class="Roulette">
                        <Wheel
                        mustStartSpinning={spin}
                        onStopSpinning={stopSpinning}
                        prizeNumber={result}
                        data={data}
                        backgroundColors={['#3cd0d3', '#83f1c5']}
                        textColors={['#ffffff']}
                        radiusLineWidth={1}
                        outerBorderWidth={3}
                        />
                    </div>
                    

                    <button className="btn btn-info" onClick={handleBtnClick}>SPIN THE ROULETTE</button>

                    <MDBModal isOpen={showResult} toggle={() => setShowResult(false)}>
                        <MDBModalHeader toggle={() => setShowResult(false)}>
                            Félicitation !
                        </MDBModalHeader>
                        <MDBModalBody>
                            {
                                data && data[result] &&
                                <p>Le gagnant est : {data[result].option}</p>
                            }
                        </MDBModalBody>
                    </MDBModal>
                </React.Fragment>
            }
        </div>
    );
}

export default Koulette;
