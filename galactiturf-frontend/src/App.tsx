import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
// import Dashboard from './pages/Dashboard';
// import Games from './pages/Games';
// import GameDetail from './pages/GameDetail';
// import Subscriptions from './pages/Subscriptions';
// import Profile from './pages/Profile';
// import Bookings from './pages/Bookings';
// import Transactions from './pages/Transactions';

function App() {
  return (
    <ChakraProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* Public Game Routes */}
                {/* <Route path="/games" element={<Games />} />
                <Route path="/games/:id" element={<GameDetail />} />
                <Route path="/subscriptions" element={<Subscriptions />} /> */}
                
                {/* Protected Routes */}
                {/* <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                } />
                <Route path="/transactions" element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                } /> */}
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ChakraProvider>
  );
}

export default App;
