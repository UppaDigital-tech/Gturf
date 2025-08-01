import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  OrderedList,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';

export default function Terms() {
  return (
    <Container maxW="4xl" py={12}>
      <VStack spacing={8} align="start">
        <Box textAlign="center" w="full">
          <Heading fontSize={{ base: '3xl', md: '4xl' }} mb={4}>
            Terms of Service
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Last updated: January 15, 2024
          </Text>
        </Box>

        <Box w="full">
          <Text fontSize="lg" color="gray.700" mb={6}>
            Welcome to Galactiturf. These Terms of Service ("Terms") govern your use of our website, 
            mobile application, and services. By accessing or using Galactiturf, you agree to be bound by these Terms.
          </Text>

          <VStack spacing={6} align="start">
            <Box>
              <Heading fontSize="xl" mb={3}>1. Acceptance of Terms</Heading>
              <Text color="gray.700">
                By creating an account or using our services, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms and our Privacy Policy. If you do not 
                agree with any part of these terms, please do not use our services.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>2. Description of Service</Heading>
              <Text color="gray.700" mb={3}>
                Galactiturf is a platform that allows users to:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Register and create user accounts</ListItem>
                <ListItem>Purchase subscription plans to earn coins</ListItem>
                <ListItem>Browse and book football games</ListItem>
                <ListItem>Connect with other football enthusiasts</ListItem>
                <ListItem>Access premium football venues</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>3. User Accounts</Heading>
              <Text color="gray.700" mb={3}>
                To use our services, you must:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Be at least 16 years old</ListItem>
                <ListItem>Provide accurate and complete information</ListItem>
                <ListItem>Maintain the security of your account credentials</ListItem>
                <ListItem>Notify us immediately of any unauthorized use</ListItem>
                <ListItem>Accept responsibility for all activities under your account</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>4. Subscription and Payment Terms</Heading>
              <Text color="gray.700" mb={3}>
                Our subscription service includes:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Multiple subscription tiers with varying coin rewards</ListItem>
                <ListItem>Secure payments processed through Paystack</ListItem>
                <ListItem>Immediate coin credit upon successful payment</ListItem>
                <ListItem>No automatic renewal - each subscription is one-time</ListItem>
                <ListItem>Coins do not expire but are non-transferable</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>5. Booking and Cancellation Policy</Heading>
              <Text color="gray.700" mb={3}>
                Game bookings are subject to:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Availability of slots at the time of booking</ListItem>
                <ListItem>Sufficient coin balance in your account</ListItem>
                <ListItem>Cancellations must be made at least 24 hours before the game</ListItem>
                <ListItem>Late cancellations may result in forfeiture of coins</ListItem>
                <ListItem>No-shows will result in full coin deduction</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>6. User Conduct</Heading>
              <Text color="gray.700" mb={3}>
                Users agree not to:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Use the service for illegal activities</ListItem>
                <ListItem>Harass, abuse, or harm other users</ListItem>
                <ListItem>Share false or misleading information</ListItem>
                <ListItem>Attempt to hack or compromise our systems</ListItem>
                <ListItem>Create multiple accounts to circumvent restrictions</ListItem>
                <ListItem>Resell or transfer coins to other users</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>7. Intellectual Property</Heading>
              <Text color="gray.700">
                All content, features, and functionality of Galactiturf, including but not limited to 
                text, graphics, logos, and software, are owned by Galactiturf and protected by copyright, 
                trademark, and other intellectual property laws.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>8. Limitation of Liability</Heading>
              <Text color="gray.700">
                Galactiturf shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of our services. Our total liability shall 
                not exceed the amount paid by you for our services in the 12 months preceding the claim.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>9. Service Availability</Heading>
              <Text color="gray.700">
                We strive to maintain 99% uptime but do not guarantee uninterrupted access. We may 
                suspend services for maintenance, updates, or due to circumstances beyond our control.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>10. Modifications to Terms</Heading>
              <Text color="gray.700">
                We reserve the right to modify these Terms at any time. Changes will be effective 
                immediately upon posting. Continued use of our services constitutes acceptance of 
                the modified Terms.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>11. Termination</Heading>
              <Text color="gray.700">
                We may terminate or suspend your account at any time for violation of these Terms. 
                Upon termination, your right to use our services ceases immediately, and any unused 
                coins will be forfeited.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>12. Governing Law</Heading>
              <Text color="gray.700">
                These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes 
                will be resolved in the courts of Lagos State, Nigeria.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>13. Contact Information</Heading>
              <Text color="gray.700">
                For questions about these Terms, please contact us at:
                <br />
                Email: legal@galactiturf.com
                <br />
                Phone: +234 (0) 1234 567 890
                <br />
                Address: Lagos Island, Lagos State, Nigeria
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box w="full" p={6} bg="gray.50" rounded="lg">
          <Text fontSize="sm" color="gray.600" textAlign="center">
            By using Galactiturf, you acknowledge that you have read and understood these Terms of Service 
            and agree to be bound by them. These terms constitute a legally binding agreement between you and Galactiturf.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}