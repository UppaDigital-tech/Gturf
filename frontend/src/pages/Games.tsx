import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';

const Games: React.FC = () => {
  const { games, loading, fetchGames } = useGame();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleBookGame = async (gameId: number) => {
    try {
      // This would be implemented with the booking functionality
      toast({
        title: 'Booking feature coming soon!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Booking failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Available Games
          </Heading>
          <Text color="gray.600">
            Browse and book football games in your area
          </Text>
        </Box>

        {loading ? (
          <Text>Loading games...</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {games.map((game) => (
              <Card key={game.id}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Heading size="md" mb={2}>
                        {game.name}
                      </Heading>
                      <Text color="gray.600" mb={2}>
                        {game.location}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(game.date_time).toLocaleString()}
                      </Text>
                    </Box>

                    <HStack justify="space-between">
                      <Badge colorScheme="blue">{game.coin_price} coins</Badge>
                      <Badge colorScheme={game.is_full ? 'red' : 'green'}>
                        {game.available_slots} slots left
                      </Badge>
                    </HStack>

                    <Text fontSize="sm" color="gray.600">
                      {game.description}
                    </Text>

                    <Button
                      colorScheme="brand"
                      isDisabled={game.is_full || !user}
                      onClick={() => handleBookGame(game.id)}
                    >
                      {game.is_full ? 'Full' : 'Book Game'}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default Games;