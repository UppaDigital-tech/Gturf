import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Button,
  HStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaYoutube, FaWhatsapp, FaUsers, FaTrophy, FaHeart, FaShieldAlt } from 'react-icons/fa';

const About: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const values = [
    {
      icon: FaUsers,
      title: 'Community First',
      description: 'Building a strong football community where players connect, compete, and grow together.',
    },
    {
      icon: FaTrophy,
      title: 'Excellence',
      description: 'Striving for excellence in every game, every booking, and every interaction.',
    },
    {
      icon: FaHeart,
      title: 'Passion',
      description: 'Fueled by our passion for football and commitment to making the sport accessible to everyone.',
    },
    {
      icon: FaShieldAlt,
      title: 'Trust & Security',
      description: 'Ensuring secure payments and reliable booking systems for peace of mind.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading
              size="2xl"
              bgGradient="linear(to-r, brand.400, brand.600)"
              bgClip="text"
            >
              About Galactiturf
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl">
              We're revolutionizing the way football enthusiasts connect, book games, and build communities. 
              Our platform makes it easy to find, book, and enjoy football games with like-minded players.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box py={20}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <VStack spacing={6} align="start">
              <Heading size="lg">Our Mission</Heading>
              <Text fontSize="lg" color="gray.600">
                To create the ultimate football booking platform that connects players, 
                facilitates seamless game bookings, and builds thriving football communities 
                across Nigeria and beyond.
              </Text>
              <Text fontSize="lg" color="gray.600">
                We believe that football is more than just a game – it's a way to build 
                friendships, stay healthy, and create lasting memories. That's why we've 
                built a platform that makes it easier than ever to get on the pitch.
              </Text>
            </VStack>
            <Box>
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Football community"
                borderRadius="lg"
                shadow="xl"
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="lg">Our Values</Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                These core values guide everything we do and shape the community we're building.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
              {values.map((value, index) => (
                <Card key={index} bg={cardBg} shadow="md">
                  <CardBody>
                    <VStack spacing={4} textAlign="center">
                      <Icon as={value.icon} boxSize={8} color="brand.500" />
                      <Heading size="md">{value.title}</Heading>
                      <Text color="gray.600">{value.description}</Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Story Section */}
      <Box py={20}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <Box>
              <Image
                src="https://images.unsplash.com/photo-1553778263-73a83bab9b0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                alt="Football field"
                borderRadius="lg"
                shadow="xl"
              />
            </Box>
            <VStack spacing={6} align="start">
              <Heading size="lg">Our Story</Heading>
              <Text fontSize="lg" color="gray.600">
                Galactiturf was born from a simple frustration: finding and booking 
                football games was unnecessarily complicated. As passionate football 
                players ourselves, we knew there had to be a better way.
              </Text>
              <Text fontSize="lg" color="gray.600">
                What started as a small project to solve our own booking problems 
                has grown into a comprehensive platform that serves thousands of 
                football enthusiasts across Nigeria. We're proud to be part of 
                the football community and committed to making the sport more 
                accessible to everyone.
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="lg">Join Our Community</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Connect with fellow football enthusiasts, stay updated with the latest news, 
              and be part of our growing community.
            </Text>
            <HStack spacing={6} wrap="wrap" justify="center">
              <Button
                as="a"
                href="https://youtube.com/@galactiturf"
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<FaYoutube />}
                colorScheme="red"
                size="lg"
              >
                YouTube Channel
              </Button>
              <Button
                as="a"
                href="https://wa.me/234XXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<FaWhatsapp />}
                colorScheme="green"
                size="lg"
              >
                WhatsApp Community
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                colorScheme="brand"
                size="lg"
              >
                Get Started
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default About;