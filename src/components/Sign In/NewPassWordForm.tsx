import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface NewPasswordFormProps {
  onSubmit: (passwords: { newPassword: string; confirmPassword: string }) => Promise<void>;
  onBack: () => void;
  error?: string;
}

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

const NewPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
      'Password must meet all criteria'
    ),
  confirmPassword: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  onSubmit,
  onBack,
  error
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const validatePasswordCriteria = (password: string) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(value => value);
  };

  return (
    <Formik
      initialValues={{ newPassword: '', confirmPassword: '' }}
      validationSchema={NewPasswordSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => (
        <Form className="space-y-6 w-full max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Field
                  as={Input}
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB] text-center placeholder:text-center"
                  onFocus={() => setShowPasswordCriteria(true)}
                  onBlur={() => setShowPasswordCriteria(false)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    setFieldValue('newPassword', value);
                    validatePasswordCriteria(value);
                  }}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Field
                  as={Input}
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB] text-center placeholder:text-center"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {showPasswordCriteria && (
            <div className="bg-white p-4 rounded-lg shadow-md border">
              <div className="space-y-2">
                {/* Password criteria indicators */}
                {Object.entries(passwordCriteria).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {value ? 
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg> :
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    }
                    <span className="text-sm text-gray-600">
                      {key === 'length' && 'At least 8 characters'}
                      {key === 'uppercase' && 'At least one uppercase letter'}
                      {key === 'lowercase' && 'At least one lowercase letter'}
                      {key === 'number' && 'At least one number'}
                      {key === 'special' && 'At least one special character (!@#$%^&*)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full h-12 bg-[#1569CB] text-white mt-4">
            Reset Password
          </Button>
        </Form>
      )}
    </Formik>
  );
};