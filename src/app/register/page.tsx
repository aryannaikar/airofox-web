"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, User, Phone, Image as ImageIcon, Briefcase, Award, Globe, Landmark, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/db';

const SKILLS_OPTIONS = [
  'AC Repair', 'Electrical Wiring', 'Appliance Repair', 'Plumbing',
  'Leak Detection', 'Pipe Fitting', 'Home Cleaning', 'Painting',
  'Carpentry', 'Pest Control', 'Gardening'
];

const LANGUAGES_OPTIONS = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Kannada', 'Tamil', 'Telugu'];

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState<'user' | 'worker'>('user');
  
  // Common states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // User form data
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Worker form data & steps
  const [workerStep, setWorkerStep] = useState(1);
  const [workerFormData, setWorkerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    photo: '',
    skills: [] as string[],
    experience: '1 Year',
    languages: [] as string[],
    bankName: '',
    accountNo: '',
    upiId: '',
    password: '',
    confirmPassword: '',
  });

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setWorkerFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setWorkerFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const handleLanguageToggle = (lang: string) => {
    setWorkerFormData(prev => {
      const languages = prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang];
      return { ...prev, languages };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 400 * 1024) {
      setStatus({ type: 'error', message: 'Photo size must not exceed 400KB.' });
      e.target.value = ''; // Reset input
      return;
    }

    setStatus({ type: '', message: '' });

    const reader = new FileReader();
    reader.onloadend = () => {
      setWorkerFormData(prev => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const validateUserForm = () => {
    if (!userFormData.name || !userFormData.email || !userFormData.phone || !userFormData.password || !userFormData.confirmPassword) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userFormData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(userFormData.phone.replace(/[\s-()]/g, ''))) {
      setStatus({ type: 'error', message: 'Please enter a valid 10-digit phone number.' });
      return false;
    }

    if (userFormData.password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return false;
    }

    if (userFormData.password !== userFormData.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return false;
    }

    if (!agreedTerms) {
      setStatus({ type: 'error', message: 'You must agree to the Terms of Service & Privacy Policy.' });
      return false;
    }

    return true;
  };

  const validateWorkerStep = (step: number) => {
    setStatus({ type: '', message: '' });
    if (step === 1) {
      if (!workerFormData.name || !workerFormData.phone || !workerFormData.age || !workerFormData.photo) {
        setStatus({ type: 'error', message: 'Please fill in all details, including uploading your photo.' });
        return false;
      }
      const ageNum = parseInt(workerFormData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
        setStatus({ type: 'error', message: 'Worker age must be between 18 and 65.' });
        return false;
      }
      if (workerFormData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(workerFormData.email)) {
          setStatus({ type: 'error', message: 'Please enter a valid email address.' });
          return false;
        }
      }
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(workerFormData.phone.replace(/[\s-()]/g, ''))) {
        setStatus({ type: 'error', message: 'Please enter a valid 10-digit phone number.' });
        return false;
      }
    } else if (step === 2) {
      if (workerFormData.skills.length === 0) {
        setStatus({ type: 'error', message: 'Please select at least one skill.' });
        return false;
      }
      if (workerFormData.languages.length === 0) {
        setStatus({ type: 'error', message: 'Please select at least one language.' });
        return false;
      }
      if (!agreedTerms) {
        setStatus({ type: 'error', message: 'You must agree to the Terms of Service & Privacy Policy.' });
        return false;
      }
    }
    return true;
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUserForm()) return;

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    setTimeout(async () => {
      setIsSubmitting(false);

      try {
        await db.registerUser({
          name: userFormData.name,
          email: userFormData.email,
          phone: userFormData.phone,
        });

        setIsSuccess(true);
        setStatus({ type: 'success', message: 'Account created successfully! Welcome to AiroFox.' });
        
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } catch (err: unknown) {
        setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Registration failed.' });
      }
    }, 1500);
  };

  const handleWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateWorkerStep(2)) return;

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    setTimeout(async () => {
      setIsSubmitting(false);
      try {
        // Register in local database
        const registered = await db.registerWorker({
          name: workerFormData.name,
          email: workerFormData.email,
          phone: workerFormData.phone,
          age: parseInt(workerFormData.age),
          gender: workerFormData.gender,
          photo: workerFormData.photo,
          skills: workerFormData.skills,
          experience: workerFormData.experience,
          languages: workerFormData.languages,
          bank_name: '',
          account_no: '',
          upi_id: '',
          status: 'pending', // Awaiting Admin Verification
        });

        setIsSuccess(true);
        setStatus({ type: 'success', message: 'Registration submitted successfully!' });

        setTimeout(() => {
          router.push(`/register/pending?email=${encodeURIComponent(workerFormData.email)}`);
        }, 1500);
      } catch (err: unknown) {
        setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Registration failed.' });
      }
    }, 1500);
  };

  return (
    <div className="flex-grow flex items-center justify-center min-h-[90vh] relative overflow-hidden bg-brand-white py-16 px-4">
      {/* Background Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 rounded-full bg-brand-orange/10 blur-[100px] pointer-events-none animate-[pulse-green_6s_infinite]" />
      <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 rounded-full bg-brand-navy/10 blur-[100px] pointer-events-none animate-[pulse-navy_6s_infinite]" />

      <div className="w-full max-w-xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-4 transition-transform hover:scale-105">
            <img src="/logo.jpeg" alt="AiroFox Logo" className="w-12 h-12 rounded-xl object-cover shadow-md border border-brand-border" />
            <span className="font-extrabold text-2xl text-brand-navy tracking-tight">AiroFox</span>
          </Link>
          <h2 className="text-3xl font-bold text-brand-navy tracking-tight">Join AiroFox</h2>
          <p className="mt-2 text-brand-slate text-sm">
            {role === 'worker' 
              ? 'Register as a service partner to earn money on your own schedule.' 
              : 'Sign up to get access to top-rated home services in Mumbai.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-brand-border/60 transition-all duration-300">
          {isSuccess ? (
            <div className="text-center py-8 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 animate-[count-pop_0.5s_ease-out]" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy">Registration Received!</h3>
              <p className="mt-2 text-brand-slate text-sm">
                {role === 'worker' 
                  ? 'Redirecting to your application tracking page...'
                  : 'Account created! Redirecting to login...'}
              </p>
            </div>
          ) : (
            <div>
              {/* Role Toggle Selector */}
              {workerStep === 1 && (
                <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-brand-border/40 mb-6">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
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
                    onClick={() => setRole('worker')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                      role === 'worker'
                        ? 'bg-brand-navy text-white shadow-sm font-extrabold'
                        : 'text-brand-slate hover:text-brand-navy'
                    }`}
                  >
                    Partner / Worker
                  </button>
                </div>
              )}

              {/* CUSTOMER REGISTRATION */}
              {role === 'user' && (
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-brand-navy block" htmlFor="name">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><User className="w-4 h-4" /></span>
                      <Input
                        id="name" type="text" name="name" placeholder="John Doe"
                        value={userFormData.name} onChange={handleUserInputChange}
                        className="pl-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20" required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-brand-navy block" htmlFor="email">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><Mail className="w-4 h-4" /></span>
                      <Input
                        id="email" type="email" name="email" placeholder="name@example.com"
                        value={userFormData.email} onChange={handleUserInputChange}
                        className="pl-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20" required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-brand-navy block" htmlFor="phone">Phone Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><Phone className="w-4 h-4" /></span>
                      <Input
                        id="phone" type="tel" name="phone" placeholder="9876543210"
                        value={userFormData.phone} onChange={handleUserInputChange}
                        className="pl-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20" required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-brand-navy block" htmlFor="password">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><Lock className="w-4 h-4" /></span>
                        <Input
                          id="password" type={showPassword ? 'text' : 'password'} name="password" placeholder="At least 6 chars"
                          value={userFormData.password} onChange={handleUserInputChange}
                          className="pl-11 pr-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20" required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-brand-navy focus:outline-none">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-brand-navy block" htmlFor="confirmPassword">Confirm Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400"><Lock className="w-4 h-4" /></span>
                        <Input
                          id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Repeat password"
                          value={userFormData.confirmPassword} onChange={handleUserInputChange}
                          className="pl-11 pr-11 h-12 rounded-2xl border border-brand-border bg-white focus-visible:border-brand-orange focus-visible:ring-brand-orange/20" required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-brand-navy focus:outline-none">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 py-1 select-none">
                    <input
                      type="checkbox" id="terms" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-brand-border text-brand-orange focus:ring-brand-orange/20 accent-brand-orange"
                    />
                    <label htmlFor="terms" className="text-xs font-medium text-brand-slate leading-relaxed cursor-pointer">
                      I agree to the <Link href="/terms" className="font-semibold text-brand-orange hover:underline">Terms of Service</Link> & <Link href="/privacy" className="font-semibold text-brand-orange hover:underline">Privacy Policy</Link>
                    </label>
                  </div>

                  {status.message && (
                    <div className="p-3.5 rounded-xl text-xs font-medium border bg-red-50 text-red-700 border-red-200 animate-in fade-in slide-in-from-top-1">
                      {status.message}
                    </div>
                  )}

                  <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-2xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
                    {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>}
                  </Button>
                </form>
              )}

              {/* WORKER / PARTNER REGISTRATION (MULTI-STEP) */}
              {role === 'worker' && (
                <div>
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between mb-8 px-12">
                    {[1, 2].map((step) => (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all duration-300 ${
                            workerStep === step
                              ? 'bg-brand-orange text-white border-brand-orange ring-4 ring-brand-orange/15 shadow-sm'
                              : workerStep > step
                              ? 'bg-brand-navy text-white border-brand-navy'
                              : 'bg-white text-brand-slate border-brand-border'
                          }`}>
                            {workerStep > step ? '✓' : step}
                          </div>
                          <span className={`text-[10px] font-semibold mt-1.5 tracking-tight ${
                            workerStep === step ? 'text-brand-orange font-bold' : 'text-brand-slate/60'
                          }`}>
                            {step === 1 ? 'Personal' : 'Skills'}
                          </span>
                        </div>
                        {step < 2 && (
                          <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                            workerStep > step ? 'bg-brand-navy' : 'bg-brand-border'
                          }`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <form onSubmit={workerStep === 2 ? handleWorkerSubmit : (e) => e.preventDefault()} className="space-y-5">
                    
                    {/* STEP 1: PERSONAL DETAILS */}
                    {workerStep === 1 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-brand-navy block" htmlFor="name">Full Name</label>
                            <Input
                              id="name" type="text" name="name" placeholder="Rahul Sharma"
                              value={workerFormData.name} onChange={handleWorkerInputChange}
                              className="h-12 rounded-2xl border border-brand-border bg-white" required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-brand-navy block" htmlFor="email">Email Address (Optional)</label>
                            <Input
                              id="email" type="email" name="email" placeholder="rahul@example.com"
                              value={workerFormData.email} onChange={handleWorkerInputChange}
                              className="h-12 rounded-2xl border border-brand-border bg-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1.5 md:col-span-1">
                            <label className="text-sm font-semibold text-brand-navy block" htmlFor="age">Age</label>
                            <Input
                              id="age" type="number" name="age" placeholder="28" min="18" max="65"
                              value={workerFormData.age} onChange={handleWorkerInputChange}
                              className="h-12 rounded-2xl border border-brand-border bg-white" required
                            />
                          </div>
                          <div className="space-y-1.5 md:col-span-1">
                            <label className="text-sm font-semibold text-brand-navy block" htmlFor="gender">Gender</label>
                            <select
                              id="gender" name="gender" value={workerFormData.gender} onChange={handleWorkerInputChange}
                              className="w-full h-12 px-4 rounded-2xl border border-brand-border bg-white text-brand-slate text-sm font-medium focus:outline-none focus:border-brand-orange"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="space-y-1.5 md:col-span-1">
                            <label className="text-sm font-semibold text-brand-navy block" htmlFor="phone">Contact Number</label>
                            <Input
                              id="phone" type="tel" name="phone" placeholder="9876543210"
                              value={workerFormData.phone} onChange={handleWorkerInputChange}
                              className="h-12 rounded-2xl border border-brand-border bg-white" required
                            />
                          </div>
                        </div>

                        {/* Photo Upload with Size Validation */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-brand-navy block">Profile Photo (Max 400KB)</label>
                          <div className="border-2 border-dashed border-brand-border/80 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center gap-3 transition-colors hover:bg-slate-50">
                            {workerFormData.photo ? (
                              <div className="flex flex-col items-center gap-2">
                                <img src={workerFormData.photo} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-brand-orange shadow-md" />
                                <button
                                  type="button"
                                  onClick={() => setWorkerFormData(prev => ({ ...prev, photo: '' }))}
                                  className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                                >
                                  Remove & Upload Another
                                </button>
                              </div>
                            ) : (
                              <>
                                <div className="w-12 h-12 bg-brand-navy/5 rounded-xl flex items-center justify-center text-brand-navy">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                  <p className="text-xs font-bold text-brand-navy">Click to upload or drag & drop</p>
                                  <p className="text-[10px] text-brand-slate/60 mt-1">JPEG, PNG formats, maximum file size 400KB</p>
                                </div>
                                <input
                                  type="file" accept="image/*" onChange={handlePhotoUpload}
                                  className="absolute opacity-0 w-full max-w-sm h-28 cursor-pointer"
                                />
                              </>
                            )}
                          </div>
                        </div>

                        {status.message && status.type === 'error' && (
                          <div className="p-3.5 rounded-xl text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                            {status.message}
                          </div>
                        )}

                        <Button
                          type="button"
                          onClick={() => {
                            if (validateWorkerStep(1)) setWorkerStep(2);
                          }}
                          className="w-full h-12 rounded-2xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                          Continue to Skills
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    {/* STEP 2: PROFESSIONAL INFO */}
                    {workerStep === 2 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-3 duration-300">
                        {/* Skills Selection */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-brand-navy block flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-brand-orange" />
                            Select Your Skills (Select multiple)
                          </label>
                          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50/50 rounded-2xl border border-brand-border/60">
                            {SKILLS_OPTIONS.map((skill) => {
                              const selected = workerFormData.skills.includes(skill);
                              return (
                                <button
                                  type="button" key={skill} onClick={() => handleSkillToggle(skill)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                                    selected
                                      ? 'bg-brand-orange text-white border-brand-orange shadow-sm font-bold'
                                      : 'bg-white text-brand-slate border-brand-border hover:bg-slate-100'
                                  }`}
                                >
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Experience Selection */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-brand-navy block flex items-center gap-1.5" htmlFor="experience">
                            <Award className="w-4 h-4 text-brand-orange" />
                            Overall Work Experience
                          </label>
                          <select
                            id="experience" name="experience" value={workerFormData.experience} onChange={handleWorkerInputChange}
                            className="w-full h-12 px-4 rounded-2xl border border-brand-border bg-white text-brand-slate text-sm font-medium focus:outline-none focus:border-brand-orange"
                          >
                            <option value="1 Year">1 Year</option>
                            <option value="2 Years">2 Years</option>
                            <option value="3 Years">3 Years</option>
                            <option value="4 Years">4 Years</option>
                            <option value="5+ Years">5+ Years</option>
                            <option value="10+ Years">10+ Years</option>
                          </select>
                        </div>

                        {/* Languages Spoken */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-brand-navy block flex items-center gap-1.5">
                            <Globe className="w-4 h-4 text-brand-orange" />
                            Languages Spoken (Select multiple)
                          </label>
                          <div className="flex flex-wrap gap-2 p-2 bg-slate-50/50 rounded-2xl border border-brand-border/60">
                            {LANGUAGES_OPTIONS.map((lang) => {
                              const selected = workerFormData.languages.includes(lang);
                              return (
                                <button
                                  type="button" key={lang} onClick={() => handleLanguageToggle(lang)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                                    selected
                                      ? 'bg-brand-navy text-white border-brand-navy shadow-sm font-bold'
                                      : 'bg-white text-brand-slate border-brand-border hover:bg-slate-100'
                                  }`}
                                >
                                  {lang}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {status.message && status.type === 'error' && (
                          <div className="p-3.5 rounded-xl text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                            {status.message}
                          </div>
                        )}

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-2 py-1.5 select-none mt-2">
                          <input
                            type="checkbox" id="termsWorker" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-brand-border text-brand-orange focus:ring-brand-orange/20 accent-brand-orange"
                          />
                          <label htmlFor="termsWorker" className="text-xs font-medium text-brand-slate leading-relaxed cursor-pointer">
                            I agree to the Partner Terms of Service & Privacy Policy
                          </label>
                        </div>

                        {status.message && (
                          <div className={`p-3.5 rounded-xl text-xs font-medium border bg-red-50 text-red-700 border-red-200 animate-in fade-in`}>
                            {status.message}
                          </div>
                        )}

                        <div className="flex gap-4">
                          <button
                            type="button" onClick={() => setWorkerStep(1)}
                            className="flex-1 h-12 rounded-2xl border border-brand-border hover:bg-slate-50 text-brand-navy font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" /> Back
                          </button>
                          <Button
                            type="submit" disabled={isSubmitting}
                            className="flex-1 h-12 rounded-2xl bg-brand-navy hover:bg-brand-orange text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                          >
                            {isSubmitting ? (
                              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                Submit Application
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              )}
            </div>
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
