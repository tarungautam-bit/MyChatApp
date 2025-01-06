import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure,Image,Text } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
  } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user,children}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();

  return <>
        {children?<span onClick={onOpen}>{children}</span>:(<IconButton display={{base:"flex"}} icon={<ViewIcon></ViewIcon>} onClick={onOpen}></IconButton>)}

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="400px">
          <ModalHeader fontSize="40px" fontFamily="Work Sans" display="flex" justifyContent="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
           <Image borderRadius="full" borderSize="150px" src={user.pic} alt={user.name}/>
           <Text>{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
  </>
}

export default ProfileModal