import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

export default function Privacy() {
  return (
    <Container maxW="4xl" py={12}>
      <VStack spacing={8} align="start">
        <Box textAlign="center" w="full">
          <Heading fontSize={{ base: '3xl', md: '4xl' }} mb={4}>
            Privacy Policy
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Last updated: January 15, 2024
          </Text>
        </Box>

        <Box w="full">
          <Text fontSize="lg" color="gray.700" mb={6}>
            At Galactiturf, we are committed to protecting your privacy and personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
            when you use our platform.
          </Text>

          <VStack spacing={6} align="start">
            <Box>
              <Heading fontSize="xl" mb={3}>1. Information We Collect</Heading>
              
              <Heading fontSize="lg" mb={2} color="teal.600">Personal Information</Heading>
              <Text color="gray.700" mb={3}>
                We collect information you provide directly to us, including:
              </Text>
              <UnorderedList spacing={2} ml={6} mb={4}>
                <ListItem>Name, email address, and phone number</ListItem>
                <ListItem>Account credentials (username and password)</ListItem>
                <ListItem>Date of birth and profile information</ListItem>
                <ListItem>Payment information (processed securely through Paystack)</ListItem>
                <ListItem>Communication preferences</ListItem>
              </UnorderedList>

              <Heading fontSize="lg" mb={2} color="teal.600">Usage Information</Heading>
              <Text color="gray.700" mb={3}>
                We automatically collect certain information about your use of our services:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Device information (IP address, browser type, operating system)</ListItem>
                <ListItem>Usage patterns and preferences</ListItem>
                <ListItem>Game booking history and preferences</ListItem>
                <ListItem>Log data and cookies</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>2. How We Use Your Information</Heading>
              <Text color="gray.700" mb={3}>
                We use the collected information for the following purposes:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Provide, operate, and maintain our services</ListItem>
                <ListItem>Process transactions and manage your account</ListItem>
                <ListItem>Send booking confirmations and important updates</ListItem>
                <ListItem>Improve our platform and develop new features</ListItem>
                <ListItem>Provide customer support and respond to inquiries</ListItem>
                <ListItem>Detect and prevent fraud or unauthorized access</ListItem>
                <ListItem>Comply with legal obligations</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>3. Information Sharing and Disclosure</Heading>
              <Text color="gray.700" mb={3}>
                We do not sell, trade, or rent your personal information. We may share information in the following circumstances:
              </Text>
              
              <Heading fontSize="lg" mb={2} color="teal.600">Service Providers</Heading>
              <Text color="gray.700" mb={3}>
                We share information with trusted third-party service providers who assist us in:
              </Text>
              <UnorderedList spacing={2} ml={6} mb={4}>
                <ListItem>Payment processing (Paystack)</ListItem>
                <ListItem>Cloud hosting and data storage</ListItem>
                <ListItem>Email communications</ListItem>
                <ListItem>Analytics and performance monitoring</ListItem>
              </UnorderedList>

              <Heading fontSize="lg" mb={2} color="teal.600">Legal Requirements</Heading>
              <Text color="gray.700" mb={3}>
                We may disclose information when required by law or to:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Comply with legal processes or government requests</ListItem>
                <ListItem>Protect our rights, property, or safety</ListItem>
                <ListItem>Investigate potential violations of our Terms of Service</ListItem>
                <ListItem>Prevent fraud or illegal activities</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>4. Data Security</Heading>
              <Text color="gray.700" mb={3}>
                We implement appropriate security measures to protect your information:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem>Encryption of sensitive data in transit and at rest</ListItem>
                <ListItem>Secure payment processing through certified providers</ListItem>
                <ListItem>Regular security audits and monitoring</ListItem>
                <ListItem>Access controls and authentication protocols</ListItem>
                <ListItem>Staff training on data protection best practices</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>5. Data Retention</Heading>
              <Text color="gray.700">
                We retain your personal information for as long as necessary to provide our services 
                and fulfill the purposes outlined in this policy. We may retain certain information 
                for longer periods when required by law or for legitimate business purposes such as 
                fraud prevention and compliance.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>6. Your Rights and Choices</Heading>
              <Text color="gray.700" mb={3}>
                You have the following rights regarding your personal information:
              </Text>
              <UnorderedList spacing={2} ml={6}>
                <ListItem><strong>Access:</strong> Request copies of your personal information</ListItem>
                <ListItem><strong>Correction:</strong> Request correction of inaccurate information</ListItem>
                <ListItem><strong>Deletion:</strong> Request deletion of your personal information</ListItem>
                <ListItem><strong>Portability:</strong> Request transfer of your data to another service</ListItem>
                <ListItem><strong>Opt-out:</strong> Unsubscribe from marketing communications</ListItem>
                <ListItem><strong>Restriction:</strong> Request limitation of data processing</ListItem>
              </UnorderedList>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>7. Cookies and Tracking Technologies</Heading>
              <Text color="gray.700" mb={3}>
                We use cookies and similar technologies to:
              </Text>
              <UnorderedList spacing={2} ml={6} mb={3}>
                <ListItem>Remember your preferences and settings</ListItem>
                <ListItem>Analyze usage patterns and improve our services</ListItem>
                <ListItem>Provide personalized content and features</ListItem>
                <ListItem>Measure the effectiveness of our marketing</ListItem>
              </UnorderedList>
              <Text color="gray.700">
                You can control cookies through your browser settings, but some features may not 
                function properly if cookies are disabled.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>8. Third-Party Links</Heading>
              <Text color="gray.700">
                Our platform may contain links to third-party websites or services. We are not 
                responsible for the privacy practices or content of these external sites. We encourage 
                you to review the privacy policies of any third-party services you visit.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>9. Children's Privacy</Heading>
              <Text color="gray.700">
                Our services are not intended for children under 16 years of age. We do not knowingly 
                collect personal information from children under 16. If we become aware that we have 
                collected such information, we will take steps to delete it promptly.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>10. International Data Transfers</Heading>
              <Text color="gray.700">
                Your information may be transferred to and processed in countries other than Nigeria. 
                We ensure appropriate safeguards are in place to protect your information in accordance 
                with applicable data protection laws.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>11. Changes to This Privacy Policy</Heading>
              <Text color="gray.700">
                We may update this Privacy Policy periodically. We will notify you of any material 
                changes by posting the updated policy on our platform and updating the "Last updated" 
                date. Your continued use of our services constitutes acceptance of the updated policy.
              </Text>
            </Box>

            <Box>
              <Heading fontSize="xl" mb={3}>12. Contact Us</Heading>
              <Text color="gray.700">
                If you have questions about this Privacy Policy or our data practices, please contact us:
                <br /><br />
                <strong>Galactiturf Privacy Team</strong><br />
                Email: privacy@galactiturf.com<br />
                Phone: +234 (0) 1234 567 890<br />
                Address: Lagos Island, Lagos State, Nigeria<br /><br />
                For data protection inquiries, please include "Privacy Request" in the subject line.
              </Text>
            </Box>
          </VStack>
        </Box>

        <Box w="full" p={6} bg="teal.50" rounded="lg" border="1px solid" borderColor="teal.200">
          <Text fontSize="sm" color="gray.700" textAlign="center">
            <strong>Your Privacy Matters:</strong> We are committed to transparency in our data practices. 
            If you have any concerns about how we handle your information, please don't hesitate to contact us. 
            We're here to help and ensure your privacy is protected.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}