import { Box, Flex, Heading, Spacer, Button, Menu, MenuButton, MenuList, MenuItem, Text, IconButton} from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {logoutHandler, signInHandler} from "../api/Authenticate"
import { BsTwitter, BsTelegram, BsGithub } from "react-icons/bs";

const Navbar = (props) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [cookies] = useCookies(['userData']);
    const navigate = useNavigate();
    const logoColor = props.color;
    
    useEffect( () => {
        const endpoint = 'http://localhost:3000/protected'
        axios.defaults.withCredentials = true
        axios.get(endpoint)
        .then(res => {
            console.log(res);
            setAuthenticated(true);
        }).catch(err => {
            console.log(err)
            if (props.redirect) {
                navigate('/')
            }
        })

    }, [])

    return(
    <Flex p='2'>
        <Box>
            <Link to='/'>
                <Box display='flex' direction='row'>
                    <Heading fontSize='40' color='red.400'>C</Heading>
                    <Text color={props.color}
                    justifyContent='center' 
                    alignSelf='center'
                    fontSize='15'
                    fontWeight='bold'
                    >
                    -Tickets
                    </Text>
                </Box>
            </Link>
        </Box>
        <Spacer />
        <IconButton icon={<BsTwitter />} mr='2'/>
        <IconButton icon={<BsGithub />} mr='2'/>
        <IconButton icon={<BsTelegram />} mr='2'/>
        {!authenticated && 
        <Box>
            <Button mr='4' onClick={signInHandler}>Connect</Button>
        </Box>
        }
        { authenticated && 
        <Box>
            <Link to="/create/events">
                <Button mr='2'>Create Events</Button>
            </Link>  
            <Link to='/mytickets'>
                <Button mr='2'>My Tickets</Button>
            </Link>
            <Menu>
                <MenuButton mr='4' as={Button}>
                    <Text isTruncated maxW="20">
                        {cookies.userData.address}
                    </Text> 
                </MenuButton>
                <MenuList>
                    <MenuItem>Settings</MenuItem>
                    <MenuItem  onClick={() => logoutHandler(navigate)}>Sign out</MenuItem>
                </MenuList>   
            </Menu>
        </Box>
        }   
    </Flex>
    )
}

export default Navbar;