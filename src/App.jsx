import React, { useState, useEffect } from 'react';
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
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CalendarProvider } from './context/CalendarContext';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import MentorsPage from './pages/MentorsPage';
import SessionsPage from './pages/SessionsPage';
import MessagesPage from './pages/MessagesPage';
import WaitlistModal from './components/WaitlistModal';

// Landing Page Wrapper

const LandingPage = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);

  return (
    <SmoothScroll>
      <Navbar onOpenWaitlist={() => setShowWaitlist(true)} />
      <Hero onOpenWaitlist={() => setShowWaitlist(true)} />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Footer />
      <WaitlistModal isOpen={showWaitlist} onClose={() => setShowWaitlist(false)} />
    </SmoothScroll>
  );
};

import SmoothScroll from './components/SmoothScroll';

import Onboarding from './pages/Onboarding';

// Separated for useLocation() access
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder'}>
      <CalendarProvider>
        <Router>
          <AuthProvider>
            <div className="App">
              <AnimatedRoutes />
            </div>
          </AuthProvider>
        </Router>
      </CalendarProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
