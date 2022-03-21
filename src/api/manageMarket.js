import { ethers, utils } from "ethers";
import axios from "axios";

const contractAddress = "0x215a181200a5161cfc02c2872eb96726054114c4";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const abi = require('../cryptoTicketsABI.json');
const erc20 = new ethers.Contract(contractAddress, abi, provider);

export function buyMarket(data) {
    const offer = data.split(',');
    const parsed_price = utils.parseEther(String(offer[2]));
    const event = offer[0];
    const seller = offer[1];
    const endpoint = "http://localhost:3000/api/marketbuy";

    provider.send("eth_requestAccounts", [])
    .then(() => {
        erc20.populateTransaction.buyMarket(event, seller)
        .then((unsignedTx) => {
            const signer = provider.getSigner()
            unsignedTx.value = parsed_price;
            signer.sendTransaction(unsignedTx)
            .then(() => {
                axios.post(endpoint,{
                    event: event,
                    seller: seller
                })
                .then(res => console.log(res))
                .catch(err => console.log(err))
            })
        })
    })
  }
