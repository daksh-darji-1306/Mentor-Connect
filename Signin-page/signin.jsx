import React, { useState } from 'react';

// --- SVG Icons (Self-contained for stability) ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);

// CSS for animations
const GlobalStyles = () => (
  <style>{`
    @keyframes slideInFromLeft {
      0% { transform: translateX(-100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideInFromRight {
      0% { transform: translateX(100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-left {
      animation: slideInFromLeft 0.8s ease-out forwards;
    }
    .animate-slide-in-right {
      animation: slideInFromRight 0.8s ease-out forwards;
    }
  `}</style>
);


// Main App Component
export default function App() {
  // State to manage the selected user role
  const [role, setRole] = useState('mentee');

  // Component for Social Login Buttons for better reusability
  const SocialButton = ({ icon, brandColor, href, 'aria-label': ariaLabel }) => (
    <a
      href={href}
      aria-label={ariaLabel}
      className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-full text-gray-700 transition-all duration-300 hover:scale-110 hover:text-white"
      style={{'--brand-color': brandColor}}
      onMouseOver={e => e.currentTarget.style.backgroundColor = brandColor}
      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {icon}
    </a>
  );

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ backgroundColor: '#192231' }}>
        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Form Panel with Animation */}
          <div 
            className="w-full md:w-1/2 p-8 md:p-12 animate-slide-in-left"
            style={{ backgroundColor: '#ddd6fe' }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Welcome Back!</h1>
            <p className="text-gray-600 mb-8">Sign in to continue your journey.</p>

            <form 
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const data = Object.fromEntries(formData.entries());
                console.log({ ...data, role });
              }}
            >
              <fieldset>
                <legend className="text-sm font-medium text-gray-700">Sign in as a...</legend>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {['mentee', 'mentor'].map((value) => (
                    <div key={value}>
                      <input
                        type="radio"
                        id={`role-${value}`}
                        name="role"
                        value={value}
                        checked={role === value}
                        onChange={(e) => setRole(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`role-${value}`}
                        className="flex items-center justify-center text-center py-3 px-4 bg-violet-50 border-2 rounded-lg cursor-pointer w-full transition-all duration-200 active:scale-95"
                        style={{
                          borderColor: role === value ? '#192231' : '#c4b5fd',
                          boxShadow: role === value ? '0 0 0 2px rgba(25, 34, 49, 0.4)' : 'none'
                        }}
                      >
                        <span className="text-sm font-semibold text-gray-700 capitalize">{value}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  className="mt-1 block w-full px-4 py-3 bg-white border-2 border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-200 focus:scale-105 focus:border-gray-800"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="mt-1 block w-full px-4 py-3 bg-white border-2 border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-200 focus:scale-105 focus:border-gray-800"
                />
              </div>
              
              <div className="flex items-center justify-between">
                  <div className="flex items-center">
                      <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-gray-800 focus:ring-gray-700 border-gray-400 rounded" />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                  </div>
                  <div className="text-sm">
                      <a href="#" className="font-medium text-gray-800 hover:text-gray-900 hover:underline">Forgot password?</a>
                  </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95"
                style={{ backgroundColor: '#192231' }}
              >
                Sign In
              </button>
              
              <div className="relative flex py-2 items-center" aria-hidden="true">
                  <div className="flex-grow border-t border-violet-300"></div>
                  <span className="flex-shrink mx-4 text-gray-500 text-sm">Or sign in with</span>
                  <div className="flex-grow border-t border-violet-300"></div>
              </div>

              <div className="flex justify-center space-x-4">
                  <SocialButton icon={<GoogleIcon />} brandColor="#FFFFFF" href="#" aria-label="Sign in with Google" />
                  <SocialButton icon={<LinkedinIcon />} brandColor="#0077B5" href="#" aria-label="Sign in with LinkedIn" />
                  <SocialButton icon={<GithubIcon />} brandColor="#333" href="#" aria-label="Sign in with GitHub" />
              </div>

              <p className="text-center text-sm text-gray-600 mt-8">
                  Don't have an account? <a href="#" className="font-medium text-gray-800 hover:text-gray-900 hover:underline">Sign up</a>
              </p>
            </form>
          </div>

          <div 
              className="hidden md:block w-1/2 animate-slide-in-right"
          >
            <img 
              src="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=2670&auto=format&fit=crop" 
              alt="Mentor guiding a mentee on a laptop" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x1200/192231/ddd6fe?text=Mentorship'; }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
