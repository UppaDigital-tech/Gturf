import React, { useState } from 'react';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Link,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { LoginData } from '../types';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const [apiError, setApiError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setApiError('');
      await login(data);
      navigate(from, { replace: true });
    } catch (error: any) {
      setApiError(
        error.response?.data?.error || 
        error.response?.data?.non_field_errors?.[0] ||
        'Login failed. Please try again.'
      );
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg="gray.50"
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign in to your account
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy amazing football games ⚽
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg="white"
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            {apiError && (
              <Alert status="error">
                <AlertIcon />
                {apiError}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    {...register('username')}
                    placeholder="Enter your username"
                  />
                  <FormErrorMessage>
                    {errors.username?.message}
                  </FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    {...register('password')}
                    placeholder="Enter your password"
                  />
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                </FormControl>
                
                <Stack spacing={10} pt={2}>
                  <Button
                    type="submit"
                    size="lg"
                    bg={'teal.400'}
                    color={'white'}
                    _hover={{
                      bg: 'teal.500',
                    }}
                    isLoading={isSubmitting}
                    loadingText="Signing in..."
                  >
                    Sign In
                  </Button>
                </Stack>
              </Stack>
            </form>
            
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account?{' '}
                <Link as={RouterLink} to="/register" color={'teal.400'}>
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}