import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Card,
  CardBody,
  Link,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '6', md: '8' }}>
      <Card>
        <CardBody>
          <VStack spacing="8">
            <VStack spacing="6" textAlign="center">
              <Heading size="lg">Welcome back</Heading>
              <Text color="gray.600">
                Sign in to your account to continue booking football games
              </Text>
            </VStack>

            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack spacing="6">
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  isLoading={loading}
                >
                  Sign In
                </Button>
              </VStack>
            </Box>

            <VStack spacing="4">
              <Text fontSize="sm" color="gray.600">
                Don't have an account?{' '}
                <Link as={RouterLink} to="/register" color="brand.500">
                  Sign up
                </Link>
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;