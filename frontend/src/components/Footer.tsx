import React from 'react';
import { Box, Container, Stack, Text, useColorModeValue } from '@chakra-ui/react';

const Footer: React.FC = () => {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      borderTop={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2024 Galactiturf. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <Text>⚽ Football Game Booking Platform</Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;