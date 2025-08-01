import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaFutbol, FaCoins, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');

  const features = [
    {
      icon: FaFutbol,
      title: 'Book Football Games',
      description: 'Find and book football games at premium locations across the city.',
    },
    {
      icon: FaCoins,
      title: 'Coin-Based System',
      description: 'Use coins earned from subscriptions to book games instantly.',
    },
    {
      icon: FaCalendarAlt,
      title: 'Flexible Scheduling',
      description: 'Games available throughout the week at various times.',
    },
    {
      icon: FaUsers,
      title: 'Community',
      description: 'Join a community of football enthusiasts and make new friends.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
              fontWeight="extrabold"
            >
              Welcome to Galactiturf
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="2xl">
              The ultimate platform for booking football games. Subscribe, earn coins, 
              and play the beautiful game with fellow enthusiasts.
            </Text>
            <HStack spacing={4}>
              {user ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/games"
                    size="lg"
                    colorScheme="brand"
                  >
                    Browse Games
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/subscriptions"
                    size="lg"
                    variant="outline"
                  >
                    Get Coins
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/register"
                    size="lg"
                    colorScheme="brand"
                  >
                    Get Started
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/login"
                    size="lg"
                    variant="outline"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">Why Choose Galactiturf?</Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Experience the best football booking platform with our unique features
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {features.map((feature, index) => (
                <VStack
                  key={index}
                  spacing={4}
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="sm"
                  textAlign="center"
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                  transition="all 0.2s"
                >
                  <Icon
                    as={feature.icon}
                    w={10}
                    h={10}
                    color="brand.500"
                  />
                  <Heading size="md">{feature.title}</Heading>
                  <Text color="gray.600">{feature.description}</Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg="brand.500" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" color="white">
              Ready to Start Playing?
            </Heading>
            <Text fontSize="lg" color="brand.100" maxW="2xl">
              Join thousands of players who have already discovered the best way to book football games.
            </Text>
            {!user && (
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                bg="white"
                color="brand.500"
                _hover={{ bg: 'gray.100' }}
              >
                Create Account
              </Button>
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;