import './App.css';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.js';
import { Container, Box, Flex, Heading, InputGroup, InputLeftElement, Grid, GridItem, Image} from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import headerImage from './images/headerImage.jpg';
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList} from "@choc-ui/chakra-autocomplete";
import { FaSearch } from "react-icons/fa";
import { handleSearch } from './api/query';

const App = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState(['']);
  const [popular, setPopular] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const endpoint = 'http://localhost:3000/api/popular';
    axios.get(endpoint)
    .then(res => {
      let arr = []
      res.data.map(data => arr.push(data.title))
      setEvents(arr)
      setPopular(res)
    })
    .catch(err => console.log(err))
  }, [])

  // Navigate to event page
  const handleSelect = (query) => {
    navigate(`/search/?q=${query}`, {state: query})
  }

  const handleInput = async(value) => {
    const res = await handleSearch(value);
    if (res) {
      setEvents(res);
    }
  }

  return(
    <Box>
      <Box boxSize='3xl' w='100%' h='60vh' 
      bgImage={headerImage} 
      backgroundPosition="center"
      >
      <Container maxW='container.xl' p={0}>
        <Navbar redirect={false} color='white'/>
        <Flex
        h={{base:'auto', md:'40vh'}}
        py={[0, 10, 20]} justifyContent='center' 
        >
          <Box mt='10vh'>
              <Heading size='3xl' color='white' mb='3'>
                Sell & buy tickets for your event
              </Heading>
              <form>
                <AutoComplete openOnFocus onSelectOption={(selection) => handleSelect(selection.item.value)}>
                  <InputGroup>
                    <InputLeftElement h='6vh' children={<FaSearch color='black'/>} ml='10'/>
                    <AutoCompleteInput _focus={{backgroundColor:'white'}} h='6vh' mr='10' w='100%' 
                    onChange={data => handleInput(data.target.value)} 
                    placeholder="Search by event or artist"  
                    />
                  </InputGroup>
                  <AutoCompleteList>
                    {events.map((event, cid) => (
                      <AutoCompleteItem
                      key={`option-${cid}`}
                      value={event}
                      textTransform="capitalize"
                      >
                      {event}
                      </AutoCompleteItem>
                    ))}
                  </AutoCompleteList>
                </AutoComplete>
              </form>         
          </Box>
      </Flex>
  </Container>
      </Box> 
      <Box mt={10}>
          <Container maxW='4xl'>
            <Heading color='red.400' mb={3}>Popular Events Near You</Heading>
            <Grid templateColumns='repeat(3, 1fr)' gap={6}>
              {popular.data && popular.data.map(data => (
                  <GridItem 
                  key={data.id} 
                  w='100%' 
                  h='20vh'
                  borderRadius='md'
                  onClick={e => handleSelect(e.target.name)}
                  > 
                    <Box h="100%" 
                    textAlign='center' 
                    boxShadow='2xl'
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    _hover={{transform: 'scale(1.05)', cursor: "pointer"}}
                    >
                      <Image src={data.img} h="100%" objectFit='cover' name={data.title}/>
                    </Box>
                    <Heading fontSize={18} mt="4">{data.title}</Heading>
                  </GridItem>  
              ))}
            </Grid>
          </Container>
      </Box>
  </Box>
  )
}

export default App;
