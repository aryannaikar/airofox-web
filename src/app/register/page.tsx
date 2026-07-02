"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s-()]/g, ''))) {
      setStatus({ type: 'error', message: 'Please enter a valid 10-digit phone number.' });
      return;
    }

    if (formData.password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (!agreedTerms) {
      setStatus({ type: 'error', message: 'You must agree to the Terms of Service & Privacy Policy.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setStatus({ type: 'success', message: 'Account created successfully! Welcome to AiroFox.' });
      
      // Redirect to login after animation
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-[90vh] relative overflow-hidden bg-brand-white py-16 px-4">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full bg-brand-orange/10 blur-[100px] pointer-events-none animate-[pulse-green_6s_infinite]" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 rounded-full bg-brand-navy/10 blur-[100px] pointer-events-none animate-[pulse-navy_6s_infinite]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4 transition-transform hover:scale-105">
            <img src="/logo.jpeg" alt="AiroFox Logo" className="w-12 h-12 rounded-xl object-cover shadow-md border border-brand-border" />
            <span className="font-extrabold text-2xl text-brand-navy tracking-tight">AiroFox</span>
          </Link>
          <h2 className="text-3xl font-bold text-brand-navy tracking-tight">Create Account</h2>
          <p className="mt-2 text-brand-slate text-sm">
            Sign up to get access to top-rated home services in Mumbai.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-brand-border/60 transition-all duration-300 hover:shadow-brand-navy/[0.04]">
          {isSuccess ? (
            <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 animate-[count-pop_0.5s_ease-out]" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Registration Successful!</h3>
              <p className="mt-2 text-brand-slate text-sm">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-brand-navy block" htmlFor="name">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <User className="w-4 h-4" />
                  </span>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email Address */}
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
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-brand-navy block" htmlFor="phone">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-brand-navy block" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="At least 6 characters"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-brand-navy block" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-11 pr-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-brand-navy transition-colors focus:outline-none"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-2 py-1 select-none">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-brand-border text-brand-orange focus:ring-brand-orange/20 accent-brand-orange"
                  disabled={isSubmitting}
                />
                <label htmlFor="terms" className="text-xs font-medium text-brand-slate leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="font-semibold text-brand-orange hover:underline">
                    Terms of Service
                  </Link>{' '}
                  &{' '}
                  <Link href="/privacy" className="font-semibold text-brand-orange hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Feedback Message */}
              {status.message && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-medium border ${
                    status.type === 'success'
                      ? 'bg-green-50 text-green-700 border-green-200'
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
                    Create Account
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-brand-slate">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-brand-orange hover:underline transition-all">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
