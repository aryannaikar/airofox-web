import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function useReveal(t = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

function useCountUp(target, dur = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let s = null;
    const tick = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, dur]);
  return val;
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i);

  const [statsRef, statsVis] = useReveal(0.2);
  const [dashRef,  dashVis]  = useReveal(0.08);
  const [howRef,   howVis]   = useReveal(0.1);
  const [testimRef,testimVis]= useReveal(0.1);
  const [promoRef, promoVis] = useReveal(0.15);
  const [faqRef,   faqVis]   = useReveal(0.08);

  const c1 = useCountUp(500,  1800, statsVis);
  const c2 = useCountUp(5000, 2000, statsVis);
  const c3 = useCountUp(98,   1600, statsVis);
  const c4 = useCountUp(49,   1400, statsVis);

  const testimonials = [
    { name:'Priya S.', area:'Dadar',   stars:5, text:'AC fixed same day! Technician arrived within the hour. Transparent pricing, zero surprises.' },
    { name:'Rahul M.', area:'Parel',   stars:5, text:'Plumber sorted a stubborn leak in 20 minutes. Polite, fast, and very affordable.' },
    { name:'Anita K.', area:'Matunga', stars:5, text:'I use AiroFox for all my electrical work. Always professional and on time. Highly recommended!' },
    { name:'Suresh P.', area:'Lalbaug',stars:5, text:'Washing machine repaired same afternoon. Genuine spare parts and clear invoice. 5 stars!' },
  ];

  const faqItems = [
    {
      q: "What is AiroFox?",
      a: "AiroFox is a trusted home-service platform connecting you with verified local professionals for home appliance repairs, electrical work, plumbing and more. We make booking fast, reliable, transparent, and hassle-free."
    },
    {
      q: "How can I book a service?",
      a: "Choose your service, select a date and time, enter your location, and confirm. A verified professional will be assigned, and you'll receive updates until the job is completed."
    },
    {
      q: "What services does AiroFox provide?",
      a: "AiroFox offers home appliance repairs, plumbing, electrical work, AC servicing and many other professional home services."
    },
    {
      q: "Can I track the service professional in real time?",
      a: "Yes. You can track your assigned professional in real time, receive arrival updates, and stay informed from booking until the service is completed."
    },
    {
      q: "Are AiroFox prices transparent?",
      a: "Yes. We provide upfront pricing with no hidden charges. If additional work is needed, you'll be informed and asked for approval before it begins. You can also download a detailed digital invoice after your service for complete transparency and easy record-keeping."
    },
    {
      q: "Are AiroFox professionals verified?",
      a: "Absolutely. Every AiroFox professional undergoes identity verification, document checks, and skill assessments to ensure safe, reliable, and professional service."
    },
    {
      q: "How does AiroFox ensure service quality?",
      a: "We ensure quality through verified professionals, customer ratings, regular performance reviews, and responsive support—delivering reliable, consistent service you can trust every time."
    }
  ];

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-white to-orange-50" style={{position:'relative',overflow:'hidden'}}>
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center" style={{position:'relative',zIndex:1}}>
            <div>
              <div className="hero-badge hero-text-animate d1">
                <span className="hero-badge-dot" />
                Accepting bookings now
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-brand-navy leading-tight hero-text-animate d2">
                Fast Home Services at Your Doorstep
              </h1>
              <p className="mt-4 text-base md:text-lg text-brand-slate hero-text-animate d3">
                AC repair, cleaning, plumbing, and electrical works.
              </p>
              
              <div className="flex gap-4 mt-6">
                <a
                  href="tel:+919326065836"
                  className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 shadow-md gap-2 bg-brand-navy text-white hover:bg-brand-orange"
                  style={{ padding: '16px 28px' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-phone"
                  >
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                  </svg>
                  Book Now
                </a>
                <a
                  href="https://wa.me/919326065836?text=Hi%20AiroFox%2C%20I%20need%20help%20with%20home%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 bg-green-500 text-white hover:bg-green-600 shadow-md gap-2"
                  style={{ padding: '16px 28px' }}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="18"
                    width="18"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Service Quick Selector - Above the Fold */}
              <div className="hero-quick-selector mt-8">
                <Link to="/services?service=ac" className="quick-selector-item">
                  <div className="quick-selector-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m10 20-1.25-2.5L6 18"></path>
                      <path d="M10 4 8.75 6.5 6 6"></path>
                      <path d="m14 20 1.25-2.5L18 18"></path>
                      <path d="m14 4 1.25 2.5L18 6"></path>
                      <path d="m17 21-3-6h-4"></path>
                      <path d="m17 3-3 6 1.5 3"></path>
                      <path d="M2 12h6.5L10 9"></path>
                      <path d="m20 10-1.5 2 1.5 2"></path>
                      <path d="M22 12h-6.5L14 15"></path>
                      <path d="m4 10 1.5 2L4 14"></path>
                      <path d="m7 21 3-6-1.5-3"></path>
                      <path d="m7 3 3 6h4"></path>
                    </svg>
                  </div>
                  <span className="quick-selector-text">AC Repair</span>
                </Link>

                <Link to="/services?service=electrician" className="quick-selector-item">
                  <div className="quick-selector-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                    </svg>
                  </div>
                  <span className="quick-selector-text">Electrician</span>
                </Link>

                <Link to="/services?service=plumber" className="quick-selector-item">
                  <div className="quick-selector-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
                    </svg>
                  </div>
                  <span className="quick-selector-text">Plumbing</span>
                </Link>
              </div>

            </div>
            <div className="relative w-full min-h-[350px] md:min-h-[500px] flex justify-center items-end bg-gradient-to-t from-gray-100 to-transparent rounded-3xl overflow-hidden">
              <img
                alt="AiroFox Professional"
                className="object-contain w-full h-full max-h-[500px]"
                src="/NewHero.jpeg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Animated Ticker Strip */}
      <div className="bg-white border-y border-brand-border">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {['Faster Arrival','Expert Technicians','Transparent Pricing','Same Day Service','Verified Professionals','No Hidden Charges','5★ Rated Platform','Faster Arrival','Expert Technicians','Transparent Pricing','Same Day Service','Verified Professionals','No Hidden Charges','5★ Rated Platform'].map((t,i) => (
              <span key={i} className="ticker-item"><span className="ticker-dot" />{t}</span>
            ))}
          </div>
        </div>
      </div>



      {/* Consolidated Premium Service Dashboard */}
      <section ref={dashRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-block bg-brand-orange/15 text-brand-orange px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Premium Home Care
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
              Book Certified Services In Seconds
            </h2>
            <p className="mt-4 text-brand-slate max-w-2xl mx-auto text-sm md:text-base">
              Vetted technicians, upfront standard pricing, and same-day scheduling. Choose a service below to get started.
            </p>
          </div>

          <div className="dashboard-grid">
            {/* Card 1: AC Repair */}
            <Link to="/services?service=ac" className="dashboard-card group">
              <div>
                <div className="dashboard-icon-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m10 20-1.25-2.5L6 18"></path>
                    <path d="M10 4 8.75 6.5 6 6"></path>
                    <path d="m14 20 1.25-2.5L18 18"></path>
                    <path d="m14 4 1.25 2.5L18 6"></path>
                    <path d="m17 21-3-6h-4"></path>
                    <path d="m17 3-3 6 1.5 3"></path>
                    <path d="M2 12h6.5L10 9"></path>
                    <path d="m20 10-1.5 2 1.5 2"></path>
                    <path d="M22 12h-6.5L14 15"></path>
                    <path d="m4 10 1.5 2L4 14"></path>
                    <path d="m7 21 3-6-1.5-3"></path>
                    <path d="m7 3 3 6h4"></path>
                  </svg>
                </div>
                <h3 className="dashboard-card-title">AC Repairs & Servicing</h3>
                <p className="dashboard-card-desc">Deep cleaning, filter maintenance, leak fixes, gas refilling, and professional installations.</p>
                <div className="dashboard-card-tags">
                  <span className="dashboard-card-tag">Gas Refill</span>
                  <span className="dashboard-card-tag">Filter Clean</span>
                  <span className="dashboard-card-tag">Fast Cooling</span>
                </div>
              </div>
              <div className="dashboard-card-footer">
                <div className="dashboard-price">Starts <span>₹499</span></div>
                <div className="dashboard-arrow">Book Now &rarr;</div>
              </div>
            </Link>

            {/* Card 2: Electrician */}
            <Link to="/services?service=electrician" className="dashboard-card group">
              <div>
                <div className="dashboard-icon-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                  </svg>
                </div>
                <h3 className="dashboard-card-title">Electrical Works</h3>
                <p className="dashboard-card-desc">Wiring repair, appliance installation, switchboard repair, panel upgrades, and emergency diagnostics.</p>
                <div className="dashboard-card-tags">
                  <span className="dashboard-card-tag">Wiring</span>
                  <span className="dashboard-card-tag">Switches</span>
                  <span className="dashboard-card-tag">Safety Checked</span>
                </div>
              </div>
              <div className="dashboard-card-footer">
                <div className="dashboard-price">Starts <span>₹299</span></div>
                <div className="dashboard-arrow">Book Now &rarr;</div>
              </div>
            </Link>

            {/* Card 3: Plumbing */}
            <Link to="/services?service=plumber" className="dashboard-card group">
              <div>
                <div className="dashboard-icon-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"></path>
                    <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"></path>
                  </svg>
                </div>
                <h3 className="dashboard-card-title">Professional Plumbing</h3>
                <p className="dashboard-card-desc">Leaky tap repairs, drainage clearance, pipe fitting, faucet replacement, and complete bathroom setup.</p>
                <div className="dashboard-card-tags">
                  <span className="dashboard-card-tag">Leak Fix</span>
                  <span className="dashboard-card-tag">Drain Clean</span>
                  <span className="dashboard-card-tag">Fittings</span>
                </div>
              </div>
              <div className="dashboard-card-footer">
                <div className="dashboard-price">Starts <span>₹399</span></div>
                <div className="dashboard-arrow">Book Now &rarr;</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="inline-flex rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white">
            How It Works
          </div>
          <h2 className="mt-6 text-4xl md:text-6xl font-light text-brand-navy">
            How does this actually work?
          </h2>

          {/* Desktop Steps Layout */}
          <div className="relative mt-24 hidden md:block">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-slate-300"></div>
            <div className="grid grid-cols-4 items-center relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center relative">
                <div className="h-20 w-20 rounded-full bg-brand-navy text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                  1
                </div>
                <p className="mt-8 text-center max-w-[150px] text-brand-slate font-medium">
                  Select a service
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative">
                <p className="mb-8 text-center max-w-[150px] text-brand-slate font-medium">
                  Choose your time slot
                </p>
                <div className="h-20 w-20 rounded-full bg-brand-navy text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                  2
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center relative">
                <div className="h-20 w-20 rounded-full bg-brand-navy text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                  3
                </div>
                <p className="mt-8 text-center max-w-[150px] text-brand-slate font-medium">
                  Confirm booking
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center relative">
                <p className="mb-8 text-center max-w-[150px] text-brand-slate font-medium">
                  Track expert live
                </p>
                <div className="h-20 w-20 rounded-full bg-brand-navy text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                  4
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Steps Layout */}
          <div className="md:hidden mt-12 space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border p-4 border-gray-200 bg-white shadow-sm">
              <div className="h-14 w-14 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <p className="font-medium text-brand-slate">Select a service</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border p-4 border-gray-200 bg-white shadow-sm">
              <div className="h-14 w-14 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <p className="font-medium text-brand-slate">Choose your time slot</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border p-4 border-gray-200 bg-white shadow-sm">
              <div className="h-14 w-14 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <p className="font-medium text-brand-slate">Confirm booking</p>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border p-4 border-gray-200 bg-white shadow-sm">
              <div className="h-14 w-14 rounded-full bg-brand-navy text-white flex items-center justify-center font-bold text-xl">
                4
              </div>
              <p className="font-medium text-brand-slate">Track expert live</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section ref={promoRef} className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className={`bg-brand-orange rounded-3xl p-10 md:p-12 text-white text-center shadow-lg transform hover:scale-[1.01] transition-all duration-500 ${promoVis ? 'reveal-scale' : 'reveal-scale-hidden'}`}>
            <p style={{fontSize:'12px',fontWeight:700,letterSpacing:'0.12em',marginBottom:'8px',opacity:0.85}}>LIMITED TIME OFFER</p>
            <h2 className="shimmer-text text-3xl md:text-4xl font-bold uppercase tracking-wide">
              10% OFF ON YOUR FIRST BOOKING
            </h2>
            <p style={{marginTop:'12px',fontSize:'14px',opacity:0.9}}>Use code <strong>AIROFOX10</strong> when you call or WhatsApp us.</p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section ref={testimRef} className="py-16 bg-gray-50 border-t border-brand-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className={`mb-8 ${testimVis ? 'reveal-up' : 'reveal-hidden'}`}>
            <span style={{fontSize:'12px',fontWeight:700,color:'#ff7a00',letterSpacing:'0.1em',textTransform:'uppercase'}}>What Our Customers Say</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mt-2">Trusted by Thousands</h2>
            <p className="text-brand-slate mt-2 text-sm md:text-base">Real reviews from real Mumbai homes.</p>
          </div>
          <div className={`testimonial-track ${testimVis ? 'reveal-up d2' : 'reveal-hidden'}`}>
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'4px'}}>
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-area">{t.area}, Mumbai</p>
                  </div>
                  <div style={{marginLeft:'auto',display:'flex',gap:'2px'}}>
                    {[...Array(t.stars)].map((_,s) => (
                      <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#ff7a00" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">{t.text}</p>
              </div>
            ))}
          </div>
          <p style={{textAlign:'center',fontSize:'12px',color:'#94a3b8',marginTop:'12px'}}>
            ← Swipe to read more reviews
          </p>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {['Dadar', 'Parel', 'Lalbaug', 'Matunga'].map((loc) => (
              <span
                key={loc}
                className="px-6 py-2.5 rounded-full bg-brand-orange shadow-md text-white font-semibold hover:bg-brand-navy hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-brand-slate max-w-2xl mx-auto">
              Everything you need to know before booking
            </p>
          </div>

          <div className="max-w-4xl mx-auto mt-10 space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border rounded-2xl bg-white px-6 shadow-sm border-gray-100 transition-all duration-300"
                >
                  <h3>
                    <div
                      onClick={() => toggleFaq(idx)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleFaq(idx); }}
                      className="group relative flex flex-1 items-center justify-between w-full py-5 text-left font-semibold text-brand-navy hover:text-brand-orange text-base md:text-lg transition-colors outline-none cursor-pointer"
                    >
                      <span>{item.q}</span>
                      {isOpen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-brand-orange transition-transform duration-300"
                        >
                          <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-brand-slate group-hover:text-brand-orange transition-transform duration-300"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      )}
                    </div>
                  </h3>
                  {isOpen && (
                    <div className="pb-6 text-brand-slate text-sm md:text-base leading-relaxed animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urgent Help Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="rounded-3xl bg-brand-navy p-10 md:p-16 text-white text-center shadow-xl">
            <h2 className="text-3xl md:text-5xl font-bold">Need Urgent Help?</h2>
            <p className="mt-4 text-gray-300 max-w-xl mx-auto">
              Contact AiroFox now for quick and reliable service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a
                href="tel:+919326065836"
                className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 shadow-md gap-2 bg-white text-brand-navy hover:bg-brand-orange hover:text-white sm:min-w-[180px]"
                style={{ padding: '16px 28px' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-phone"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
                Book Now
              </a>
              <a
                href="https://wa.me/919326065836?text=Hi%20AiroFox%2C%20I%20need%20help%20with%20home%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all duration-300 bg-green-500 text-white hover:bg-green-600 shadow-md gap-2 sm:min-w-[180px]"
                style={{ padding: '16px 28px' }}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 448 512"
                  height="18"
                  width="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
