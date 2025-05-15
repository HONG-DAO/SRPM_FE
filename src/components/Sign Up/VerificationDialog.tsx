/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
// import { authService } from '../../services/authService';

interface SignUpVerificationDialogProps {
  email: string;
  open: boolean;
  onClose: () => void;
  onVerificationSuccess: () => void;
}
const SignUpVerificationDialog: React.FC<SignUpVerificationDialogProps> = ({
  email,
  open,
  onClose,
  onVerificationSuccess,
}) => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<
    'idle' | 'success'
  >('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerificationCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (/^\w*$/.test(value) && value.length <= 6) {
      setVerificationCode(value);
    }
  }, []);

  const handleVerify = useCallback(async () => {
    if (verificationCode.length !== 6) {
      setError('Vui lòng nhập mã xác thực 6 số');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
    //   await authService.verifyEmail({
    //     email,
    //     verificationCode,
    //   });

      setVerificationStatus('success');
      setTimeout(() => {
        onVerificationSuccess();
      }, 5000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Mã xác thực không hợp lệ. Vui lòng thử lại.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [verificationCode, email, onVerificationSuccess]);

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError(null);

    try {
    //   await authService.sendOtp(email);
      setResendMessage('We have sent you a new verification code');
      setResendCooldown(60);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Unable to resend code. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, resendCooldown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-lg p-8 w-full max-w-md mx-4 shadow-xl">
        {verificationStatus === 'idle' ? (
          <>
            <div className="text-center mb-8 slide-up">
              <h2 className="text-2xl text-[#2C3E50] font-['SVN-Gotham-Regular']">
                Verify your email
              </h2>
              <p className="text-center text-[#2C3E50] mt-4">
                We've sent a verification code to {email}.<br />
                Please enter it below.
              </p>
            </div>

            <div className="space-y-6">
              <Input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                placeholder="Enter verification code"
                className="w-full h-12 px-4 rounded-md border border-gray-200 focus:border-[#1569CB] text-center text-lg"
              />

              {resendMessage && (
                <p className="text-green-600 text-center">{resendMessage}</p>
              )}

              <div className="flex justify-between gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="button-animation flex-1 h-12 border-[#1569CB] text-[#1569CB] hover:bg-[#1569CB] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend (${resendCooldown}s)`
                    : 'Resend'}
                </Button>
                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={verificationCode.length !== 6}
                  className="button-animation flex-1 h-12 bg-[#1569CB] text-white hover:bg-[#1569CB]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="success-message text-center space-y-6 slide-up">
            <h2 className="text-2xl text-[#2C3E50] font-['SVN-Gotham-Regular']">
              Email Verified Successfully!
            </h2>
            <p className="text-[#2C3E50]">
              Your email has been verified. Please wait while we redirect you...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default SignUpVerificationDialog;
