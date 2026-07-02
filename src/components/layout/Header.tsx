"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const NAV = [
  {
    name: 'Home', path: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    name: 'Services', path: '/services',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>
      </svg>
    ),
  },
  {
    name: 'About', path: '/about',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    name: 'Contact', path: '/contact',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
      </svg>
    ),
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid #e8edf3',
        boxShadow: '0 1px 12px rgba(8,36,76,0.06)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 16px', height: '64px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img alt="AiroFox" width="44" height="44" style={{ borderRadius: '10px', objectFit: 'cover' }} src="/logo.jpeg" />
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#08244c', letterSpacing: '-0.02em' }}>AiroFox</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(l => (
              <Link key={l.name} href={l.path} style={{
                fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                color: pathname === l.path ? '#ff7a00' : '#334155',
                transition: 'color 0.2s',
              }}>{l.name}</Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/login"
              style={{
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'none',
                color: pathname === '/login' || pathname === '/register' ? '#ff7a00' : '#334155',
                transition: 'color 0.2s',
              }}
            >
              Sign In
            </Link>
            <a href="tel:+919326065836" className="flex items-center justify-center" style={{ background: '#08244c', color: '#fff', textDecoration: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', transition: 'background 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ff7a00'}
              onMouseLeave={e => e.currentTarget.style.background = '#08244c'}>
              Book Now
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex items-center justify-center"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              background: open ? '#f8fafc' : 'transparent',
              border: '1.5px solid',
              borderColor: open ? '#e2e8f0' : 'transparent',
              borderRadius: '10px', padding: '8px',
              cursor: 'pointer', color: '#08244c',
              transition: 'all 0.2s',
            }}>
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile Bottom Sheet ─────────────────────── */}

      {/* Backdrop */}
      <div
        className="md:hidden"
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 48,
          background: 'rgba(8,36,76,0.45)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />

      {/* Sheet */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 49,
          background: '#ffffff',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -8px 40px rgba(8,36,76,0.18)',
          transform: open ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', paddingTop: '12px', paddingBottom: '4px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '99px', background: '#e2e8f0' }} />
        </div>

        {/* Sheet header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img alt="AiroFox" width="38" height="38" style={{ borderRadius: '9px', objectFit: 'cover' }} src="/logo.jpeg" />
            <div>
              <p style={{ fontWeight: 800, fontSize: '16px', color: '#08244c', margin: 0 }}>AiroFox</p>
              <p style={{ fontSize: '11px', color: '#00c758', fontWeight: 600, margin: 0 }}>● Accepting bookings</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#f1f5f9', margin: '0 20px' }} />

        {/* Nav links */}
        <nav style={{ padding: '8px 12px' }}>
          {NAV.map((link, idx) => {
            const active = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 12px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  marginBottom: idx < NAV.length - 1 ? '4px' : 0,
                  background: active ? 'rgba(255,122,0,0.08)' : 'transparent',
                  color: active ? '#ff7a00' : '#334155',
                  fontWeight: active ? 700 : 600,
                  fontSize: '15px',
                  transition: 'all 0.18s ease',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                <span style={{
                  width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
                  background: active ? 'rgba(255,122,0,0.12)' : '#f8fafc',
                  color: active ? '#ff7a00' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${active ? 'rgba(255,122,0,0.2)' : '#f1f5f9'}`,
                  transition: 'all 0.18s ease',
                }}>
                  {link.icon}
                </span>
                {link.name}
                {active && (
                  <span style={{ marginLeft: 'auto', width: '7px', height: '7px', borderRadius: '50%', background: '#ff7a00' }} />
                )}
              </Link>
            );
          })}

          {/* Mobile Sign In */}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 12px',
              borderRadius: '14px',
              textDecoration: 'none',
              marginTop: '4px',
              background: pathname === '/login' || pathname === '/register' ? 'rgba(255,122,0,0.08)' : 'transparent',
              color: pathname === '/login' || pathname === '/register' ? '#ff7a00' : '#334155',
              fontWeight: pathname === '/login' || pathname === '/register' ? 700 : 600,
              fontSize: '15px',
              transition: 'all 0.18s ease',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{
              width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
              background: pathname === '/login' || pathname === '/register' ? 'rgba(255,122,0,0.12)' : '#f8fafc',
              color: pathname === '/login' || pathname === '/register' ? '#ff7a00' : '#64748b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1.5px solid ${pathname === '/login' || pathname === '/register' ? 'rgba(255,122,0,0.2)' : '#f1f5f9'}`,
              transition: 'all 0.18s ease',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </span>
            Sign In / Register
            {(pathname === '/login' || pathname === '/register') && (
              <span style={{ marginLeft: 'auto', width: '7px', height: '7px', borderRadius: '50%', background: '#ff7a00' }} />
            )}
          </Link>
        </nav>

        {/* Divider */}
        <div style={{ height: '1px', background: '#f1f5f9', margin: '8px 20px' }} />

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '10px', padding: '12px 20px 20px' }}>
          <a
            href="tel:+919326065836"
            style={{
              flex: 1, padding: '17px 0', borderRadius: '14px',
              background: '#08244c', color: '#fff', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
            </svg>
            Book Now
          </a>
          <a
            href="https://wa.me/919326065836?text=Hi%20AiroFox%2C%20I%20need%20to%20book%20a%20service."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, padding: '17px 0', borderRadius: '14px',
              background: '#00c758', color: '#fff', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
