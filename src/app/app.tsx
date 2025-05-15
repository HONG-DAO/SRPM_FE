import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AuthProvider } from '@cnpm/context/AuthContext';
import SignInPage from '@cnpm/pages/SignInPage';
import SignUpPage from '@cnpm/pages/SignUpPage';
import AuthLayout from '@cnpm/components/Protect/AuthLayout';
import { PublicRoute } from '@cnpm/components/Protect/PublicRoute';

export function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/signin" replace />} />

            <Route element={<PublicRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
