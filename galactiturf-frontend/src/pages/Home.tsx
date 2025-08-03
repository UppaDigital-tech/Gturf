import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Container,
  SimpleGrid,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FeatureProps {
  title: string;
  text: string;
  icon: string;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'teal.500'}
        mb={1}
        fontSize={'2xl'}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Container maxW={'7xl'}>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            >
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'teal.400',
                  zIndex: -1,
                }}
              >
                Football
              </Text>
              <br />
              <Text as={'span'} color={'teal.400'}>
                Made Simple!
              </Text>
            </Heading>
            <Text color={'gray.500'}>
              Book football games, earn coins through subscriptions, and connect with fellow 
              football enthusiasts. Experience the beautiful game like never before with 
              Galactiturf - your ultimate football booking platform.
            </Text>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={{ base: 'column', sm: 'row' }}
            >
              {!isAuthenticated ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/register"
                    rounded={'full'}
                    size={'lg'}
                    fontWeight={'normal'}
                    px={6}
                    colorScheme={'teal'}
                    bg={'teal.400'}
                    _hover={{ bg: 'teal.500' }}
                  >
                    Get Started
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/games"
                    rounded={'full'}
                    size={'lg'}
                    fontWeight={'normal'}
                    px={6}
                    variant={'outline'}
                    colorScheme={'teal'}
                  >
                    View Games
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/dashboard"
                    rounded={'full'}
                    size={'lg'}
                    fontWeight={'normal'}
                    px={6}
                    colorScheme={'teal'}
                    bg={'teal.400'}
                    _hover={{ bg: 'teal.500' }}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/games"
                    rounded={'full'}
                    size={'lg'}
                    fontWeight={'normal'}
                    px={6}
                    variant={'outline'}
                    colorScheme={'teal'}
                  >
                    Browse Games
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
          >
            <Box
              position={'relative'}
              height={'300px'}
              rounded={'2xl'}
              boxShadow={'2xl'}
              width={'full'}
              overflow={'hidden'}
              bg="teal.50"
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <Text fontSize={'6xl'}>⚽</Text>
            </Box>
          </Flex>
        </Stack>
      </Container>

      {/* Features Section */}
      <Box p={4} bg="gray.50">
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={'3xl'}>Why Choose Galactiturf?</Heading>
          <Text color={'gray.600'} fontSize={'xl'}>
            Everything you need to enjoy football in Lagos and beyond
          </Text>
        </Stack>

        <Container maxW={'6xl'} mt={10}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <Feature
              icon="📅"
              title={'Easy Booking'}
              text={
                'Book football games quickly and easily with our intuitive platform. Choose from various venues across Lagos.'
              }
            />
            <Feature
              icon="👥"
              title={'Community'}
              text={
                'Connect with fellow football enthusiasts. Join games, make friends, and build your football network.'
              }
            />
            <Feature
              icon="📈"
              title={'Coin System'}
              text={
                'Earn coins through subscriptions and use them to book games. The more you play, the more you save!'
              }
            />
            <Feature
              icon="🏆"
              title={'Quality Venues'}
              text={
                'Play at premium football venues with professional facilities, quality pitches, and proper equipment.'
              }
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Community Section */}
      <Box bg={'gray.100'}>
        <Container maxW={'7xl'} py={16}>
          <VStack spacing={8}>
            <VStack spacing={4} textAlign={'center'}>
              <Heading fontSize={'3xl'}>
                Join Our Community
              </Heading>
              <Text fontSize={'lg'} color={'gray.600'} maxW={'3xl'}>
                Connect with fellow football enthusiasts, watch game highlights, get tips, and stay updated 
                with the latest news from the Galactiturf community.
              </Text>
            </VStack>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w={'full'} maxW={'4xl'}>
              <VStack 
                spacing={4} 
                p={8} 
                bg={'white'} 
                rounded={'lg'} 
                boxShadow={'md'}
                textAlign={'center'}
              >
                <Text fontSize={'4xl'}>📺</Text>
                <Heading fontSize={'xl'}>YouTube Channel</Heading>
                <Text color={'gray.600'}>
                  Watch game highlights, player tutorials, venue tours, and behind-the-scenes content 
                  from the Galactiturf community.
                </Text>
                <Button
                  as={'a'}
                  href="https://youtube.com/@galactiturf"
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="red"
                  size="lg"
                  leftIcon={<Text>📺</Text>}
                >
                  Subscribe to YouTube
                </Button>
              </VStack>
              
              <VStack 
                spacing={4} 
                p={8} 
                bg={'white'} 
                rounded={'lg'} 
                boxShadow={'md'}
                textAlign={'center'}
              >
                <Text fontSize={'4xl'}>💬</Text>
                <Heading fontSize={'xl'}>WhatsApp Community</Heading>
                <Text color={'gray.600'}>
                  Join our active WhatsApp group to find teammates, discuss games, get real-time updates, 
                  and connect with players in your area.
                </Text>
                <Button
                  as={'a'}
                  href="https://chat.whatsapp.com/galactiturf-community"
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="green"
                  size="lg"
                  leftIcon={<Text>💬</Text>}
                >
                  Join WhatsApp Group
                </Button>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg={'teal.500'}>
        <Container maxW={'7xl'} py={16}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            spacing={8}
            align={'center'}
            justify={'space-between'}
          >
            <Stack spacing={4} flex={1}>
              <Heading color={'white'} fontSize={'3xl'}>
                Ready to Play?
              </Heading>
              <Text color={'white'} fontSize={'lg'}>
                Join thousands of football players who trust Galactiturf for their game bookings.
                Start your football journey today!
              </Text>
            </Stack>
            <Stack spacing={4} direction={{ base: 'column', sm: 'row' }}>
              {!isAuthenticated ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/register"
                    size={'lg'}
                    bg={'white'}
                    color={'teal.500'}
                    _hover={{ bg: 'gray.100' }}
                  >
                    Sign Up Now
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/subscriptions"
                    size={'lg'}
                    variant={'outline'}
                    color={'white'}
                    borderColor={'white'}
                    _hover={{ bg: 'white', color: 'teal.500' }}
                  >
                    View Plans
                  </Button>
                </>
              ) : (
                <Button
                  as={RouterLink}
                  to="/subscriptions"
                  size={'lg'}
                  bg={'white'}
                  color={'teal.500'}
                  _hover={{ bg: 'gray.100' }}
                >
                  Upgrade Subscription
                </Button>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}