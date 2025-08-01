import React from 'react';
import { Container, Heading, Text, Card, CardBody, VStack } from '@chakra-ui/react';

const Profile: React.FC = () => {
  return (
    <Container maxW="4xl" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Heading>Profile</Heading>
            <Text>User profile management page coming soon...</Text>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Profile;