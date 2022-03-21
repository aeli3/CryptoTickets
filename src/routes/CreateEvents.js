import { Container, Heading, Box, Image, Modal, ModalOverlay, ModalContent, ModalHeader,
         ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Button, Input, Flex, VStack,
        SimpleGrid, GridItem, Textarea, Grid } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/manageEvent";


export default function CreateEvents() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [image, setImage] = useState(false);
    const navigate =  useNavigate();
  
    const handleImage = (e) => {
        e.preventDefault();
        setImage(e.target[0].value)
        onClose();
    }

    const handleCreateEvent = async (e, image) => {
        const res = await createEvent(e, image);
        if (res) {
            navigate('/mytickets');
        }
    }

    return(
        <Container maxW='container.xl' p={0}>
        <Navbar color='black'/>
        <Flex h={{base:'auto', md:'60vh'}}
                py={[0, 10, 20]} 
                justifyContent='center' 
                >
        <Grid templateColumns='repeat(2, 1fr)' gap={4}>
            <GridItem>
                <form onSubmit={e => handleCreateEvent(e, image)}>
                    <VStack>
                        <SimpleGrid columns={2} columnGap={3}>
                            <GridItem colSpan={1}>
                                <Heading>Title</Heading>
                                <Input name="title"></Input>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Heading>Price</Heading>
                                <Input name="price" placeholder="Eth"></Input>                       
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Heading>Nr. Tickets</Heading>
                                <Input name="tickets"></Input>
                            </GridItem>
                            <GridItem colSpan={1}>
                                <Heading>Date</Heading>
                                <Input type="date" name="date"/>
                            </GridItem>
                            <GridItem colSpan={2}>
                                <Heading>Description</Heading>
                                <Textarea size='xl' name="description"/>                  
                            </GridItem>
                            <GridItem colSpan={2} mt="10">
                                <Button w="100%" type="submit">Create Event</Button>
                            </GridItem>
                        </SimpleGrid>
                    </VStack>
                </form>
            </GridItem>
            <GridItem>
                <Box w='100%' 
                h='40vh' 
                background="gray.400" 
                display="flex" alignItems='center' 
                justifyContent="center"
                onClick={onOpen}
                > 
                { image && <Image src={image} w='100%' h='40vh' objectFit='cover' /> }
                { !image && <Heading>Upload Image</Heading> }
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Upload</ModalHeader>
                            <ModalCloseButton />
                        <form onSubmit={handleImage}>
                            <ModalBody>
                                <Input variant="flushed" placeholder="URL"/>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit">Save</Button>
                            </ModalFooter>
                        </form>
                        </ModalContent>
                    </Modal> 
                </Box>
            </GridItem>
        </Grid> 
        </Flex> 
        </Container>
    )
}