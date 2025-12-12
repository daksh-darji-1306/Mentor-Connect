import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Landing Page Wrapper
const LandingPage = () => (
  <>
    <Navbar />
    <Hero />
    <Benefits />
    <HowItWorks />
    <Testimonials />
    <Pricing />
    <Footer />
  </>
);

import SmoothScroll from './components/SmoothScroll';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SmoothScroll>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Routes>
          </div>
        </SmoothScroll>
      </AuthProvider>
    </Router>
  );
}

export default App;
