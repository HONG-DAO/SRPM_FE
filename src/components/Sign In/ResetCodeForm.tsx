import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ResetCodeFormProps {
  onSubmit: (code: string) => void;
  onResendCode: () => void;
  onBack: () => void;
  resendTimer: number;
  error?: string;
  isLoading?: boolean;
}

const ResetCodeSchema = Yup.object().shape({
  code: Yup.string()
    .required('Required')
    .matches(/^\d{6}$/, 'Code must be exactly 6 digits')
});

export const ResetCodeForm: React.FC<ResetCodeFormProps> = ({
  onSubmit,
  onResendCode,
  onBack,
  resendTimer,
  error,
  isLoading
}) => {
  return (
    <Formik
      initialValues={{ code: '' }}
      onSubmit={(values) => {
        if (values.code.length === 6) {
          onSubmit(values.code);
        }
      }}
    >
      {({ setFieldValue, values }) => (
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
          
          <p className="text-center text-gray-600 mb-4">
            We have just sent the code to your email, please check and enter it below
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 w-full">
              <div className="flex-grow relative">
                <Field
                  as={Input}
                  name="code"
                  type="text"
                  maxLength={6}
                  placeholder="Enter your code"
                  className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB] text-center placeholder:text-center"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    const truncatedValue = value.slice(0, 6);
                    setFieldValue('code', truncatedValue);
                  }}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const truncatedValue = pastedText.slice(0, 6);
                    setFieldValue('code', truncatedValue);
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={onResendCode}
                disabled={resendTimer > 0 || isLoading}
                className="h-12 w-[90px] flex-shrink-0 border border-gray-200 hover:bg-gray-50"
              >
                {isLoading ? 'Sending...' : resendTimer > 0 ? `(${resendTimer}s)` : 'Resend'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button 
            type="submit"
            disabled={values.code.length !== 6}
            className="w-full h-12 bg-[#1569CB] text-white hover:bg-[#1254A3] transition-colors mt-6"
            onClick={() => {
              if (values.code.length === 6) {
                onSubmit(values.code);
              }
            }}
          >
            Continue
          </Button>
        </Form>
      )}
    </Formik>
  );
};