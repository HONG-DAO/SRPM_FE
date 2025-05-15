/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import VerificationDialog from '../components/Sign Up/VerificationDialog';

// import { handleGoogleResponse } from '../services/googleAuthService';
// import { findUserByEmail, saveUser } from '../services/userService';
// import GoogleForm from '../components/Sign Up/GoogleForm';
import DetailsForm from '../components/Sign Up/DetailsForm';
import { authService } from '../services/authService';
const logoImage = "/images/image1.png";
<img src={logoImage} alt="logo" />

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'verification' | 'details'>(
    'email'
  );
  const [email, setEmail] = useState('');
  const [showGoogleSignUpForm, setShowGoogleSignUpForm] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<{
    email: string;
    name: string;
    picture?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EmailSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format'
      ),
  });

  // const handleGoogleSuccess = async (response: any) => {
  //   try {
  //     // endpoint google
  //     window.location.href = '/auth/google/signup';
  //   } catch (error) {
  //     console.error('Google sign up error:', error);
  //     setError('Failed to sign up with Google');
  //   }
  // };

  // useEffect(() => {
  //   if (showGoogleSignUpForm && googleUserData) {
  //     console.log('Should show Google form:', {
  //       showGoogleSignUpForm,
  //       googleUserData,
  //     });
  //   }
  // }, [showGoogleSignUpForm, googleUserData]);

  const handleVerificationSuccess = () => {
    setStep('details');
  };

  const handleEmailSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Gửi email đăng ký
      await authService.sendOtp(values.email);
      setEmail(values.email);
      setStep('verification');
    } catch (err: any) {
      setError(err.message || 'Could not register email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="w-full mb-4">
  <button
    type="button"
    onClick={() => window.location.href = `${import.meta.env.VITE_API_URL.replace(/\/?$/, '')}/auth/google/signup` }
    className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
  >
    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
    <span>Sign up with Google</span>
  </button>
</div>
{/* {showGoogleSignUpForm && googleUserData ? (
        <GoogleForm
          email={googleUserData.email}
          name={googleUserData.name}
          picture={googleUserData.picture}
          onSubmit={async (values) => {
            try {
              await authService.completeRegistration({
                email: googleUserData.email,
                fullname: values.name,
                password: values.password,
                repeatPassword: values.confirmPassword,
                address: values.address,
              });
              navigate('/signin');
            } catch (error) {
              console.error('Error saving user:', error);
              alert('Failed to complete registration. Please try again.');
            }
          }}
          onCancel={() => {
            setShowGoogleSignUpForm(false);
            setGoogleUserData(null);
          }}
        />
      ) : ( */}
      <>
        {step === 'email' && (
          <div className="flex flex-col items-center mb-6">
            <img
              src={logoImage}
              alt="CNPM Logo"
              className="h-16 w-16 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            />
            <h2 className="text-2xl text-[#2C3E50] font-['SVN-Gotham-Regular']">
              Create your account
            </h2>
          </div>
        )}

        {step === 'email' && (
          <div className="space-y-6">
            <div
              className="w-full slide-up"
              style={{ '--delay': '0s' } as React.CSSProperties}
            >
              {/* <GoogleLogin
                // onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.error('Google Sign Up Failed');
                }}
                useOneTap
                type="standard"
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
              /> */}
            </div>

            <div
              className="relative my-6 fade-in"
              style={{ '--delay': '0.1s' } as React.CSSProperties}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]"></div>
              </div>
              <div className="relative flex justify-center text-[#2C3E50]">
                <span className="bg-[#FAF9F6] px-4 text-sm">OR</span>
              </div>
            </div>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={EmailSchema}
              onSubmit={handleEmailSubmit}
            >
              {({ errors, touched, handleChange }) => (
                <Form
                  className="space-y-3 slide-up-staggered"
                  style={{ '--delay': '0.2s' } as React.CSSProperties}
                >
                  <div className="space-y-2">
                    <Field
                      as={Input}
                      name="email"
                      type="email"
                      placeholder="Your email"
                      className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB]"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                      }}
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 bg-[#1569CB] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Continue'}
                  </Button>
                  {error && (
                    <div className="text-red-500 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="text-center text-sm">
                    <span className="text-gray-600">
                      Already have an account?{' '}
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/signin')}
                      className="text-[#1569CB] hover:underline font-medium"
                    >
                      Sign In
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        {step === 'verification' && (
          <VerificationDialog
            email={email}
            open={true}
            onClose={() => setStep('email')}
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}

        {step === 'details' && (
          <DetailsForm
            email={email}
            onSubmitSuccess={() => navigate('/signin')}
          />
        )}
      </>
      {/* )} */}
    </div>
  );
};

export default SignUpPage;
