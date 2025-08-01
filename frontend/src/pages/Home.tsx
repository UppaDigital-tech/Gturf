import React from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Heading,
  Button,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Book Football Games',
      text: 'Find and book football games in your area with our easy-to-use platform.',
      icon: '⚽',
    },
    {
      title: 'Earn Coins',
      text: 'Purchase subscriptions to earn coins and unlock premium gaming experiences.',
      icon: '🪙',
    },
    {
      title: 'Track Bookings',
      text: 'Keep track of all your bookings and manage your gaming schedule.',
      icon: '📅',
    },
    {
      title: 'Secure Payments',
      text: 'Safe and secure payment processing with Paystack integration.',
      icon: '🔒',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW={'7xl'} py={{ base: 10, sm: 20, lg: 32 }}>
          <Stack spacing={{ base: 8, md: 10 }} align={'center'} direction={'column'}>
            <Stack spacing={6} textAlign={'center'} maxW={'4xl'}>
              <Heading
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
                lineHeight={'110%'}
              >
                Book Football Games{' '}
                <Text as={'span'} color={'brand.500'}>
                  with Ease
                </Text>
              </Heading>
              <Text color={'gray.500'} maxW={'3xl'} fontSize={'xl'}>
                Join the ultimate football booking platform. Subscribe, earn coins, and book
                your favorite football games with just a few clicks.
              </Text>
            </Stack>
            <Stack spacing={6} direction={'row'}>
              {user ? (
                <Button
                  as={RouterLink}
                  to="/games"
                  rounded={'full'}
                  px={6}
                  colorScheme={'brand'}
                  bg={'brand.500'}
                  _hover={{ bg: 'brand.600' }}
                  size="lg"
                >
                  Browse Games
                </Button>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/register"
                    rounded={'full'}
                    px={6}
                    colorScheme={'brand'}
                    bg={'brand.500'}
                    _hover={{ bg: 'brand.600' }}
                    size="lg"
                  >
                    Get Started
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/login"
                    rounded={'full'}
                    px={6}
                    variant={'outline'}
                    size="lg"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW={'7xl'}>
          <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'} mb={12}>
            <Heading fontSize={'3xl'}>Why Choose Galactiturf?</Heading>
            <Text color={'gray.600'} fontSize={'xl'}>
              Everything you need to enjoy football games with friends and family
            </Text>
          </Stack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            {features.map((feature, index) => (
              <VStack key={index} align={'start'}>
                <Flex
                  w={16}
                  h={16}
                  align={'center'}
                  justify={'center'}
                  color={'white'}
                  rounded={'full'}
                  bg={'brand.500'}
                  mb={1}
                >
                  <Text fontSize="2xl">{feature.icon}</Text>
                </Flex>
                <Text fontWeight={600}>{feature.title}</Text>
                <Text color={'gray.600'}>{feature.text}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
        <Container maxW={'7xl'}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={8}
            align={'center'}
            justify={'space-between'}
          >
            <Stack spacing={4} maxW={'2xl'}>
              <Heading>Ready to Start Playing?</Heading>
              <Text color={'gray.600'} fontSize={'lg'}>
                Join thousands of football enthusiasts who are already booking games on
                Galactiturf. Get your subscription today and start earning coins!
              </Text>
            </Stack>
            <Stack direction={'row'} spacing={4}>
              <Button
                as={RouterLink}
                to="/subscriptions"
                rounded={'full'}
                px={6}
                colorScheme={'brand'}
                bg={'brand.500'}
                _hover={{ bg: 'brand.600' }}
                size="lg"
              >
                View Subscriptions
              </Button>
              <Button
                as={RouterLink}
                to="/games"
                rounded={'full'}
                px={6}
                variant={'outline'}
                size="lg"
              >
                Browse Games
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;