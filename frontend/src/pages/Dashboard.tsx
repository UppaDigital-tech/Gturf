import React, { useEffect, useState } from 'react';
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await authAPI.getDashboard();
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Welcome back, {user?.first_name}!
          </Heading>
          <Text color="gray.600">
            Here's what's happening with your account
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Coin Balance</StatLabel>
                <StatNumber>{user?.coin_balance}</StatNumber>
                <StatHelpText>Available coins</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Subscription Tier</StatLabel>
                <StatNumber>
                  <Badge colorScheme="blue" variant="subtle">
                    {user?.subscription_tier}
                  </Badge>
                </StatNumber>
                <StatHelpText>Current tier</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Bookings</StatLabel>
                <StatNumber>{dashboardData?.recent_bookings?.length || 0}</StatNumber>
                <StatHelpText>Active bookings</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Recent Bookings
            </Heading>
            {dashboardData?.recent_bookings?.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {dashboardData.recent_bookings.map((booking: any) => (
                  <HStack key={booking.id} justify="space-between" p={4} bg="gray.50" rounded="md">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{booking.game_name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(booking.game_date).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <Badge colorScheme="green">{booking.status}</Badge>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text color="gray.600">No recent bookings</Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Dashboard;