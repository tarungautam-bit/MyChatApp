import React, { useState } from 'react';
import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, Image, useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const postDetail = async (pics) => {
    setLoading(true);

    if (!pics) {
      toast({
        title: 'Please Select an Image.',
        status: 'warning',
        duration: 9000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'dlvap8si1');

      try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/dlvap8si1/image/upload', data);
        setPic(res.data.url);
        setLoading(false);
      } catch (err) {
        toast({
          title: 'Image Upload Failed',
          description: 'Error occurred while uploading the image.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
        setLoading(false);
      }
    } else {
      toast({
        title: 'Only JPEG or PNG Allowed.',
        status: 'warning',
        duration: 9000,
        isClosable: true,
        position: 'bottom'
      });
      setLoading(false);
    }
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      postDetail(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: 'Please Enter All Fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/user',
        { name, email, password, pic },
        { headers: { 'Content-type': 'application/json' } }
      );

      localStorage.setItem('userInfo', JSON.stringify(data));

      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      history.push('/chats');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong!',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" width="100%" padding="20px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
              {showPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleShowConfirmPassword}>
              {showConfirmPassword ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="profile-pic">
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={handlePicChange}
        />
        {pic && <Image src={pic} alt="Profile Preview" boxSize="100px" marginTop="10px" />}
      </FormControl>

      <Button
        colorScheme="teal"
        width="100%"
        marginTop="15px"
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
