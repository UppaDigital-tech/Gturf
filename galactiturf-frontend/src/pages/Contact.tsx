import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  Link,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactInfo = ({ icon, title, info }: { icon: string; title: string; info: string }) => (
  <VStack spacing={3} textAlign="center" p={6} bg="gray.50" rounded="lg">
    <Text fontSize="3xl">{icon}</Text>
    <Text fontWeight="bold" fontSize="lg">{title}</Text>
    <Text color="gray.600">{info}</Text>
  </VStack>
);

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Here you would typically send the form data to your backend
    console.log('Contact form data:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <Container maxW="6xl" py={12}>
      <VStack spacing={12}>
        {/* Header */}
        <VStack spacing={6} textAlign="center">
          <Heading fontSize={{ base: '3xl', md: '5xl' }}>
            Get in Touch
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="3xl">
            Have questions about Galactiturf? Want to partner with us? We'd love to hear from you! 
            Reach out to our team and we'll get back to you as soon as possible.
          </Text>
        </VStack>

        {/* Contact Information */}
        <Box w="full">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <ContactInfo
              icon="📍"
              title="Visit Us"
              info="Lagos Island, Lagos State, Nigeria"
            />
            <ContactInfo
              icon="📞"
              title="Call Us"
              info="+234 (0) 1234 567 890"
            />
            <ContactInfo
              icon="✉️"
              title="Email Us"
              info="hello@galactiturf.com"
            />
          </SimpleGrid>
        </Box>

        {/* Contact Form and Info */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} w="full">
          {/* Contact Form */}
          <Box>
            <VStack spacing={6} align="start">
              <Heading fontSize="2xl">Send us a Message</Heading>
              
              {isSubmitted && (
                <Alert status="success">
                  <AlertIcon />
                  Thank you for your message! We'll get back to you soon.
                </Alert>
              )}

              <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full">
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Your full name"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      placeholder="your.email@example.com"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Subject</FormLabel>
                    <Input
                      {...register('subject', { required: 'Subject is required' })}
                      placeholder="What's this about?"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                      {...register('message', { required: 'Message is required' })}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="lg"
                    w="full"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                  >
                    Send Message
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Additional Information */}
          <Box>
            <VStack spacing={8} align="start">
              <Box>
                <Heading fontSize="2xl" mb={4}>Frequently Asked Questions</Heading>
                <VStack spacing={4} align="start">
                  <Box>
                    <Text fontWeight="bold" color="teal.500">How do I book a game?</Text>
                    <Text color="gray.600">
                      Register for an account, purchase a subscription to earn coins, then browse 
                      available games and book using your coins.
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" color="teal.500">What if I need to cancel a booking?</Text>
                    <Text color="gray.600">
                      Contact us at least 24 hours before the game for a full refund of your coins.
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold" color="teal.500">Do you have venues outside Lagos?</Text>
                    <Text color="gray.600">
                      Currently, we operate in Lagos. We're expanding to other cities soon!
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Box>
                <Heading fontSize="2xl" mb={4}>Business Hours</Heading>
                <VStack spacing={2} align="start">
                  <HStack>
                    <Text fontWeight="bold" w="24">Monday - Friday:</Text>
                    <Text>9:00 AM - 6:00 PM</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="24">Saturday:</Text>
                    <Text>10:00 AM - 4:00 PM</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="24">Sunday:</Text>
                    <Text>Closed</Text>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Heading fontSize="2xl" mb={4}>Follow Us</Heading>
                <VStack spacing={3} align="start">
                  <HStack>
                    <Text fontSize="xl">📺</Text>
                    <Link href="https://youtube.com/@galactiturf" isExternal color="teal.500">
                      YouTube Channel - Game highlights & tutorials
                    </Link>
                  </HStack>
                  <HStack>
                    <Text fontSize="xl">💬</Text>
                    <Link href="https://chat.whatsapp.com/galactiturf-community" isExternal color="teal.500">
                      WhatsApp Community - Join the conversation
                    </Link>
                  </HStack>
                  <HStack>
                    <Text fontSize="xl">📱</Text>
                    <Link href="https://instagram.com/galactiturf" isExternal color="teal.500">
                      Instagram - Daily updates & photos
                    </Link>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </SimpleGrid>

        {/* Support Section */}
        <Box w="full" bg="teal.50" p={8} rounded="lg">
          <VStack spacing={4} textAlign="center">
            <Heading fontSize="2xl">Need Immediate Help?</Heading>
            <Text color="gray.600">
              For urgent booking issues or technical support, reach out to us directly.
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                as={Link}
                href="tel:+2341234567890"
                colorScheme="teal"
                variant="outline"
              >
                📞 Call Support
              </Button>
              <Button
                as={Link}
                href="https://wa.me/2341234567890"
                colorScheme="green"
                isExternal
              >
                💬 WhatsApp Us
              </Button>
              <Button
                as={Link}
                href="mailto:support@galactiturf.com"
                colorScheme="blue"
                variant="outline"
              >
                ✉️ Email Support
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}