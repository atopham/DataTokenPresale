import React from "react";
import { Link } from 'react-router-dom';

function LandingScreen() {

    // const navigate = useNavigate()
    // const [account, setAccount] = useState("");

    // const getAccounts = async () => {
    //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    //     .catch((e) => {
    //         console.error(e.message)
    //         return
    //     })
    //     return accounts[0]
    //   } 

    // const buytokens = () => {

    //     getAccounts().then(setAccount)
    //     navigate('/buytokens', account)
    // }

    return (
        <div className="centered">
            <h1 className="white-text title">Welcome to the DataToken Presale</h1>

            {/* <button className="btn btn-danger">Bootstrap</button> */}

            {/* <button className="button-purple"><Link className="button-purple" to="/buytokens">Buy Tokens</Link></button> */}

            <Link className="button-purple" to="/buytokens">Buy Tokens</Link>

            {/* <button onClick={() => buytokens()}>Buy Tokens</button> */}
        </div>
    )
}

export default LandingScreen;