"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value !== '' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otpValues[index] === '' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtpValues = pastedData.split('');
    setOtpValues(newOtpValues);
    otpInputRefs.current[5]?.focus();
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Check if customer exists in the local db / supabase
      const user = await db.getUserByEmail(email);
      if (!user) {
        setStatus({
          type: 'error',
          message: 'No customer account found with this email. Please register first.',
        });
        setIsSubmitting(false);
        return;
      }

      // Send OTP API call
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: user.name, type: 'forgot-password' }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpToken(data.token);
        if (data.otp) setGeneratedOtp(data.otp);
        setStep(2);
        setResendTimer(60);
        setStatus({
          type: 'success',
          message: data.devMode 
            ? 'Verification code generated! (Dev mode: check code below)' 
            : 'Verification code sent to your email. Please check your inbox.'
        });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to send verification code.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length !== 6) {
      setStatus({ type: 'error', message: 'Please enter all 6 digits of the OTP.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: enteredOtp, token: otpToken }),
      });
      const data = await res.json();
      if (data.success) {
        // OTP correct, proceed to password reset form
        setStatus({ type: '', message: '' });
        setStep(3);
      } else {
        setStatus({ type: 'error', message: data.error || 'Incorrect verification code. Please try again.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: 'Failed to verify code. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    setTimeout(() => {
      // Save password in local storage
      localStorage.setItem('af_user_password_' + email.toLowerCase().trim(), newPassword);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      setStatus({ type: 'success', message: 'Password reset successfully!' });

      setTimeout(() => {
        router.push('/login');
      }, 1800);
    }, 1200);
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] relative overflow-hidden bg-brand-white py-16 px-4">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full bg-brand-orange/10 blur-[100px] pointer-events-none animate-[pulse-green_6s_infinite]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full bg-brand-navy/10 blur-[100px] pointer-events-none animate-[pulse-navy_6s_infinite]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4 transition-transform hover:scale-105">
            <img src="/logo.jpeg" alt="AiroFox Logo" className="w-12 h-12 rounded-xl object-cover shadow-md border border-brand-border" />
            <span className="font-extrabold text-2xl text-brand-navy tracking-tight">AiroFox</span>
          </Link>
          <h2 className="text-3xl font-bold text-brand-navy tracking-tight">
            {step === 3 ? 'Set New Password' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-brand-slate text-sm">
            {step === 1 && 'Enter your registered email address to receive a verification OTP.'}
            {step === 2 && 'Enter the 6-digit OTP code sent to your email to verify your identity.'}
            {step === 3 && 'Choose a strong, secure new password for your customer account.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-brand-border/60 transition-all duration-300">
          {isSuccess ? (
            <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 animate-[count-pop_0.5s_ease-out]" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Password Reset Success!</h3>
              <p className="mt-2 text-brand-slate text-sm">
                Redirecting to sign in screen...
              </p>
            </div>
          ) : (
            <div>
              {/* STEP 1: Enter Email */}
              {step === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-5 animate-in fade-in duration-200">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-brand-navy block" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {status.message && (
                    <div className="p-3.5 rounded-xl text-xs font-medium border bg-red-50 text-red-700 border-red-200 animate-in fade-in">
                      {status.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-2xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* STEP 2: Verify OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-300">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-2 text-brand-orange">
                      <Mail className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-semibold text-brand-slate">
                      Sent to <span className="font-bold text-brand-navy">{email}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* 6 Digit Inputs */}
                    <div className="flex justify-between gap-2 max-w-xs mx-auto py-2">
                      {otpValues.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => { otpInputRefs.current[idx] = el; }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={idx === 0 ? handleOtpPaste : undefined}
                          className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-brand-border bg-white focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all"
                          required
                        />
                      ))}
                    </div>

                    {status.message && (
                      <div className={`p-3.5 rounded-xl text-xs font-medium border ${
                        status.type === 'success'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      } text-center animate-in fade-in`}>
                        {status.message}
                      </div>
                    )}

                    {/* Dev mode code snippet */}
                    {generatedOtp && (
                      <div className="bg-brand-navy/5 border border-brand-navy/15 rounded-xl p-3 text-center text-xs font-semibold text-brand-navy">
                        🔒 Dev Mode Code: <span className="font-extrabold text-brand-orange text-sm select-all tracking-wider">{generatedOtp}</span>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-2xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Verify Verification Code
                    </Button>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs font-bold text-brand-slate">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setStatus({ type: '', message: '' });
                          setOtpValues(Array(6).fill(''));
                        }}
                        className="hover:text-brand-orange transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Change Email
                      </button>
                      
                      {resendTimer > 0 ? (
                        <span>Resend in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-brand-orange hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}

              {/* STEP 3: Reset Password */}
              {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-brand-navy block" htmlFor="newPassword">
                      New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-11 pr-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-brand-navy focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-brand-navy block" htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-11 pr-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-brand-navy focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {status.message && (
                    <div className="p-3.5 rounded-xl text-xs font-medium border bg-red-50 text-red-700 border-red-200 animate-in fade-in">
                      {status.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-2xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:bg-gray-400"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-brand-slate">
            Remembered your password?{' '}
            <Link href="/login" className="font-bold text-brand-orange hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
