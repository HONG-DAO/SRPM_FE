/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { handleGoogleResponse } from '../services/googleAuthService';
// import { findUserByEmail, setCurrentUser } from '../services/userService';
import { authService } from '../services/authService';



import { LoginForm } from '../components/Sign In/LoginForm';
import { ResetCodeForm } from '../components/Sign In/ResetCodeForm';
import { NewPasswordForm } from '../components/Sign In/NewPassWordForm';
import GoogleForm from '../components/Sign Up/GoogleForm';


type SignInStep = 'signin' | 'reset-code' | 'new-password';
const logoImage = "/images/image1.png";
<img src={logoImage} alt="logo" />


const SignInPage: React.FC = () => {
 const navigate = useNavigate();
 const [currentStep, setCurrentStep] = useState<SignInStep>('signin');
 const [email, setEmail] = useState('');
 const [resendTimer, setResendTimer] = useState(0);
 const [errorMessage, setErrorMessage] = useState('');
 const [successMessage, setSuccessMessage] = useState('');
 const [verificationCode, setVerificationCode] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [isSendingOTP, setIsSendingOTP] = useState(false);
 const [showGoogleSignUpForm, setShowGoogleSignUpForm] = useState(false);
 const [googleUserData, setGoogleUserData] = useState<{
   email: string;
   name: string;
   picture?: string;
 } | null>(null);


 // Effect cho timer resend code
 useEffect(() => {
   let interval: NodeJS.Timeout;
   if (resendTimer > 0) {
     interval = setInterval(() => {
       setResendTimer((prev) => prev - 1);
     }, 1000);
   }
   return () => clearInterval(interval);
 }, [resendTimer]);


 // Effect cho error và success messages
 useEffect(() => {
   let timeout: NodeJS.Timeout;
   if (errorMessage || successMessage) {
     timeout = setTimeout(() => {
       setErrorMessage('');
       setSuccessMessage('');
     }, 3000);
   }
   return () => clearTimeout(timeout);
 }, [errorMessage, successMessage]);


 const handleResendCode = async () => {
   try {
     setIsLoading(true);
     const response = await authService.sendOTP(email);
     console.log('OTP Response:', response); // Debug log


     setResendTimer(60);
     setSuccessMessage('OTP code sent successfully');
   } catch (error: any) {
     console.error('Error sending OTP:', error);
     setErrorMessage(error.message || 'Could not send OTP. Please try again');
   } finally {
     setIsLoading(false);
   }
 };


 const handleGoogleSuccess = async (credentialResponse: any) => {
   try {
     const { credential } = credentialResponse;
     if (credential) {
       await fetch(`${import.meta.env.VITE_API_URL}/auth/google/signinWithGoogle`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ credential }),
       });
       navigate('/dashboard');
     }
   } catch (error) {
     setErrorMessage('Failed to sign in with Google');
   }
 };

 const handleLoginSubmit = async (values: {
   email: string;
   password: string;
 }) => {
   try {
     setIsLoading(true);
     setErrorMessage('');
    
     // Use authService.login instead of direct fetch
     const response = await authService.login(values);


     if (response.data?.accessToken) {
       setSuccessMessage('Login successful!');
       navigate('/dashboard');
     } else {
       setErrorMessage('Invalid credentials');
     }
   } catch (error: any) {
     console.error('Login error:', error);
     setErrorMessage(error.message || 'An unexpected error occurred');
   } finally {
     setIsLoading(false);
   }
 };


 const handleForgotPassword = async (email: string) => {
   try {
     setIsLoading(true);
     setErrorMessage('');
     setIsSendingOTP(true);


     // Gửi OTP
     await authService.sendOTP(email);


     // Lưu email và chuyển sang bước nhập OTP
     setEmail(email);
     setResendTimer(60);
     setCurrentStep('reset-code');
     setSuccessMessage('OTP sent successfully');
   } catch (error: any) {
     console.error('Error sending OTP:', error);
     setErrorMessage(error.message || 'Failed to send OTP');
   } finally {
     setIsLoading(false);
     setIsSendingOTP(false);
   }
 };


 const handleResetPassword = async (values: {
   newPassword: string;
   confirmPassword: string;
 }) => {
   try {
     setIsLoading(true);
     setErrorMessage('');


     await authService.forgotPassword({
       email,
       otp: verificationCode,
       newPassword: values.newPassword,
       repeatNewPassword: values.confirmPassword,
     });


     setSuccessMessage('Password changed successfully');
     setCurrentStep('signin');
   } catch (error: any) {
     console.error('Error resetting password:', error);
     setErrorMessage(error.message || 'Failed to reset password');
   } finally {
     setIsLoading(false);
   }
 };


 return (
   <div className="w-full max-w-md space-y-6">
     {showGoogleSignUpForm && googleUserData ? (
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
             setSuccessMessage('Registration successful!');
             setShowGoogleSignUpForm(false);
             navigate('/');
           } catch (error) {
             console.error('Registration error:', error);
             setErrorMessage('Failed to complete registration');
           }
         }}
         onCancel={() => {
           setShowGoogleSignUpForm(false);
           setGoogleUserData(null);
         }}
       />
     ) : (
       <>
         <div className="flex flex-col items-center mb-6">
           <img
             src={logoImage}
             alt="CNPM Logo"
             className="h-16 w-16 mb-4 cursor-pointer"
             onClick={() => navigate('/')}
           />
           <h2 className="text-2xl text-[#2C3E50]">
             {currentStep === 'signin' ? 'Welcome back!' : 'Reset Password'}
           </h2>
         </div>


         {currentStep === 'signin' && (
           <LoginForm
             onSubmit={handleLoginSubmit}
             onGoogleSuccess={handleGoogleSuccess}
             onForgotPassword={handleForgotPassword}
             onSignUpClick={() => navigate(`${import.meta.env.VITE_API_URL}/auth/google/signup`)}
             errorMessage={errorMessage}
             isLoading={isLoading}
             isSendingOTP={isSendingOTP}
           />
         )}


         {currentStep === 'reset-code' && (
           <ResetCodeForm
             onSubmit={(code) => {
               setVerificationCode(code);
               setCurrentStep('new-password');
             }}
             onResendCode={handleResendCode}
             onBack={() => setCurrentStep('signin')}
             resendTimer={resendTimer}
             error={errorMessage}
             isLoading={isLoading}
           />
         )}


         {currentStep === 'new-password' && (
           <NewPasswordForm
             onSubmit={async (values) => {
               try {
                 await authService.forgotPassword({
                   email,
                   otp: verificationCode,
                   newPassword: values.newPassword,
                   repeatNewPassword: values.confirmPassword,
                 });
                 setSuccessMessage(
                   'Password changed successfully. Please login again.'
                 );
                 setCurrentStep('signin');
               } catch (error: any) {
                 setErrorMessage(
                   error.message ||
                     'Could not change password. Please try again'
                 );
               }
             }}
             onBack={() => setCurrentStep('reset-code')}
             error={errorMessage}
           />
         )}
       </>
     )}
   </div>
 );
};


export default SignInPage;
