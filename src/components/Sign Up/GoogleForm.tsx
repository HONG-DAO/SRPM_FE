/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { authService } from '../../services/authService';

interface GoogleSignUpFormProps {
  email: string;
  name: string;
  picture?: string;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const GoogleSignUpSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[A-Z])/, 'Must contain at least 1 uppercase letter')
    .matches(/^(?=.*[0-9])/, 'Must contain at least 1 number')
    .matches(/^(?=.*[!@#$%^&*])/, 'Must contain at least 1 special character')
    .matches(/^(?=.*[a-z])/, 'Must contain at least 1 lowercase letter'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const GoogleSignUpForm: React.FC<GoogleSignUpFormProps> = ({
  email,
  name,
  picture,
  onSubmit,
  onCancel
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      await authService.completeRegistration({
        email,
        fullname: values.name,
        password: values.password,
        repeatPassword: values.confirmPassword,
        address: values.address
      });
      onSubmit(values);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to complete registration. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto space-y-4">
      <div className="text-center mb-6">
        {picture ? (
          <img
            src={picture}
            alt="Profile"
            className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white shadow-md"
            onError={(e) => {
              const imgElement = e.currentTarget as HTMLImageElement;
              const fallbackDiv = document.createElement('div');
              fallbackDiv.className = 'w-16 h-16 rounded-full mx-auto mb-3 bg-gray-200 flex items-center justify-center';
              fallbackDiv.innerHTML = `<span class="text-xl text-gray-500">${name?.charAt(0)?.toUpperCase() || '?'}</span>`;
              imgElement.parentNode?.replaceChild(fallbackDiv, imgElement);
            }}
          />
        ) : (
          <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gray-200 flex items-center justify-center">
            <span className="text-xl text-gray-500">
              {name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
        <h2 className="text-xl font-['SVN-Gotham-Regular'] text-[#2C3E50] mb-1">
          Complete Your Profile
        </h2>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <Formik
        initialValues={{
          name: name || '',
          address: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={GoogleSignUpSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="space-y-3">
            <div>
              <Input
                name="name"
                type="text"
                placeholder="Your name"
                preventSpecialChars={true}
                allowNumbers={false}
                className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB]"
              />
              {errors.name && touched.name && (
                <div className="text-xs text-red-500 mt-1">{errors.name}</div>
              )}
            </div>

            <div>
              <Input
                name="address"
                type="text"
                placeholder="Your address"
                preventSpecialChars={true}
                className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB]"
              />
              {errors.address && touched.address && (
                <div className="text-xs text-red-500 mt-1">{errors.address}</div>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  className="w-full h-12 px-4 pr-12 rounded-md border border-gray-200 focus:border-[#1569CB]"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handlePasswordChange(e);
                    setFieldValue('password', e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <div className="text-xs text-red-500 mt-1">{errors.password}</div>
              )}
              <div className="mt-1.5 space-y-0.5 text-xs">
                <div className={`flex items-center ${passwordCriteria.length ? 'text-green-500' : 'text-gray-500'}`}>
                  <span className="mr-1.5">{passwordCriteria.length ? '✓' : '○'}</span>
                  At least 8 characters
                </div>
                <div className={`flex items-center ${passwordCriteria.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
                  <span className="mr-1.5">{passwordCriteria.uppercase ? '✓' : '○'}</span>
                  One uppercase letter
                </div>
                <div className={`flex items-center ${passwordCriteria.lowercase ? 'text-green-500' : 'text-gray-500'}`}>
                  <span className="mr-1.5">{passwordCriteria.lowercase ? '✓' : '○'}</span>
                  One lowercase letter
                </div>
                <div className={`flex items-center ${passwordCriteria.number ? 'text-green-500' : 'text-gray-500'}`}>
                  <span className="mr-1.5">{passwordCriteria.number ? '✓' : '○'}</span>
                  One number
                </div>
                <div className={`flex items-center ${passwordCriteria.special ? 'text-green-500' : 'text-gray-500'}`}>
                  <span className="mr-1.5">{passwordCriteria.special ? '✓' : '○'}</span>
                  One special character
                </div>
              </div>
            </div>

            <div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="w-full h-12 px-4 pr-12 rounded-md border border-gray-200 focus:border-[#1569CB]"
                  onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <div className="text-xs text-red-500 mt-1">{errors.confirmPassword}</div>
              )}
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full h-9 text-sm border border-gray-200 hover:bg-gray-50 text-gray-600"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full h-9 text-sm bg-[#1569CB] hover:bg-[#1254A3] text-white transition-colors"
              >
                Complete Sign Up
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default GoogleSignUpForm; 