import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Box,
  Text,
  VStack,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react';
import { wakeUpService, WakeUpResponse } from '../services/wakeupService';

interface WakeUpStatusProps {
  onWakeUpComplete?: () => void;
  showManualWakeUp?: boolean;
}

export default function WakeUpStatus({ 
  onWakeUpComplete, 
  showManualWakeUp = false 
}: WakeUpStatusProps) {
  const [wakeUpStatus, setWakeUpStatus] = useState<WakeUpResponse | null>(null);
  const [isManualWakeUp, setIsManualWakeUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (wakeUpStatus?.status === 'waking') {
      // Simulate progress during wake-up
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev; // Don't complete until actual wake-up
          return prev + Math.random() * 10;
        });
      }, 500);
    } else {
      setProgress(0);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [wakeUpStatus?.status]);

  const handleManualWakeUp = async () => {
    setIsManualWakeUp(true);
    setProgress(10);
    
    try {
      setWakeUpStatus({ status: 'waking', message: 'Waking up backend server...' });
      
      const result = await wakeUpService.wakeUpWithRetries();
      setWakeUpStatus(result);
      
      if (result.status === 'awake') {
        setProgress(100);
        
        toast({
          title: 'Backend Ready!',
          description: `Server is awake and ready (${result.responseTime}ms)`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        // Call completion callback after a short delay
        setTimeout(() => {
          onWakeUpComplete?.();
        }, 1000);
      } else {
        toast({
          title: 'Wake-up Failed',
          description: result.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Manual wake-up failed:', error);
      setWakeUpStatus({
        status: 'error',
        message: 'Failed to wake up backend server'
      });
      
      toast({
        title: 'Wake-up Error',
        description: 'Failed to wake up backend server',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsManualWakeUp(false);
    }
  };

  const getAlertStatus = () => {
    switch (wakeUpStatus?.status) {
      case 'awake':
        return 'success';
      case 'waking':
        return 'info';
      case 'error':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getAlertTitle = () => {
    switch (wakeUpStatus?.status) {
      case 'awake':
        return 'Backend Ready!';
      case 'waking':
        return 'Waking Up Backend...';
      case 'error':
        return 'Wake-up Failed';
      default:
        return 'Backend Status';
    }
  };

  // Don't show anything if no status
  if (!wakeUpStatus && !showManualWakeUp) {
    return null;
  }

  return (
    <Box w="full" maxW="md" mx="auto" p={4}>
      {wakeUpStatus && (
        <Alert
          status={getAlertStatus()}
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          rounded="lg"
          mb={4}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {getAlertTitle()}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {wakeUpStatus.message}
            {wakeUpStatus.responseTime && (
              <Text fontSize="sm" color="gray.600" mt={1}>
                Response time: {wakeUpStatus.responseTime}ms
              </Text>
            )}
          </AlertDescription>
          
          {wakeUpStatus.status === 'waking' && (
            <Box w="full" mt={4}>
              <VStack spacing={2}>
                <Progress 
                  value={progress} 
                  w="full" 
                  colorScheme="blue" 
                  size="lg"
                  hasStripe
                  isAnimated
                />
                <Text fontSize="sm" color="gray.600">
                  This may take 30-60 seconds for the first request...
                </Text>
              </VStack>
            </Box>
          )}
        </Alert>
      )}

      {showManualWakeUp && (
        <VStack spacing={4}>
          <Box textAlign="center">
            <Text fontSize="md" color="gray.600" mb={2}>
              The backend server may be sleeping due to inactivity.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Click below to wake it up manually.
            </Text>
          </Box>
          
          <Button
            onClick={handleManualWakeUp}
            isLoading={isManualWakeUp}
            loadingText="Waking up server..."
            colorScheme="teal"
            size="lg"
            disabled={wakeUpStatus?.status === 'waking'}
          >
            {wakeUpStatus?.status === 'waking' ? 'Waking Up...' : 'Wake Up Backend'}
          </Button>
          
          <Text fontSize="xs" color="gray.400" textAlign="center">
            Free hosting services sleep after 15 minutes of inactivity.
            <br />
            This helps reduce server costs.
          </Text>
        </VStack>
      )}
    </Box>
  );
}

// Hook for easy status checking
export const useWakeUpStatus = () => {
  const [status, setStatus] = useState<WakeUpResponse | null>(null);
  
  const checkStatus = async () => {
    try {
      const isSleeping = await wakeUpService.isBackendSleeping();
      if (isSleeping) {
        setStatus({ status: 'waking', message: 'Backend appears to be sleeping' });
        const result = await wakeUpService.smartWakeUp();
        setStatus(result);
      } else {
        setStatus({ status: 'awake', message: 'Backend is ready' });
      }
    } catch (error) {
      setStatus({ status: 'error', message: 'Failed to check backend status' });
    }
  };

  return { status, checkStatus };
};