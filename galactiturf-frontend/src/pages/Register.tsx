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
  SimpleGrid,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types';

const schema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Email is invalid'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  password_confirm: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export default function Register() {
  const [apiError, setApiError] = useState<string>('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      setApiError('');
      await registerUser(data);
      navigate('/dashboard');
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData) {
        // Handle field-specific errors
        const fieldErrors = Object.entries(errorData)
          .filter(([key]) => key !== 'non_field_errors')
          .map(([key, value]: [string, any]) => `${key}: ${Array.isArray(value) ? value[0] : value}`)
          .join(', ');
        
        setApiError(
          errorData.non_field_errors?.[0] || 
          fieldErrors ||
          'Registration failed. Please try again.'
        );
      } else {
        setApiError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg="gray.50"
    >
      <Stack spacing={8} mx={'auto'} maxW={'2xl'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Create your account
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Join the football community! ⚽
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
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.first_name}>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      {...register('first_name')}
                      placeholder="Enter your first name"
                    />
                    <FormErrorMessage>
                      {errors.first_name?.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.last_name}>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      {...register('last_name')}
                      placeholder="Enter your last name"
                    />
                    <FormErrorMessage>
                      {errors.last_name?.message}
                    </FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    {...register('username')}
                    placeholder="Choose a username"
                  />
                  <FormErrorMessage>
                    {errors.username?.message}
                  </FormErrorMessage>
                </FormControl>
                
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                  />
                  <FormErrorMessage>
                    {errors.email?.message}
                  </FormErrorMessage>
                </FormControl>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      {...register('password')}
                      placeholder="Create a password"
                    />
                    <FormErrorMessage>
                      {errors.password?.message}
                    </FormErrorMessage>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors.password_confirm}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      {...register('password_confirm')}
                      placeholder="Confirm your password"
                    />
                    <FormErrorMessage>
                      {errors.password_confirm?.message}
                    </FormErrorMessage>
                  </FormControl>
                </SimpleGrid>
                
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
                    loadingText="Creating account..."
                  >
                    Create Account
                  </Button>
                </Stack>
              </Stack>
            </form>
            
            <Stack pt={6}>
              <Text align={'center'}>
                Already have an account?{' '}
                <Link as={RouterLink} to="/login" color={'teal.400'}>
                  Sign in
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}