import React, { useState, useEffect } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import './style.css';
import io from 'socket.io-client';
import Lottie from "react-lottie";
import animationData from '../animation/typing.json'

const ENDPOINT = "http://localhost:3000"
var socket,selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
    const toast = useToast();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState(''); // Initialize as an empty string
    const [socketConnected,setSocketConnected]= useState(false);
    const [typing, setTyping]=useState(false);
    const [isTyping, setIsTyping]=useState(false);


    const defaultOptions={
        loop:true,
        autoplay:true,
        animationData:animationData,
        rendererSettings:{
            preserveAspectRatio:"xMidYMid slice"
        }
    }

    useEffect(()=>{
        socket= io(ENDPOINT);
        socket.emit('setup',user);
        socket.on("connected",()=>setSocketConnected(true));
        socket.on("typing",()=>setIsTyping(true));
        socket.on("stop typing",()=>setIsTyping(false));
        
    },[]);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare= selectedChat;
    
    }, [selectedChat]);

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    const sendMessage = async (e) => {

        if (e.key === "Enter" && newMessage) {

            socket.emit('stop typing',selectedChat._id);
            setNewMessage('');
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.post('/api/message', {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);
                socket.emit('new message',data)
                setMessages([...messages, data]); 



            } catch (error) {
                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    useEffect(()=>{
        socket.on('message recieved',(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id!==newMessageRecieved.chat._id){

                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else{
              
                setMessages([...messages,newMessageRecieved]);
            }
        })
    });



    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timeLength = 3000;
        setTimeout(()=>{
            var timeNow= new Date().getTime();
            var timeDiff=timeNow-lastTypingTime;
            if(timeDiff >= timeLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        },timeLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        width="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => { setSelectedChat(""); }}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        width="100%"
                        height="100%"
                        borderRadius="lg"
                        overflow="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages"><ScrollableChat messages={messages} /></div>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping?<div><Lottie
                                options={defaultOptions}
                                width={70} 
                                style={{marginBottom:15,marginLeft:0}}
                            /></div>:<></>}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder='Enter a message'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">Click on a user to start Chatting</Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
