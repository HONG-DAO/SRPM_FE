/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  onGoogleSuccess: (response: any) => Promise<void>;
  onForgotPassword: (email: string) => void;
  onSignUpClick: () => void;
  errorMessage?: string;
  isLoading?: boolean;
  isSendingOTP?: boolean;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters'),
});

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onGoogleSuccess,
  onForgotPassword,
  onSignUpClick,
  errorMessage,
  isLoading,
  isSendingOTP
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [signUpError, setSignUpError] = React.useState<string | null>(null);

  // Redirect login Google
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL.replace(/\/?$/, '')}/auth/google/signin`;
  };

  // Redirect signup Google and validate email domain
  const handleGoogleSignUp = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/google/signup-url`);
      const googlePopup = window.open(res.data.url, '_blank', 'width=500,height=600');

      // Optional: communicate back from popup to main app
      window.addEventListener('message', (event) => {
        const email = event.data?.email;
        if (typeof email === 'string') {
          if (email.endsWith('@fe.edu.vn')) {
            onSignUpClick();
          } else {
            setSignUpError('Bạn chỉ có thể đăng ký bằng email có đuôi @fe.edu.vn');
          }
        }
      });
    } catch (error) {
      setSignUpError('Lỗi khi kết nối đăng ký Google.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="w-full mb-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>
      </div>

      <div className="w-full mb-4">
        <button
          type="button"
          onClick={handleGoogleSignUp}
          className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <GoogleIcon />
          <span>Sign up with @fe.edu.vn</span>
        </button>
        {signUpError && (
          <div className="text-red-500 text-sm text-center mt-2">{signUpError}</div>
        )}
      </div>

      <Divider />

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignInSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values }) => (
          <Form className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Field
                as={Input}
                name="email"
                type="email"
                placeholder="Your email"
                className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB]"
              />
              {errors.email && touched.email && (
                <div className="text-red-500 text-sm">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <Field
                as={Input}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB]"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (emailRegex.test(values.email)) {
                    onForgotPassword(values.email);
                  }
                }}
                className="text-gray-600 hover:text-[#1569CB] text-sm"
              >
                Forgot your password?
              </button>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm text-center">{errorMessage}</div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#1569CB] text-white"
              disabled={isLoading || isSendingOTP}
            >
              {isSendingOTP ? 'Sending OTP...' : isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={onSignUpClick}
                className="text-[#1569CB] hover:underline font-medium"
              >
                Sign Up
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Divider = () => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-[#E5E7EB]"></div>
    </div>
    <div className="relative flex justify-center text-[#2C3E50]">
      <span className="bg-[#FAF9F6] px-4 text-sm">OR</span>
    </div>
  </div>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#FFC107" d="..." />
    <path fill="#FF3D00" d="..." />
    <path fill="#4CAF50" d="..." />
    <path fill="#1976D2" d="..." />
  </svg>
);
