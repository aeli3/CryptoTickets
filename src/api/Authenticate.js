import axios from "axios";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export const logoutHandler = (navigate) => {
    let endpoint = 'http://localhost:3000/logout'
    axios.get(endpoint)
    .then(res => {
        navigate('/')
        window.location.reload();
    })
    .catch(err => {
        console.log(err);
    })
}

export const signInHandler = async () => {
    const endpoint = 'http://localhost:3000/signin'
    provider.send("eth_requestAccounts", [])
    .then(async() => {
        const signer = await provider.getSigner()
        const message = await signer.signMessage("secret_signin")
        axios.post(endpoint, {signature: message})
        .then(() => window.location.reload())
        .catch(err => console.log(err))
    })
}