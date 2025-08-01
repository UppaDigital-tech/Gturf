import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
      <Box flex="1" as="main">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default Layout;