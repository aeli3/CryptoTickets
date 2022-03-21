import { ethers, utils } from "ethers";
import axios from "axios";

const contractAddress = "0x215a181200a5161cfc02c2872eb96726054114c4";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const abi = require('../cryptoTicketsABI.json');
const erc20 = new ethers.Contract(contractAddress, abi, provider);

export const buyTicket = async (data) => {
    const endpoint = 'http://localhost:3000/api/buy_ticket';
    const signer = provider.getSigner();

    provider.send("eth_requestAccounts", [])
    .then( () => {
      erc20.populateTransaction.buyTicket(data[0]['byte_id'], data[0]['owner'])
      .then(unsignedTx => {
        unsignedTx.value = utils.parseEther(String(data[0]['price']))
        signer.sendTransaction(unsignedTx)
        .then(() => {
          axios.post(endpoint, {
            event: data[0]['byte_id']
          })
          .then(res => {
              localStorage.setItem(data[0]['byte_id'], true)
            })
          .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
      })
    })
  }

  export const sellTicket = (event, price, props) => {
    const endpoint = 'http://localhost:3000/api/marketsell';
    const parsed_price = utils.parseEther(String(price))

    props.provider.send("eth_requestAccounts", [])
    .then(() => {
        props.erc20.populateTransaction.sellMarket(event, parsed_price)
        .then((unsignedTx) => {
            const signer = props.provider.getSigner()
            signer.sendTransaction(unsignedTx)
            .then(() => {
                axios.post(endpoint,{
                    event: event,
                    price: price
                })
                .then(() => window.location.reload())
                .catch(err => console.log(err))
            })
        })
    })
}