import { Heading, Container, Box, Image, Text, Button, TabList, Tab, Tabs, 
         TabPanels, TabPanel, Table, Thead, Tr, Th, Tbody, Td, Grid, GridItem } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import axios from "axios";
import Navbar from "../components/Navbar";
import { buyMarket }  from "../api/manageMarket.js";
import  maps from '../images/maps.png';
import { buyTicket } from '../api/manageTickets.js';

const Search = () => {
    const [data, setData] = useState(false);
    const { state } = useLocation();
    
    useEffect(() => {
        const endpoint = 'http://localhost:3000/api/event'
        axios.get(endpoint, {
          params: {
            q: state
          }
        })
        .then(res => setData(res.data))
        .catch(err => console.log(err))
    }, [])

    return (
      <Container maxW='container.xl' p={0} >
            <Navbar redirect={false} color='black'/>
            { data &&
              <Grid templateColumns='repeat(2, 1fr)' gap={4}>
                <GridItem borderBottom='ridge 1px'>
                  <Box w='100%' h='15vh' borderBottom='ridge 1px' display='flex' flexDir='column' justifyContent='center'>
                    <Heading color='black'>{data[0]['title']}</Heading>
                    <Text color='gray'>Ticket</Text>
                  </Box>
                  <Box w='100%' h='15vh'>
                    <Box mt={4} display='flex' flexDir='row'>
                      <Heading fontSize='xl'>Price:&nbsp;</Heading>
                      <Text>{data[0]['price']} ETH</Text>
                    </Box>
                    <Box mt={4}>
                      { !localStorage.getItem(data[0]['byte_id']) && <Button onClick={() => buyTicket(data)}>Buy now</Button> }
                      { localStorage.getItem(data[0]['byte_id']) && <Button>Owned</Button>}
                    </Box>
                  </Box>
                </GridItem>
                <GridItem>
                  <Image src={data[0]['img']} w='100%' h='50vh' objectFit='cover' />
                </GridItem> 
              </Grid>
            }
            <Tabs variant='soft-rounded' my='3' colorScheme='brand'>
              <TabList>
                <Tab>About</Tab>
                <Tab>Location</Tab>
                <Tab>Market</Tab>
              </TabList>
              <TabPanels>
              { data &&
                <TabPanel>
                  <Box flex={1} flexDirection='column' w='xl'>
                    <Text>
                        {data[0]['description']}
                    </Text>
                  </Box>
                </TabPanel>
              }
                <TabPanel>
                    <Image src={maps} />
                </TabPanel>
                <TabPanel>
                  <Table>
                    <Thead>
                    <Tr>
                      <Th>Owner</Th>
                      <Th>Sell Price</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                    {data && data.map(offer => (
                      offer.idmarket &&
                      <Tr key={offer.idmarket}>
                        <Td>{offer.seller}</Td>
                        <Td>{offer.marketprice} ETH</Td>
                        <Td>
                          <Button 
                          value={[offer.byte_id, offer.seller, offer.marketprice]} 
                          onClick={e => buyMarket(e.target.value)}
                          >Buy
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                    </Tbody>
                  </Table> 
                </TabPanel>
              </TabPanels>
            </Tabs> 
      </Container>
  )
}

export default Search;