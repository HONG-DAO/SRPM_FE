/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { saveUser } from '../../services/userService';
import { authService } from '../../services/authService';

interface UserDetailsFormProps {
  email: string;
  onSubmitSuccess: () => void;
}

const DetailsForm: React.FC<UserDetailsFormProps> = ({ email, onSubmitSuccess }) => {
  const [countdown, setCountdown] = useState(5);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const hideRequirementsAfterDelay = () => {
    if (Object.values(passwordRequirements).every(req => req)) {
      setTimeout(() => {
        setShowRequirements(false);
      }, 3000);
    }
  };

  const checkPasswordRequirements = (password: string) => {
    setShowRequirements(true);
    setPasswordRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    });
  };

  const DetailsSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    address: Yup.string()
      .required('Address is required')
      .min(5, 'Address must be at least 5 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/^(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter')
      .matches(/^(?=.*[0-9])/, 'Password must contain at least 1 number')
      .matches(/^(?=.*[!@#$%^&*])/, 'Password must contain at least 1 special character')
      .matches(/^(?=.*[a-z])/, 'Password must contain at least 1 lowercase letter'),
    confirmPassword: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onSubmitSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showSuccess, onSubmitSuccess]);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await authService.completeRegistration({
        email: values.email, 
        fullname: values.name,
        password: values.password,
        repeatPassword: values.confirmPassword,
        address: values.address
      });
      
      setShowSuccess(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showSuccess ? (
        <>
          <div className="flex flex-col items-center mb-6">
            <Link to="/" className="cursor-pointer">
              <img
                src="/images/logomain.svg"
                alt="CNPM Logo"
                className="h-16 w-16 mb-4 hover:opacity-80 transition-opacity"
              />
            </Link>
            <h2 className="text-2xl text-[#2C3E50] font-['SVN-Gotham-Regular']">
              Complete Your Profile
            </h2>
          </div>

          <Formik
            initialValues={{
              name: '',
              address: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={DetailsSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, handleChange, handleBlur, values }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Full Name"
                    allowNumbers={false}
                    className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB]"
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                  )}
                </div>

                <div>
                  <Field
                    as={Input}
                    name="address"
                    placeholder="Address"
                    className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB]"
                  />
                  {errors.address && touched.address && (
                    <div className="text-red-500 text-sm mt-1">{errors.address}</div>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Field
                      as={Input}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create Password"
                      className="w-full h-12 px-4 pr-12 rounded-md border border-gray-200 focus:border-[#1569CB]"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        checkPasswordRequirements(e.target.value);
                      }}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        handleBlur(e);
                        hideRequirementsAfterDelay();
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {showRequirements && values.password && (
                    <div className="text-sm mt-1 space-y-1">
                      <p className={`${passwordRequirements.length ? 'text-green-500' : 'text-red-500'}`}>
                        • At least 8 characters
                      </p>
                      <p className={`${passwordRequirements.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                        • At least 1 uppercase letter
                      </p>
                      <p className={`${passwordRequirements.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                        • At least 1 lowercase letter
                      </p>
                      <p className={`${passwordRequirements.number ? 'text-green-500' : 'text-red-500'}`}>
                        • At least 1 number
                      </p>
                      <p className={`${passwordRequirements.special ? 'text-green-500' : 'text-red-500'}`}>
                        • At least 1 special character
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Field
                      as={Input}
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full h-12 px-4 pr-12 rounded-md border border-gray-200 focus:border-[#1569CB]"
                      onFocus={() => {
                        if (Object.values(passwordRequirements).every(req => req)) {
                          setShowRequirements(false);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#1569CB] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
                </Button>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <div className="text-center space-y-6">
          <h2 className="text-2xl text-[#2C3E50]">Account Created Successfully!</h2>
          <p className="text-[#2C3E50]">
            Redirecting to sign in page in {countdown} seconds...
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailsForm;