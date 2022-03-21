import React from "react"
import { Container, Tabs, Tab, TabList, TabPanels, TabPanel, Heading} from '@chakra-ui/react'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useCookies } from "react-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

export default function MyTickets() {
    const contractAddress = "0x215a181200a5161cfc02c2872eb96726054114c4";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const abi = require('../cryptoTicketsABI.json');
    const erc20 = new ethers.Contract(contractAddress, abi, provider);
    const [events, setEvents] = useState(false);
    const [tickets, setTickets] = useState(false);
    const [cookies] = useCookies(['userData']);

    useEffect(() => {
        if (cookies.userData.address) {
            const endpoint = 'http://localhost:3000/api/mytickets'
            axios.get(endpoint)
            .then(res => setTickets(res))
            .catch(err => console.log(err))
        }
    },[setTickets])

    // Retrieve all created events
    const handleEvents = () => {
        const endpoint = 'http://localhost:3000/api/myevents'
        if (cookies.userData.address) {
            axios.get(endpoint)
                .then(data => setEvents(data))
                .catch(err => console.log(err))
            }
        }   
    
    console.log(tickets)
    return(
        <Container maxW='container.xl' p={0} >
        <Navbar color='black'/>
            <Tabs isLazy variant='soft-rounded' padding={10}>
            <TabList>
                <Tab _selected={{ color: 'white', bg: 'red.400' }}
                _focus={{outline: 'none'}}
                _hover={{ color: 'white', bg: 'red.400' }}
                mr='10'
                >
                    <Heading fontSize={25}>
                        My tickets
                    </Heading>
                </Tab>
                <Tab onClick={handleEvents}  
                _selected={{ color: 'white', bg: 'red.400' }} 
                _focus={{outline: 'none'}}
                _hover={{ color: 'white', bg: 'red.400' }}
                >
                    <Heading fontSize={25}>
                        My events
                    </Heading> 
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Card data={tickets} provider={provider} erc20={erc20} sell={true}/>
                </TabPanel>
                <TabPanel>
                    <Card data={events} sell={false}/>
                </TabPanel>
            </TabPanels>
            </Tabs>
        </Container>
    )
}