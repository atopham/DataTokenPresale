import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import Web3 from "web3";

function BuyTokens() {
    // two tokens per MATIC
    const conversion = 2;

    const location = useLocation();
    const [pay, setPay] = useState(0.000001);
    const [receive, setReceive] = useState(0.000001*conversion)

    const [account, setAccount] = useState(location.state);
    const [balance, setBalance] = useState(0);



    useEffect(() => {
        getAccounts().then((res) => { setAccount(res); return res }).then((res) => (
            getBalance(res).then(setBalance)
        ))


    }, [])

    const getAccounts = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        .catch((e) => {
            console.error(e.message)
            return
        })
        return accounts[0]
      } 

    //   take a value, setPay, then setReceive
  
    const getBalance = async (address) => {
        try{
            let web3 = new Web3(window.ethereum);
            let balW = await web3.eth.getBalance(address)
            let balE = web3.utils.fromWei(balW, 'ether');
            return balE;
        } catch {
            console.log("this method won't get the balance");
        }
      }

    const setPayAsync = async (value) => new Promise(resolve => {
        setPay(value)
        resolve(value)
    })

    const payChangeHandler = (value) => {
        setPayAsync(value)
            .then((res) => setReceive(res*conversion))
    }

    const setReceiveAsync = async(value) => new Promise(resolve => {
        setReceive(value)
        resolve(value)
    })

    const receiveChangeHandler = (value) => {
        setReceiveAsync(value)
            .then((res) => setPay(res*(1/conversion)))
    }

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("pay " + pay)
        console.log("receive " + receive)
    }

    return (
        <div>
            {/* <div className="white-text">Account: {account}</div>
            <div className="white-text">Balance: {balance}</div> */}

            <div className="centered">
                <form className="form" onSubmit={submitHandler}>
                    <span className="form-item">
                        <label htmlFor="pay" className="white-text form-text">I PAY:</label>
                        <input className="input-boxes" id="pay" name="pay" type="number" step="0.000001" value={pay} onChange={(event) => payChangeHandler(event.target.value)}/>

                        {/* <label className="white-text form-text">MATIC</label> */}
                        {/* <h2 className="white-text form-text">MATIC</h2> */}
                    </span>
                    <span className="form-item">
                        <label htmlFor="receive" className="white-text form-text">I RECEIVE:</label>
                        <input className="input-boxes" id="receive" name="receive" type="number" step="0.000001" value={receive} onChange={(event) => receiveChangeHandler(event.target.value)}/>
                        {/* <h2 className="white-text form-text">DataToken</h2> */}
                    </span>
                    <button type="submit" className="button-purple">Buy Tokens</button>
                </form>
            </div>
        </div>
    )
}

export default BuyTokens;