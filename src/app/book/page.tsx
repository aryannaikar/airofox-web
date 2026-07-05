"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MapPin, Calendar, Clock, ArrowRight, ArrowLeft, PenTool, Wind, Droplets, Zap } from 'lucide-react';
import { db } from '@/lib/db';
import { showToast } from '@/components/shared/Toast';

import { detailedServices } from '@/lib/servicesPricing';

// Create a mapping from detailedServices to flat SERVICES
const SERVICES = detailedServices.map(cat => {
  // Use first available variant price, or a fallback base price
  let basePrice = 299;
  if (cat.subcategories.length > 0 && cat.subcategories[0].services.length > 0 && cat.subcategories[0].services[0].variants.length > 0) {
    basePrice = cat.subcategories[0].services[0].variants[0].price;
  }
  
  let icon = <PenTool className="w-6 h-6" />;
  if (cat.id === 'ac') icon = <Wind className="w-6 h-6" />;
  if (cat.id === 'plumbing') icon = <Droplets className="w-6 h-6" />;
  if (cat.id === 'electrical') icon = <Zap className="w-6 h-6" />;

  return {
    id: cat.id,
    name: cat.category,
    icon,
    basePrice
  };
});

export default function BookingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('af_logged_user') : null;
    if (!userStr) {
      router.push('/login');
    } else {
      const user = JSON.parse(userStr);
      setCustomerDetails({ 
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [router]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(async () => {
      // 1. Create a job in the database
      await db.createJob({
        customer_name: customerDetails.name,
        service_required: selectedService.name,
        distance: (Math.random() * 5 + 0.5).toFixed(1) + ' km', // Mock distance
        estimated_earnings: selectedService.basePrice,
        preferred_time: `${date}, ${time}`,
        customer_rating: 5.0, // First time customer default
        phone: customerDetails.phone,
        address: customerDetails.address,
        status: 'pending',
        worker_id: null,
      });

      // 2. Create customer and admin notifications
      const userStr = localStorage.getItem('af_logged_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          await db.createNotification({
            user_id: user.email,
            title: 'Booking Confirmed',
            message: `Your booking for ${selectedService.name} on ${date} at ${time} has been placed. We are matching a partner for you.`,
          });
        } catch (e) {
          console.error(e);
        }
      }

      await db.createNotification({
        user_id: 'admin',
        title: 'New Service Booking',
        message: `New booking requested by ${customerDetails.name} for ${selectedService.name}.`,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      showToast('success', '🎉 Booking Confirmed!', `Your ${selectedService.name} is booked for ${date} at ${time}.`);
    }, 1200);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl text-center border border-brand-border/60 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-brand-navy mb-2">Booking Confirmed!</h2>
          <p className="text-brand-slate text-sm mb-8">
            Your request for <span className="font-bold">{selectedService.name}</span> has been received. Our operations team will assign a verified partner shortly.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full py-3.5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl font-bold transition-all shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-brand-slate font-sans py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-orange transition-colors font-bold mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-black text-brand-navy tracking-tight">Book a Service</h1>
          <p className="text-sm text-slate-500 mt-2">Fast, reliable, and verified professionals at your doorstep.</p>
        </div>

        {/* Wizard Container */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-brand-border/60 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="flex">
            {[1, 2, 3].map((num) => (
              <div 
                key={num} 
                className={`h-1.5 flex-1 transition-colors duration-500 ${
                  step >= num ? 'bg-brand-orange' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>

          <div className="p-8 md:p-12">
            
            {/* Step 1: Select Service */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-brand-navy mb-6">What do you need help with?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {SERVICES.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                        selectedService.id === srv.id 
                          ? 'border-brand-orange bg-brand-orange/5 shadow-sm' 
                          : 'border-brand-border hover:border-brand-slate/30'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${selectedService.id === srv.id ? 'bg-brand-orange text-white' : 'bg-slate-100 text-brand-navy'}`}>
                        {srv.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-navy">{srv.name}</h4>
                        <p className="text-xs text-brand-slate/80 font-medium mt-1">Starts at ₹{srv.basePrice}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={handleNext} className="flex items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md">
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-brand-navy mb-6">When do you need it?</h3>
                
                <div className="space-y-6 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-2">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-brand-border rounded-xl text-sm font-semibold text-brand-navy focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-2">Preferred Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-brand-border rounded-xl text-sm font-semibold text-brand-navy focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 appearance-none"
                        required
                      >
                        <option value="" disabled>Select a time slot</option>
                        <option value="09:00 AM - 11:00 AM">Morning (9 AM - 11 AM)</option>
                        <option value="11:00 AM - 01:00 PM">Late Morning (11 AM - 1 PM)</option>
                        <option value="01:00 PM - 03:00 PM">Afternoon (1 PM - 3 PM)</option>
                        <option value="03:00 PM - 05:00 PM">Late Afternoon (3 PM - 5 PM)</option>
                        <option value="05:00 PM - 07:00 PM">Evening (5 PM - 7 PM)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button onClick={handleBack} className="text-brand-slate font-bold text-sm hover:text-brand-navy transition-colors">
                    Back
                  </button>
                  <button 
                    onClick={handleNext} 
                    disabled={!date || !time}
                    className="flex items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Address */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-xl font-bold text-brand-navy mb-6">Where should we send the partner?</h3>
                
                <div className="space-y-5 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-brand-border rounded-xl text-sm font-semibold text-brand-navy focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91 90000 00000"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-brand-border rounded-xl text-sm font-semibold text-brand-navy focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-brand-slate uppercase tracking-wider mb-2">Complete Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                      <textarea 
                        placeholder="House no, Building, Street, City"
                        rows={3}
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-brand-border rounded-xl text-sm font-semibold text-brand-navy focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button type="button" onClick={handleBack} className="text-brand-slate font-bold text-sm hover:text-brand-navy transition-colors">
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !customerDetails.name || !customerDetails.phone || !customerDetails.address}
                    className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-[#e66a00] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/20 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Confirm Booking <CheckCircle className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
