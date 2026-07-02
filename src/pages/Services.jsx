import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Services() {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service');

  const acRef = useRef(null);
  const electricianRef = useRef(null);
  const plumberRef = useRef(null);

  useEffect(() => {
    if (serviceParam) {
      let targetRef = null;
      if (serviceParam === 'ac-repair' || serviceParam === 'ac') {
        targetRef = acRef;
      } else if (serviceParam === 'electrician') {
        targetRef = electricianRef;
      } else if (serviceParam === 'plumber') {
        targetRef = plumberRef;
      }

      if (targetRef && targetRef.current) {
        setTimeout(() => {
          targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [serviceParam]);

  const servicesData = [
    {
      id: 'ac-repair',
      ref: acRef,
      title: 'AC & Appliances Repair',
      desc: 'Fast diagnostics and repairs for essential appliances.',
      img: '/services/ac.jpeg',
      tags: ['AC Service', 'Gas Refill', 'Refrigerator Repair', 'Washing Machine'],
    },
    {
      id: 'electrician',
      ref: electricianRef,
      title: 'Electrician',
      desc: 'Safe and professional electrical solutions.',
      img: '/services/electrician.jpg',
      tags: ['Wiring', 'Switchboard Repair', 'Fan Installation', 'Inverter Setup'],
    },
    {
      id: 'plumber',
      ref: plumberRef,
      title: 'Plumber',
      desc: 'From minor leaks to major plumbing fixes.',
      img: '/services/plumber.jpg',
      tags: ['Leak Repair', 'Pipe Fitting', 'Tap Replacement', 'Bathroom Plumbing'],
    }
  ];

  return (
    <div className="flex-grow">
      {/* Hero Header */}
      <section className="py-24 bg-gradient-to-b from-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="inline-block bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-semibold">
            Our Services
          </p>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold text-brand-navy">
            Professional Home Services
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-brand-slate">
            Quick, reliable and affordable repairs at your doorstep.
          </p>
        </div>
      </section>

      {/* Services List Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 space-y-12">
          {servicesData.map((service) => {
            const isHighlighted = serviceParam === service.id;
            return (
              <div
                key={service.id}
                ref={service.ref}
                className={`grid md:grid-cols-2 gap-8 items-center rounded-3xl p-6 md:p-10 transition-all duration-500 border-2 ${
                  isHighlighted
                    ? 'border-brand-orange shadow-[0_0_30px_rgba(255,122,0,0.15)] scale-[1.01] bg-brand-navy'
                    : 'border-transparent hover:shadow-2xl bg-brand-navy'
                }`}
              >
                {/* Image */}
                <div className="relative w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden shadow-lg">
                  <img
                    alt={service.title}
                    src={service.img}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-gray-300 text-base md:text-lg">
                    {service.desc}
                  </p>

                  {/* Tags */}
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    {service.tags.map((tag) => (
                      <div
                        key={tag}
                        className="px-4 py-3 rounded-xl bg-white/10 text-sm md:text-base font-medium text-white hover:bg-brand-orange transition-all duration-300 cursor-default"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-4 mt-10">
                    <a
                      href="tel:+919326065836"
                      className="inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 gap-2 bg-transparent text-white hover:bg-white/10"
                      style={{ padding: '14px 28px' }}
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
                      Call Now
                    </a>
                    <a
                      href={`https://wa.me/919326065836?text=Hi%20AiroFox%2C%20I%20need%20help%20with%20${encodeURIComponent(service.title)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 bg-green-500 text-white hover:bg-green-600 hover:-translate-y-0.5 shadow-md gap-2"
                      style={{ padding: '14px 28px' }}
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
            );
          })}
        </div>
      </section>

      {/* Specs / Why Choose Us Section */}
      <section className="py-24 bg-gray-50 border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Same Day Service */}
            <div className="rounded-3xl bg-brand-navy p-8 text-white text-center shadow-xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                <div className="w-14 h-14 rounded-full bg-brand-orange/15 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-zap text-white animate-pulse"
                  >
                    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold">Same Day Service</h3>
            </div>

            {/* Verified Experts */}
            <div className="rounded-3xl bg-brand-navy p-8 text-white text-center shadow-xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                <div className="w-14 h-14 rounded-full bg-brand-orange/15 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shield-check text-white"
                  >
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold">Verified Experts</h3>
            </div>

            {/* Transparent Pricing */}
            <div className="rounded-3xl bg-brand-navy p-8 text-white text-center shadow-xl border border-white/10 hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                <div className="w-14 h-14 rounded-full bg-brand-orange/15 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-badge-indian-rupee text-white"
                  >
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path>
                    <path d="M8 8h8"></path>
                    <path d="M8 12h8"></path>
                    <path d="m13 17-5-1h1a4 4 0 0 0 0-8"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-semibold">Transparent Pricing</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
