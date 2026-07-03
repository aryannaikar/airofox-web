"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { db } from '@/lib/db';
import { ShieldAlert } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'worker'>('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    // Basic email/phone validation
    if (role === 'worker') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10}$/;
      const identifier = formData.email.trim();
      const isEmail = emailRegex.test(identifier);
      const isPhone = phoneRegex.test(identifier.replace(/[\s-()]/g, ''));
      if (!isEmail && !isPhone) {
        setStatus({ type: 'error', message: 'Please enter a valid email address or 10-digit phone number.' });
        return;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setStatus({ type: 'error', message: 'Please enter a valid email address.' });
        return;
      }
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    setTimeout(async () => {
      setIsSubmitting(false);

      if (role === 'worker') {
        const worker = await db.getWorkerByEmailOrPhone(formData.email);
        if (!worker) {
          setStatus({
            type: 'error',
            message: 'No worker account found. Please register as a partner.',
          });
          return;
        }

        if (worker.status === 'pending') {
          setStatus({
            type: 'warning',
            message: 'Your registration request is pending. It will be sent to the administrator to verify and accept you. Please wait.',
          });
          return;
        }

        if (worker.status === 'rejected') {
          setStatus({
            type: 'error',
            message: 'Your application has been declined. Please contact partner support for details.',
          });
          return;
        }

        // Approved worker login
        setIsSuccess(true);
        localStorage.setItem('af_logged_worker', JSON.stringify(worker));
        setStatus({ type: 'success', message: 'Worker login successful! Redirecting to dashboard...' });
        
        setTimeout(() => {
          router.push('/worker/dashboard');
        }, 1500);
      } else {
        // Customer login
        const user = await db.getUserByEmail(formData.email);
        if (!user) {
          setStatus({
            type: 'error',
            message: 'No customer account found with this email. Please register first.',
          });
          return;
        }

        setIsSuccess(true);
        localStorage.setItem('af_logged_user', JSON.stringify(user));
        setStatus({ type: 'success', message: 'Welcome back! Redirecting you to the home page...' });
        
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
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
          <h2 className="text-3xl font-bold text-brand-navy tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-brand-slate text-sm">
            Sign in to manage bookings and request fast, reliable home services.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-brand-border/60 transition-all duration-300 hover:shadow-brand-navy/[0.04]">
          {isSuccess ? (
            <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 animate-[count-pop_0.5s_ease-out]" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Login Successful!</h3>
              <p className="mt-2 text-brand-slate text-sm">
                Redirecting you...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Toggle Selector */}
              <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-brand-border/40 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setRole('user');
                    setStatus({ type: '', message: '' });
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    role === 'user'
                      ? 'bg-white text-brand-navy shadow-sm border border-brand-border/20 font-extrabold'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  Customer Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('worker');
                    setStatus({ type: '', message: '' });
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    role === 'worker'
                      ? 'bg-brand-navy text-white shadow-sm font-extrabold'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  Partner / Worker
                </button>
              </div>

              {/* Email/Identifier Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-brand-navy block" htmlFor="email">
                  {role === 'worker' ? 'Email or Contact Number' : 'Email Address'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <Input
                    id="email"
                    type={role === 'worker' ? 'text' : 'email'}
                    name="email"
                    placeholder={role === 'worker' ? 'partner@airofox.com or 9876543210' : 'name@example.com'}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-brand-navy" htmlFor="password">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-brand-orange hover:underline transition-all">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-11 pr-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-brand-navy transition-colors focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-brand-border text-brand-orange focus:ring-brand-orange/20 accent-brand-orange"
                    disabled={isSubmitting}
                  />
                  <span className="text-xs font-medium text-brand-slate">Remember this device</span>
                </label>
              </div>

              {/* Feedback Message */}
              {status.message && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium border ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : status.type === 'warning'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  } animate-in fade-in slide-in-from-top-1 duration-200`}
                >
                  {status.message}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              {/* Social Logins */}
              <div className="relative py-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-brand-border"></div>
                </div>
                <span className="relative px-3 bg-white text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-brand-border rounded-2xl text-sm font-bold text-brand-navy bg-white hover:bg-brand-white transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md"
                disabled={isSubmitting}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </form>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6 space-y-4">
          <p className="text-sm text-brand-slate">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-brand-orange hover:underline transition-all">
              Sign up now
            </Link>
          </p>
          
          <div className="border-t border-brand-border/40 pt-4 flex justify-center">
            <Link href="/admin/login" className="text-xs font-bold text-brand-slate/60 hover:text-brand-orange transition-all flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Secret Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
