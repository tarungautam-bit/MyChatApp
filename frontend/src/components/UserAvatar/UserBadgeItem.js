import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      bg="purple.500"      // Use 'bg' for background color
      color="white"        // Ensure the text color contrasts with the background
      cursor="pointer"
     
    >
      {user.name}
      <CloseIcon pl={1}  onClick={handleFunction} />
    </Box>
  );
};

export default UserBadgeItem;
