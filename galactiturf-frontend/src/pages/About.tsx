import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Avatar,
  Stack,
  Button,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const TeamMember = ({ name, role, description }: { name: string; role: string; description: string }) => (
  <VStack spacing={4} textAlign="center">
    <Avatar size="xl" name={name} />
    <Stack spacing={1}>
      <Text fontWeight="bold" fontSize="lg">{name}</Text>
      <Text color="teal.500" fontSize="sm">{role}</Text>
      <Text fontSize="sm" color="gray.600">{description}</Text>
    </Stack>
  </VStack>
);

export default function About() {
  return (
    <Container maxW="6xl" py={12}>
      <VStack spacing={12}>
        {/* Hero Section */}
        <VStack spacing={6} textAlign="center">
          <Heading fontSize={{ base: '3xl', md: '5xl' }}>
            About Galactiturf
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="3xl">
            We're passionate about making football accessible to everyone in Lagos and beyond. 
            Our platform connects football enthusiasts with quality venues and fellow players.
          </Text>
        </VStack>

        {/* Mission Section */}
        <Box w="full">
          <VStack spacing={8}>
            <Heading fontSize="3xl" textAlign="center">Our Mission</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <VStack spacing={4} p={6} bg="gray.50" rounded="lg">
                <Text fontSize="3xl">🎯</Text>
                <Heading fontSize="xl">Connect Players</Heading>
                <Text textAlign="center" color="gray.600">
                  Building a vibrant community of football lovers who can easily find and join games.
                </Text>
              </VStack>
              
              <VStack spacing={4} p={6} bg="gray.50" rounded="lg">
                <Text fontSize="3xl">⚽</Text>
                <Heading fontSize="xl">Quality Venues</Heading>
                <Text textAlign="center" color="gray.600">
                  Partnering with premium football facilities to ensure the best playing experience.
                </Text>
              </VStack>
              
              <VStack spacing={4} p={6} bg="gray.50" rounded="lg">
                <Text fontSize="3xl">💡</Text>
                <Heading fontSize="xl">Innovation</Heading>
                <Text textAlign="center" color="gray.600">
                  Using technology to make football booking simple, transparent, and rewarding.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Story Section */}
        <Box w="full">
          <VStack spacing={6}>
            <Heading fontSize="3xl" textAlign="center">Our Story</Heading>
            <VStack spacing={4} maxW="4xl" textAlign="center">
              <Text fontSize="lg" color="gray.700">
                Founded in 2024, Galactiturf was born from a simple frustration: it was too difficult 
                to find and book quality football games in Lagos. As passionate football players ourselves, 
                we knew there had to be a better way.
              </Text>
              <Text fontSize="lg" color="gray.700">
                We started with a vision to create a platform that would make it easy for anyone to 
                find football games, connect with other players, and enjoy the beautiful game without 
                the usual hassles of coordination and payment.
              </Text>
              <Text fontSize="lg" color="gray.700">
                Today, we're proud to serve thousands of football enthusiasts across Lagos, providing 
                access to premium venues and fostering a community built around our shared love for football.
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Values Section */}
        <Box w="full">
          <VStack spacing={8}>
            <Heading fontSize="3xl" textAlign="center">Our Values</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} maxW="4xl">
              <HStack spacing={4} align="start">
                <Box color="teal.500" fontSize="2xl">🤝</Box>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Community First</Text>
                  <Text color="gray.600">
                    We believe football is about bringing people together. Every decision we make 
                    prioritizes the community experience.
                  </Text>
                </VStack>
              </HStack>
              
              <HStack spacing={4} align="start">
                <Box color="teal.500" fontSize="2xl">✨</Box>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Excellence</Text>
                  <Text color="gray.600">
                    From our platform to our partner venues, we maintain the highest standards 
                    to ensure exceptional experiences.
                  </Text>
                </VStack>
              </HStack>
              
              <HStack spacing={4} align="start">
                <Box color="teal.500" fontSize="2xl">🔄</Box>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Transparency</Text>
                  <Text color="gray.600">
                    Clear pricing, honest communication, and transparent processes build trust 
                    within our community.
                  </Text>
                </VStack>
              </HStack>
              
              <HStack spacing={4} align="start">
                <Box color="teal.500" fontSize="2xl">🚀</Box>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Innovation</Text>
                  <Text color="gray.600">
                    We continuously improve our platform with new features and technologies 
                    to serve our users better.
                  </Text>
                </VStack>
              </HStack>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Team Section */}
        <Box w="full">
          <VStack spacing={8}>
            <Heading fontSize="3xl" textAlign="center">Meet the Team</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="5xl">
              <TeamMember
                name="David Okafor"
                role="Founder & CEO"
                description="Former professional footballer turned tech entrepreneur, passionate about growing football culture in Nigeria."
              />
              <TeamMember
                name="Sarah Adebayo"
                role="Head of Operations"
                description="Sports management expert with 10+ years experience in venue partnerships and community building."
              />
              <TeamMember
                name="Michael Eze"
                role="Lead Developer"
                description="Full-stack developer and football enthusiast, building the technology that powers our platform."
              />
            </SimpleGrid>
          </VStack>
        </Box>

        {/* CTA Section */}
        <Box w="full" bg="teal.500" color="white" p={8} rounded="lg" textAlign="center">
          <VStack spacing={4}>
            <Heading fontSize="2xl">Ready to Join Our Community?</Heading>
            <Text fontSize="lg">
              Start your football journey with Galactiturf today and connect with players across Lagos.
            </Text>
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              bg="white"
              color="teal.500"
              _hover={{ bg: 'gray.100' }}
            >
              Get Started Now
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}