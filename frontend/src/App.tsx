import React from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import theme from './theme';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackendStatus from './components/BackendStatus';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import GameDetail from './pages/GameDetail';
import Subscriptions from './pages/Subscriptions';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <GameProvider>
          <SubscriptionProvider>
            <Router>
              <Box minH="100vh" display="flex" flexDirection="column">
                <Navbar />
                <Box flex="1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/games/:id" element={<GameDetail />} />
                    <Route path="/subscriptions" element={<Subscriptions />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/bookings"
                      element={
                        <ProtectedRoute>
                          <Bookings />
                        </ProtectedRoute>
                      }
                    />
                                         </Routes>
                     </Box>
                     <Footer />
                     <BackendStatus />
                   </Box>
                 </Router>
          </SubscriptionProvider>
        </GameProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
