import React from 'react';
import { Container, Heading, Text, Card, CardBody, VStack, Badge, Button } from '@chakra-ui/react';

const GameDetail: React.FC = () => {
  return (
    <Container maxW="4xl" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Heading>Game Details</Heading>
            <Text>Game detail page coming soon...</Text>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default GameDetail;