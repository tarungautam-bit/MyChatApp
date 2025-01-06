import React, { useEffect } from 'react';
import {Container,Box,Text,Tab,Tabs,TabList,TabPanels,TabPanel} from '@chakra-ui/react'
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
const Homepage = () => {

    const history = useHistory();

    useEffect(()=>{
        const userInfo=localStorage.getItem('userInfo');
        if(userInfo){
            history.push('/chats');
        }
    },[history]);

    return (
        <Container maxW='xl' centerContent>
            <Box
            display='flex'
            justifyContent='center'
            p={3}
            bg='white'
            w='100%'
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth='1px'
            >
                <Text fontSize="4xl"  fontFamily='Work Sans' color="blacj"> We chat</Text>
            </Box>
            <Box bg='white' color='black' w='100%' p={4} borderRadius="lg" borderWidth="1px">
            <Tabs variant='soft-rounded'>
                <TabList mb='1em'>
                    <Tab width='50%'>Login</Tab>
                    <Tab width='50%'>Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel><Login/></TabPanel>
                    <TabPanel><Signup/></TabPanel>
                </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
};

export default Homepage