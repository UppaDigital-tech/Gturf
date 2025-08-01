import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  HStack,
} from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      bg="gray.50"
      color="gray.700"
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
        <Text fontSize="sm">
          © 2024 Galactiturf. All rights reserved. Built with ❤️ for football lovers.
        </Text>
        <HStack spacing={6}>
          <Link href="/about" fontSize="sm">
            About
          </Link>
          <Link href="/contact" fontSize="sm">
            Contact
          </Link>
          <Link href="/terms" fontSize="sm">
            Terms
          </Link>
          <Link href="/privacy" fontSize="sm">
            Privacy
          </Link>
        </HStack>
      </Container>
    </Box>
  );
}