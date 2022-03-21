import { ethers, utils } from "ethers";
import axios from "axios";

const contractAddress = "0x215a181200a5161cfc02c2872eb96726054114c4";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const abi = require('../cryptoTicketsABI.json');
const erc20 = new ethers.Contract(contractAddress, abi, provider);

export const createEvent = (e, image) => {
    e.preventDefault();
    const parsed_price = utils.parseEther(String(e.target.price.value));
    const parsed_date = Date.parse(String(e.target.date.value) + " 23:59");
    const tickets = e.target.tickets.value;
    const endpoint = 'http://localhost:3000/api/create_event';

    // Transact Contract
    provider.send("eth_requestAccounts", [])
    .then(() => { 
        erc20.populateTransaction.createEvent(parsed_price, parsed_date, tickets)
        .then(unsignedTx => {
            const signer = provider.getSigner()
            signer.sendTransaction(unsignedTx)
            .then(res => {
                signer.getAddress()
                .then(address => {
                    let eventFilter = erc20.filters.eventHash()
                    erc20.queryFilter(eventFilter)
                    .then(res => {
                        const bytes_id = res.pop().args['_event']
                        axios.post(endpoint, {
                            owner : address,
                            date : e.target.date.value,
                            title : e.target.title.value,
                            description : e.target.description.value,
                            price : e.target.price.value,
                            image : image,
                            byte_id : bytes_id
                        })
                        .then(res => {
                            return(true);
                        })
                        .catch(err => console.log(err))
                    })
                })
            })
            .catch(err => console.log(err))
        })           
    })
}

export const adjustEvent = (e) => {
    e.preventDefault();
    const parsed_price = utils.parseEther(String(e.target.price.value));
    const parsed_date = Date.parse(String(e.target.date.value) + " 23:59");
    const event = e.target.event.value;
    const endpoint = 'http://localhost:3000/api/adjustEvent';

    // Metamask transaction
    provider.send("eth_requestAccounts", [])
    .then(() => {
        // ticket first
        erc20.populateTransaction.adjustEvent(event, parsed_price, parsed_date)
        .then(unsignedTx => {
            const signer = provider.getSigner()
            signer.sendTransaction(unsignedTx)
            .then(() => {
                axios.post(endpoint,{
                    event: event,
                    price: e.target.price.value,
                    date: e.target.date.value
                })
                .then(res => console.log(res))
                .catch(err => console.log(err))
            })
        })
    })
}