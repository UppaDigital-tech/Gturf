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
  Button,
  HStack,
  Icon,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Contact: React.FC = () => {
  const bgColor = 'gray.50';
  const cardBg = 'white';
  const toast = useToast();

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'hello@galactiturf.com',
      link: 'mailto:hello@galactiturf.com',
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: '+234 XXX XXX XXXX',
      link: 'tel:+234XXXXXXXXX',
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Location',
      value: 'Lagos, Nigeria',
      link: null,
    },
  ];

  const socialLinks = [
    {
      icon: FaYoutube,
      name: 'YouTube',
      url: 'https://youtube.com/@galactiturf',
      color: 'red.500',
    },
    {
      icon: FaWhatsapp,
      name: 'WhatsApp',
      url: 'https://wa.me/234XXXXXXXXX',
      color: 'green.500',
    },
    {
      icon: FaFacebook,
      name: 'Facebook',
      url: 'https://facebook.com/galactiturf',
      color: 'blue.500',
    },
    {
      icon: FaTwitter,
      name: 'Twitter',
      url: 'https://twitter.com/galactiturf',
      color: 'blue.400',
    },
    {
      icon: FaInstagram,
      name: 'Instagram',
      url: 'https://instagram.com/galactiturf',
      color: 'pink.500',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message sent!',
      description: 'We\'ll get back to you soon.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <Heading size="2xl">Get in Touch</Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl">
              Have questions, suggestions, or just want to say hello? We'd love to hear from you. 
              Connect with us through any of the channels below.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Contact Information */}
      <Box py={20}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={16}>
            {contactInfo.map((info, index) => (
              <Card key={index} bg={cardBg} shadow="md">
                <CardBody>
                  <VStack spacing={4} textAlign="center">
                    <Icon as={info.icon as any} boxSize={8} color="brand.500" />
                    <Heading size="md">{info.title}</Heading>
                    {info.link ? (
                      <Button
                        as="a"
                        href={info.link}
                        variant="link"
                        color="brand.500"
                        fontSize="lg"
                      >
                        {info.value}
                      </Button>
                    ) : (
                      <Text fontSize="lg" color="gray.600">
                        {info.value}
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12}>
            {/* Contact Form */}
            <Card bg={cardBg} shadow="md">
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Heading size="lg">Send us a Message</Heading>
                  <Box as="form" onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder="Your name" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" placeholder="your.email@example.com" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Subject</FormLabel>
                        <Input placeholder="What's this about?" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Message</FormLabel>
                        <Textarea
                          placeholder="Tell us more..."
                          rows={6}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        colorScheme="brand"
                        size="lg"
                        w="full"
                      >
                        Send Message
                      </Button>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* Social Links */}
            <VStack spacing={8} align="stretch">
              <Heading size="lg">Connect With Us</Heading>
              <Text color="gray.600">
                Follow us on social media for the latest updates, game highlights, 
                and community news.
              </Text>
              
              <VStack spacing={4} align="stretch">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    as="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftIcon={<Icon as={social.icon as any} />}
                    variant="outline"
                    size="lg"
                    justifyContent="flex-start"
                    _hover={{
                      bg: social.color,
                      color: 'white',
                      borderColor: social.color,
                    }}
                  >
                    {social.name}
                  </Button>
                ))}
              </VStack>

              <Card bg={cardBg} shadow="md">
                <CardBody>
                  <VStack spacing={4} textAlign="center">
                    <Heading size="md">Join Our Community</Heading>
                    <Text color="gray.600">
                      Be part of our growing football community. Get updates, 
                      share experiences, and connect with fellow players.
                    </Text>
                    <HStack spacing={4}>
                      <Button
                        as="a"
                        href="https://youtube.com/@galactiturf"
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<Icon as={FaYoutube as any} />}
                        colorScheme="red"
                      >
                        YouTube
                      </Button>
                      <Button
                        as="a"
                        href="https://wa.me/234XXXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        leftIcon={<Icon as={FaWhatsapp as any} />}
                        colorScheme="green"
                      >
                        WhatsApp
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box bg={bgColor} py={20}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading size="lg">Frequently Asked Questions</Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Find answers to common questions about our platform and services.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Card bg={cardBg} shadow="md">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md">How do I book a game?</Heading>
                    <Text color="gray.600">
                      Simply browse available games, select one that fits your schedule, 
                      and click "Book Game". You'll need sufficient coins in your account.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} shadow="md">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md">How do I get coins?</Heading>
                    <Text color="gray.600">
                      Purchase a subscription tier to get coins. Bronze gives you 1000 coins, 
                      Silver gives you 5000 coins, and Gold gives you 10000 coins.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} shadow="md">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md">Can I cancel a booking?</Heading>
                    <Text color="gray.600">
                      Yes, you can cancel bookings up to 24 hours before the game. 
                      Your coins will be refunded to your account.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} shadow="md">
                <CardBody>
                  <VStack spacing={4} align="start">
                    <Heading size="md">Is payment secure?</Heading>
                    <Text color="gray.600">
                      Absolutely! We use Paystack for all payments, which is PCI DSS compliant 
                      and provides bank-level security for all transactions.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;