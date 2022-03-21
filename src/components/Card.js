import { HStack, Box, Image, NumberInput, NumberInputField, IconButton, Text, 
         Modal, ModalOverlay, ModalContent, ModalHeader, useDisclosure, ModalCloseButton, ModalBody, Input, Button, Heading} from "@chakra-ui/react";
import { useState } from "react";
import { BiTransferAlt } from 'react-icons/bi';
import { adjustEvent } from "../api/manageEvent";
import { sellTicket } from "../api/manageTickets";

const Card = (props) => {
    const [pressed, setPressed] = useState(false);
    const [price, setPrice] = useState(.001);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handlePress = () => {
        if (props.sell) {
            setPressed(Boolean((pressed - 1)**2));
        } else {
            onOpen();
        }
    }

    return(
        <HStack spacing='24'>
        {props.data &&
        props.data.data.map(data => (
        <Box key={data.title}>
            <Box maxW='xs' 
            borderRadius='lg' 
            overflow='hidden' 
            boxShadow='base'
            _hover={{transform: 'scale(1.05)', cursor: "pointer"}}
            >
                <Box 
                onClick={() => {handlePress()}}
                display='flex'
                direction='column'
                h='14vh'
                >
                    <Box w='50%' p={2}>
                        <Text 
                        fontWeight='semibold' 
                        isTruncated color='red.400'
                        fontSize='20'
                        >
                            {data.title}
                        </Text>
                        <Text>
                            {data.date.split('T')[0]}
                        </Text>
                        {data.sell>0 && <Text>Currently Selling</Text>}
                        {!data.sell && <Text>Available</Text>}
                    </Box>      
                    <Box w='50%'>
                        <Image src={data.img}  h='100%' objectFit='cover'/>
                    </Box>
                </Box>
                
                {/* Sell ticket */}
                {pressed && !data.sell &&
                <Box>
                    <NumberInput step={.001} defaultValue={0.001} onChange={e => setPrice(e)}>
                    <Box w='100%' display='flex' direction='row'>
                        <NumberInputField placeholder="eth"/>
                            <IconButton 
                            colorScheme='purple'
                            icon={<BiTransferAlt />}
                            onClick={() => sellTicket(data.byte_id, price, props)}
                            />
                    </Box>
                    </NumberInput>
                </Box>}

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay  />
                    <ModalContent>
                        <ModalHeader>Adjust Event</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        <form onSubmit={adjustEvent}>
                            <Heading size={10}>Price: ETH</Heading>
                            <NumberInput defaultValue={data.price} name="price" mb='2'>
                                <NumberInputField />
                            </NumberInput>
                            <Heading size={10}>Date</Heading>
                            <Input defaultValue={data.date.split('T')[0]} type='date' name="date" mb='2'/>
                            <Button w='100%' type="submit" name="event" value={data.byte_id}>Change</Button>
                        </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </Box>
        ))
        }
        </HStack>
    )
}

export default Card;