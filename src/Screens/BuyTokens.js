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
    const [ethBalance, setEthBalance] = useState(0);
    const [maticBalance, setMaticBalance] = useState(0);
    const [dataTokenBalance, setDataTokenBalance] = useState(0)

    let web3, token, contract, approved = false;

    useEffect(() => {

        if(window.ethereum) {
            web3 = new Web3(window.ethereum)
            token = new web3.eth.Contract(tokenInfo.abi, tokenInfo.address)
            contract = new web3.eth.Contract(contractInfo.abi, contractIno.address)
        }


        getAccounts().then((res) => { setAccount(res); return res }).then((res) => (
            getEthBalance(res).then(setEthBalance)
        ))

    }, [])

    const getAccounts = async () => {
        if (window.ethereum){
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            .catch((e) => {
                console.error(e.message)
                return
            })
            updateState()
            return accounts[0]
        } else {
            alert("Please install the MetaMask extension")
        }
      } 
  
    const getEthBalance = async (address) => {
        try{
            let web3 = new Web3(window.ethereum);
            let balW = await web3.eth.getBalance(address)
            let balE = web3.utils.fromWei(balW, 'ether');
            return balE;
        } catch {
            console.log("this method won't get the balance");
        }
      }

    const updateState = () => {
        let maticBal = await token.methods.balanceOf(account).call()
        let dataTokenBal = await contract.methods.balanceOf(account).call()

        setMaticBalance(maticBal)
        setDataTokenBalance(dataTokenBal)
        
    }

    const buyDataToken = (tokenAmount) => {
        if(approved === false) {
            approveMatic()
            approved = true
            return
        } else {
            contract.methods.buyToken(account, web3.utils.toWei(tokenAmount.toString(), 'ether')).send({
                from: account
            }).then(() => {
                displayMessage('success', `You successfully added ${tokenAmount} DataToken to your wallet`)
                updateState()
            }).catch(() => {
                displayMessage('error', 'There was an error with your transaction')
            })
        }
    }

    const addTokenToWallet = async() => {
        if(!window.ethereum) return

        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20',
                options: {
                    address: contractInfo.address,
                    symbol: 'DATKN',
                    decimals: 18,
                },
            },
        });
    }

    const approveMatic = async() => {
        await token.methods.approve(contractInfo.address, constants.MaxUnit256).send({
            from: account
        })
        updateState()
        return true
    }

    const displayMessage = (type, text) => {
        switch(type) {
            case 'warning':
                toast.warn(text); break
            case 'info':
                toast.info(text); break
            case 'error':
                toast.error(text); break
            case 'success':
                toast.success(text); break
            default: break
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

        if(isNaN(pay)) {
            return
        }

        buyDataToken(receive)

    }

    return (
        <div>
            {/* <div className="white-text">Account: {account}</div>
            <div className="white-text">Balance: {balance}</div> */}
            <div className="white-text">Account: {account}</div>
            <div className="white-text">Eth Balance: {ethBalance}</div>
            <div className="white-text">MATIC Balance: {maticBalance}</div>
            <div className="white-text">DataToken Blance: {dataTokenBalance}</div>

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
                    <button type="submit" className="button-purple">{approved === true ? "Buy Tokens" : "Approve MATIC"}</button>

                    <button type="submit" className="button-purple" onClick={addTokenToWallet}>Add DataToken to Wallet</button>
                </form>
            </div>
        </div>
    )
}

export default BuyTokens;