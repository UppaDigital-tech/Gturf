import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  useToast,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { useBackendWakeUp } from '../utils/wakeUpBackend';

const BackendStatus: React.FC = () => {
  const { wakeUp, forceWakeUp, getStatus } = useBackendWakeUp();
  const [status, setStatus] = useState(getStatus());
  const [isWakingUp, setIsWakingUp] = useState(false);
  const toast = useToast();

  // Update status every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, [getStatus]);

  const handleWakeUp = async () => {
    setIsWakingUp(true);
    try {
      const success = await wakeUp();
      if (success) {
        toast({
          title: 'Backend Woken Up',
          description: 'Backend is now active and ready to handle requests.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Wake Up Failed',
          description: 'Failed to wake up the backend. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while waking up the backend.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsWakingUp(false);
      setStatus(getStatus());
    }
  };

  const handleForceWakeUp = async () => {
    setIsWakingUp(true);
    try {
      const success = await forceWakeUp();
      if (success) {
        toast({
          title: 'Backend Force Woken Up',
          description: 'Backend has been forcefully woken up.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Force Wake Up Failed',
          description: 'Failed to force wake up the backend.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while force waking up the backend.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsWakingUp(false);
      setStatus(getStatus());
    }
  };

  const formatTime = (milliseconds: number) => {
    if (milliseconds === 0) return 'Never';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s ago`;
    } else {
      return `${seconds}s ago`;
    }
  };

  const getStatusColor = () => {
    if (status.isWakingUp) return 'yellow';
    if (status.needsWakeUp) return 'red';
    return 'green';
  };

  const getStatusText = () => {
    if (status.isWakingUp) return 'Waking Up';
    if (status.needsWakeUp) return 'Sleeping';
    return 'Active';
  };

  return (
    <Box
      position="fixed"
      bottom="4"
      right="4"
      bg="white"
      border="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p="3"
      boxShadow="md"
      zIndex="1000"
      minW="250px"
    >
      <VStack spacing="2" align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="sm" fontWeight="medium">
            Backend Status
          </Text>
          <Badge colorScheme={getStatusColor()} variant="subtle">
            {getStatusText()}
          </Badge>
        </HStack>

        <Box fontSize="xs" color="gray.600">
          <Text>Last wake up: {formatTime(status.timeSinceLastWakeUp)}</Text>
        </Box>

        <HStack spacing="2">
          <Tooltip label="Wake up backend if sleeping">
            <Button
              size="xs"
              colorScheme="blue"
              onClick={handleWakeUp}
              isLoading={isWakingUp}
              loadingText="Waking..."
              disabled={status.isWakingUp}
            >
              Wake Up
            </Button>
          </Tooltip>
          
          <Tooltip label="Force wake up backend (bypass cache)">
            <Button
              size="xs"
              colorScheme="orange"
              onClick={handleForceWakeUp}
              isLoading={isWakingUp}
              loadingText="Waking..."
              disabled={status.isWakingUp}
            >
              Force Wake
            </Button>
          </Tooltip>
        </HStack>

        {status.isWakingUp && (
          <HStack spacing="2" justify="center">
            <Spinner size="xs" />
            <Text fontSize="xs" color="gray.600">
              Waking up backend...
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default BackendStatus;