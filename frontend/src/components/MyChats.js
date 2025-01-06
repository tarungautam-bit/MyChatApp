import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import axios from 'axios';
import { Box, Button, Stack, Text, useToast, useColorMode } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from './config/ChatLogic';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();
  const { colorMode } = useColorMode();

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return; // Prevent fetch if user is not defined yet
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get('/api/chat', config);
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: 'bottom-left',
        });
      }
    };

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setLoggedUser(userInfo);
    if (userInfo) {
      fetchChats(); // Call fetchChats once the user is set
    }
  }, [user, setChats, fetchAgain,toast]); // Add necessary dependencies here

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={colorMode === "light" ? "white" : "gray.700"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg={colorMode === "light" ? "#F8F8F8" : "gray.600"}
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? (colorMode === "light" ? "#38B2AC" : "teal.500") : (colorMode === "light" ? "#E8E8E8" : "gray.600")}
                color={selectedChat === chat ? "white" : (colorMode === "light" ? "black" : "gray.200")}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
