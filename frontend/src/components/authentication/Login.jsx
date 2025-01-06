import React, { useState } from 'react';
import { Input, Button, FormControl, FormLabel, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleShowPassword = () => setShow(!show);

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the fields",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    } else {
      try {
        const { data } = await axios.post(
          "api/user/login",
          { email, password },
          { headers: { 'Content-type': 'application/json' } }
        );
        toast({
          title: "Login Successful",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        // Force full page reload
        window.location.href = '/chats';
      } catch (err) {
        toast({
          title: "Error Occurred",
          description: err.response?.data?.message || 'Something went wrong!',
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }
  };

  // Function to set guest credentials
  const setGuestCredentials = () => {
    setEmail('guest@example.com');
    setPassword('guestpassword');
  };

  return (
    <VStack spacing="5px" width="100%" padding="20px">
      <FormControl id='email' mb={4}>
        <FormLabel>Email Address</FormLabel>
        <Input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
        />
      </FormControl>

      <FormControl id="password" isRequired mb={4}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme='teal'
        size='md'
        width='full'
        onClick={handleLogin}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        colorScheme='gray'
        size='md'
        width='full'
        onClick={setGuestCredentials}
      >
        Set Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;
