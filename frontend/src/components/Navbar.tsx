import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  useDisclosure,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Container,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Container maxW="container.xl">
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <Button
              onClick={onToggle}
              py={2}
              px={4}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            >
              <Text>☰</Text>
            </Button>
          </Flex>

          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
              fontSize="xl"
              fontWeight="bold"
              as={RouterLink}
              to="/"
            >
              ⚽ Galactiturf
            </Text>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <Stack direction={'row'} spacing={4}>
                <Box
                  as={RouterLink}
                  to="/games"
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                >
                  Games
                </Box>
                <Box
                  as={RouterLink}
                  to="/subscriptions"
                  px={2}
                  py={1}
                  rounded={'md'}
                  _hover={{
                    textDecoration: 'none',
                    bg: useColorModeValue('gray.200', 'gray.700'),
                  }}
                >
                  Subscriptions
                </Box>
              </Stack>
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            {user ? (
              <Flex align="center" gap={4}>
                <Badge colorScheme="green" variant="subtle">
                  {user.coin_balance} coins
                </Badge>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                  >
                    <Avatar size={'sm'} name={`${user.first_name} ${user.last_name}`} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={RouterLink} to="/dashboard">
                      Dashboard
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/profile">
                      Profile
                    </MenuItem>
                    <MenuItem as={RouterLink} to="/bookings">
                      My Bookings
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'link'}
                  to={'/login'}
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'brand.500'}
                  to={'/register'}
                  _hover={{
                    bg: 'brand.600',
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Container>
      </Flex>

      {/* Mobile menu */}
      <Box display={{ base: isOpen ? 'block' : 'none', md: 'none' }}>
        <Stack
          bg={useColorModeValue('white', 'gray.800')}
          p={4}
          display={{ md: 'none' }}
        >
          <Box
            as={RouterLink}
            to="/games"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
              textDecoration: 'none',
              bg: useColorModeValue('gray.200', 'gray.700'),
            }}
          >
            Games
          </Box>
          <Box
            as={RouterLink}
            to="/subscriptions"
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
              textDecoration: 'none',
              bg: useColorModeValue('gray.200', 'gray.700'),
            }}
          >
            Subscriptions
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Navbar;