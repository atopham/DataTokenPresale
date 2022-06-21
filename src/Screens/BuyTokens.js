import React, { useState, useEffect } from "react";
import Web3 from "web3";
import contractInfo from "../contractInfo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let web3, contract;

function BuyTokens() {
    const [pay, setPay] = useState(0.001);
    const [receive, setReceive] = useState(1);
    const [account, setAccount] = useState("");
    const [ethBalance, setEthBalance] = useState(0);
    const [dataTokenBalance, setDataTokenBalance] = useState(0);
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(
                contractInfo.abi,
                contractInfo.address
            );
        }
        getPrice()
            .then((res) => setPrice(res))
            .catch((error) => console.log(error));
        getAccounts()
            .then((res) => {
                setAccount(res);
                return res;
            })
            .then((res) => getEthBalance(res).then(setEthBalance))
            .catch((err) => console.log(err));
    }, []);

    const buyDataToken = async () => {
        contract = new web3.eth.Contract(
            contractInfo.abi,
            contractInfo.address
        );

        console.log(receive);
        console.log(pay);
        console.log(account);
        console.log(contractInfo.address);

        // let payWei = pay * 1000000000000000000
        let payWei = web3.utils.toWei(pay.toString(), "ether");
        console.log(payWei);

        await contract.methods
            .mintTokens(receive)
            .send({
                from: account,
                to: contractInfo.address,
                value: parseInt(payWei),
            })
            .then(() => {
                displayMessage(
                    "success",
                    `You successfully added ${receive} DataToken to your wallet`
                );
                updateState()
                    .then((res) => setDataTokenBalance(res))
                    .catch((error) => console.log(error));
            })
            .catch(() => {
                displayMessage(
                    "error",
                    "There was an error with your transaction"
                );
            });
    };

    const getPrice = async () => {
        let tokenPriceWei = await contract.methods.price().call();
        let tokenPriceEth = web3.utils.fromWei(tokenPriceWei, "ether");
        return tokenPriceEth;
    };

    const getAccounts = async () => {
        if (window.ethereum) {
            await window.ethereum
                .request({ method: "eth_requestAccounts" })
                .catch((err) => console.log(err));
            let accounts = await web3.eth.getAccounts();
            return accounts[0];
        } else {
            alert("Please install the MetaMask extension");
        }
    };

    const getEthBalance = async (address) => {
        try {
            let web3 = new Web3(window.ethereum);
            let balW = await web3.eth.getBalance(address);
            let balE = web3.utils.fromWei(balW, "ether");
            return balE;
        } catch {
            console.log("this method won't get the balance");
        }
    };

    const updateState = async () => {
        let dataTokenBal = await contract.methods.balanceOf(account).call();
        return dataTokenBal;
    };

    const displayMessage = (type, text) => {
        switch (type) {
            case "warning":
                toast.warn(text);
                break;
            case "info":
                toast.info(text);
                break;
            case "error":
                toast.error(text);
                break;
            case "success":
                toast.success(text);
                break;
            default:
                break;
        }
    };

    const setPayAsync = async (value) =>
        new Promise((resolve) => {
            setPay(value);
            resolve(value);
        });

    const payChangeHandler = (value) => {
        setPayAsync(value)
            .then((res) => setReceive(res / price))
            .catch((err) => console.log(err));
    };

    const setReceiveAsync = async (value) =>
        new Promise((resolve) => {
            setReceive(value);
            resolve(value);
        });

    const receiveChangeHandler = (value) => {
        setReceiveAsync(value)
            .then((res) => setPay(res * price))
            .catch((err) => console.log(err));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        buyDataToken();
    };

    return (
        <div>
            <div>
                <ToastContainer />
            </div>
            <div className="">
                <form className="form" onSubmit={submitHandler}>
                    <div className="centered-2">
                        <span className="form-item">
                            <label
                                htmlFor="pay"
                                className="white-text form-text"
                            >
                                I PAY:
                            </label>
                            <input
                                className="input-boxes"
                                id="pay"
                                name="pay"
                                type="number"
                                step="0.000001"
                                value={pay}
                                onChange={(event) =>
                                    payChangeHandler(event.target.value)
                                }
                            />
                            <label className="form-text translation">
                                MATIC
                            </label>
                        </span>
                        <span className="form-item">
                            <label
                                htmlFor="receive"
                                className="white-text form-text"
                            >
                                I RECEIVE:
                            </label>
                            <input
                                className="input-boxes"
                                id="receive"
                                name="receive"
                                type="number"
                                step="0.000001"
                                value={receive}
                                onChange={(event) =>
                                    receiveChangeHandler(event.target.value)
                                }
                            />
                            <label className="form-text translation">
                                DataToken
                            </label>
                        </span>
                        <button type="submit" className="button-purple">
                            Buy Tokens
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BuyTokens;
