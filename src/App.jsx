import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getPreference } from './utils/cookieManager';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Pricing from './components/Pricing';

import { AuthProvider } from './context/AuthContext';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import MentorsPage from './pages/MentorsPage';
import SessionsPage from './pages/SessionsPage';
import MessagesPage from './pages/MessagesPage';

// Landing Page Wrapper
const LandingPage = () => (
  <SmoothScroll>
    <Navbar />
    <Hero />
    <Benefits />
    <HowItWorks />
    <Testimonials />
    <Pricing />
    <Footer />
  </SmoothScroll>
);

import SmoothScroll from './components/SmoothScroll';

// Separated for useLocation() access
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    // Global Theme Initialization
    const savedTheme = getPreference('theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AnimatedRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
