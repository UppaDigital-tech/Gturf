import React from 'react';
import { Box, Container, Stack, Text } from '@chakra-ui/react';

const Footer: React.FC = () => {
  return (
    <Box
      bg="gray.50"
      color="gray.700"
      borderTop={1}
      borderStyle={'solid'}
      borderColor="gray.200"
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