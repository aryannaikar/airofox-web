"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { Bell, Sun, Moon, Check, Search } from 'lucide-react';
import { db, supabase, isSupabaseConfigured } from '@/lib/db';
import { detailedServices } from '@/lib/servicesPricing';


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
    name: 'Contact Us', path: '/contact',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
      </svg>
    ),
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, phone?: string, address?: string} | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '', address: '' });
  const [isLocating, setIsLocating] = useState(false);
  const pathname = usePathname();
  const { handleProtectedAction } = useProtectedAction();

  const handleLogout = async () => {
    localStorage.removeItem('af_logged_user');
    setUser(null);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Error signing out from Supabase:', e);
      }
    }
    window.location.reload();
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await db.updateUser(user.email, profileData);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('af_logged_user', JSON.stringify(updatedUser));
      setShowProfileModal(false);
    } catch(e) {
      console.error(e);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        let addressStr = '';

        // Try Nominatim first for precise street/area level data
        try {
          const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const nomData = await nomRes.json();
          if (nomData && nomData.address) {
            const addr = nomData.address;
            const parts = [
              addr.amenity,
              addr.road,
              addr.neighbourhood,
              addr.suburb,
              addr.city_district,
              addr.city || addr.town || addr.village,
              addr.state,
              addr.postcode
            ].filter(Boolean); // Remove undefined/null/empty strings
            
            if (parts.length > 0) {
              // Deduplicate adjacent identical parts
              const uniqueParts = parts.filter((part, idx) => idx === 0 || part !== parts[idx - 1]);
              addressStr = uniqueParts.join(', ');
            } else if (nomData.display_name) {
              addressStr = nomData.display_name;
            }
          }
        } catch (e) {
          console.log("Nominatim failed, trying fallback...");
        }

        // Fallback to BigDataCloud if Nominatim fails or blocks the request
        if (!addressStr || addressStr.length < 5) {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await res.json();
          
          if (data.locality) addressStr += data.locality + ', ';
          if (data.city && data.city !== data.locality) addressStr += data.city + ', ';
          if (data.principalSubdivision) addressStr += data.principalSubdivision + ', ';
          if (data.countryName) addressStr += data.countryName;
          addressStr = addressStr.replace(/,\s*$/, "");
        }
        
        if (addressStr) {
          setProfileData(prev => ({ ...prev, address: addressStr }));
        } else {
          alert("Could not determine precise address from location");
        }
      } catch (e) {
        console.error(e);
        alert("Failed to get address from location");
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      setIsLocating(false);
      if (error.code === error.PERMISSION_DENIED) {
        alert("Location access was denied. Please allow location access in your browser settings.");
      } else {
        alert("Unable to retrieve your location. Please try again.");
      }
    }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('af_logged_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        setProfileData({
          name: u.name || '',
          phone: u.phone || '',
          address: u.address || ''
        });
      } catch(e) {}
    }
  }, [pathname]);

  // Load and poll notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (user) {
        const list = await db.getNotifications(user.email);
        setNotifications(list);
      } else {
        setNotifications([]);
      }
    };
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    for (const notif of notifications) {
      if (!notif.read) {
        await db.markNotificationRead(notif.id);
      }
    }
    const list = await db.getNotifications(user.email);
    setNotifications(list);
  };

  const handleMarkOneRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await db.markNotificationRead(id);
    if (user) {
      const list = await db.getNotifications(user.email);
      setNotifications(list);
    }
  };

  // Close on route change
  useEffect(() => {
    if (open) {
      setOpen(false);
    }
  }, [pathname]);

  // Search Logic
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase();
      const results: any[] = [];
      detailedServices.forEach(cat => {
        if (cat.category.toLowerCase().includes(query)) {
          results.push({ type: 'Category', name: cat.category, catId: cat.id });
        }
        cat.subcategories.forEach(sub => {
          if (sub.name.toLowerCase().includes(query)) {
            results.push({ type: 'Subcategory', name: sub.name, catId: cat.id });
          }
          sub.services.forEach(srv => {
            if (srv.name.toLowerCase().includes(query)) {
              results.push({ type: 'Service', name: srv.name, catId: cat.id });
            }
            srv.variants.forEach(v => {
              if (v.name.toLowerCase().includes(query)) {
                results.push({ type: 'Service', name: v.name, catId: cat.id });
              }
            });
          });
        });
      });
      // Deduplicate by name and take top 6
      const unique = Array.from(new Set(results.map(r => r.name))).map(name => results.find(r => r.name === name)).slice(0, 6);
      setSearchResults(unique);
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  }, [searchQuery]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/worker')) {
    return null;
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 9999,
        background: theme === 'dark' ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e8edf3',
        boxShadow: theme === 'dark' ? '0 1px 12px rgba(0,0,0,0.3)' : '0 1px 12px rgba(8,36,76,0.06)',
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 16px', height: '64px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img alt="AiroFox" width="44" height="44" style={{ borderRadius: '10px', objectFit: 'cover' }} src="/logo.jpeg" />
            <span style={{ fontWeight: 800, fontSize: '18px', color: theme === 'dark' ? '#f8fafc' : '#08244c', letterSpacing: '-0.02em' }}>AiroFox</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 xl:gap-8">
            {NAV.map(l => (
              <Link key={l.name} href={l.path} style={{
                fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                color: pathname === l.path ? '#ff7a00' : (theme === 'dark' ? '#cbd5e1' : '#334155'),
                transition: 'color 0.2s',
              }}>{l.name}</Link>
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex relative items-center ml-4 flex-grow max-w-xs xl:max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search services (e.g. AC Repair)..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.length > 1) setShowSearchDropdown(true) }}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none dark:text-white transition-all placeholder:text-slate-400"
              />
            </div>
            
            {/* Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div 
                className="absolute top-12 left-0 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="p-2">
                  {searchResults.map((res, idx) => (
                    <Link 
                      key={idx} 
                      href={`/services?service=${res.catId}`}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="block px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-navy dark:text-slate-200">{res.name}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{res.type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: theme === 'dark' ? '#cbd5e1' : '#334155',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              className="hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell Desktop */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme === 'dark' ? '#cbd5e1' : '#334155',
                    padding: '8px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                  className="hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#ff7a00',
                    }} />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '44px',
                      right: 0,
                      width: '320px',
                      background: theme === 'dark' ? '#111b33' : '#ffffff',
                      border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                      zIndex: 100,
                      maxHeight: '400px',
                      overflowY: 'auto',
                      padding: '12px'
                    }}
                    className="no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '8px', borderBottom: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 800, fontSize: '13px', color: theme === 'dark' ? '#cbd5e1' : '#08244c' }}>Notifications</span>
                      {notifications.some(n => !n.read) && (
                        <button
                          onClick={markAllRead}
                          style={{ background: 'none', border: 'none', color: '#ff7a00', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          className="hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p style={{ textAlign: 'center', padding: '24px 0', fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        No notifications yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            style={{
                              padding: '10px',
                              borderRadius: '10px',
                              background: n.read ? 'transparent' : (theme === 'dark' ? 'rgba(255,122,0,0.06)' : 'rgba(255,122,0,0.04)'),
                              border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #f1f5f9',
                              position: 'relative'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <span style={{ fontWeight: 700, fontSize: '12px', color: theme === 'dark' ? '#f1f5f9' : '#08244c' }}>{n.title}</span>
                              {!n.read && (
                                <button
                                  onClick={(e) => handleMarkOneRead(n.id, e)}
                                  style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', color: '#94a3b8' }}
                                  className="hover:text-emerald-500"
                                  title="Mark as read"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <p style={{ fontSize: '11px', color: theme === 'dark' ? '#94a3b8' : '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>{n.message}</p>
                            <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: '6px', textAlign: 'right' }}>{n.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  onClick={() => setShowProfileModal(true)}
                  style={{ fontWeight: 600, fontSize: '15px', color: theme === 'dark' ? '#cbd5e1' : '#08244c', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  className="hover:text-brand-orange dark:hover:text-brand-orange transition-colors"
                >
                  Hi, {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#ff7a00',
                    background: 'rgba(255,122,0,0.1)',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,122,0,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,122,0,0.1)'}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  fontWeight: 600,
                  fontSize: '15px',
                  textDecoration: 'none',
                  color: pathname === '/login' || pathname === '/register' ? '#ff7a00' : (theme === 'dark' ? '#cbd5e1' : '#334155'),
                  transition: 'color 0.2s',
                }}
              >
                Sign In
              </Link>
            )}
            <a href="tel:+919326065836" className="flex items-center justify-center gap-2" style={{ background: theme === 'dark' ? '#ff7a00' : '#08244c', color: '#fff', textDecoration: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, fontSize: '14px', transition: 'background 0.25s' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = theme === 'dark' ? '#e06c00' : '#ff7a00'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = theme === 'dark' ? '#ff7a00' : '#08244c'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
              Call Us
            </a>
          </div>

          {/* Mobile Right Controls Container */}
          <div className="flex md:hidden items-center gap-2">
            
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: theme === 'dark' ? '#cbd5e1' : '#334155',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notification Bell Mobile */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: theme === 'dark' ? '#cbd5e1' : '#334155',
                    padding: '6px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#ff7a00',
                    }} />
                  )}
                </button>

                {/* Notifications Dropdown (Mobile) */}
                {showNotifDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '40px',
                      right: '-40px',
                      width: '280px',
                      background: theme === 'dark' ? '#111b33' : '#ffffff',
                      border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
                      zIndex: 100,
                      maxHeight: '350px',
                      overflowY: 'auto',
                      padding: '12px'
                    }}
                    className="no-scrollbar"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '8px', borderBottom: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 800, fontSize: '12px', color: theme === 'dark' ? '#cbd5e1' : '#08244c' }}>Notifications</span>
                      {notifications.some(n => !n.read) && (
                        <button
                          onClick={markAllRead}
                          style={{ background: 'none', border: 'none', color: '#ff7a00', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                          className="hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p style={{ textAlign: 'center', padding: '16px 0', fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                        No notifications yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {notifications.map(n => (
                          <div
                            key={n.id}
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                              background: n.read ? 'transparent' : (theme === 'dark' ? 'rgba(255,122,0,0.06)' : 'rgba(255,122,0,0.04)'),
                              border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #f1f5f9',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <span style={{ fontWeight: 700, fontSize: '11px', color: theme === 'dark' ? '#f1f5f9' : '#08244c' }}>{n.title}</span>
                              {!n.read && (
                                <button
                                  onClick={(e) => handleMarkOneRead(n.id, e)}
                                  style={{ background: 'none', border: 'none', padding: '1px', cursor: 'pointer', color: '#94a3b8' }}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <p style={{ fontSize: '10px', color: theme === 'dark' ? '#94a3b8' : '#64748b', margin: '2px 0 0 0', lineHeight: 1.3 }}>{n.message}</p>
                            <span style={{ fontSize: '8px', color: '#94a3b8', display: 'block', marginTop: '4px', textAlign: 'right' }}>{n.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Hamburger */}
            <button
              className="flex items-center justify-center"
              onClick={() => setOpen(o => !o)}
              aria-label="Toggle menu"
              style={{
                background: open ? (theme === 'dark' ? '#1e293b' : '#f8fafc') : 'transparent',
                border: '1.5px solid',
                borderColor: open ? (theme === 'dark' ? '#334155' : '#e2e8f0') : 'transparent',
                borderRadius: '10px', padding: '8px',
                cursor: 'pointer', color: theme === 'dark' ? '#cbd5e1' : '#08244c',
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
        </div>
      </header>

      {/* ── Mobile Bottom Sheet ─────────────────────── */}

      {/* Backdrop */}
      <div
        className="md:hidden"
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(8,36,76,0.45)',
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
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
          background: theme === 'dark' ? '#111b33' : '#ffffff',
          borderRadius: '24px 24px 0 0',
          boxShadow: theme === 'dark' ? '0 -8px 40px rgba(0,0,0,0.4)' : '0 -8px 40px rgba(8,36,76,0.18)',
          transform: open ? 'translateY(0)' : 'translateY(110%)',
          visibility: open ? 'visible' : 'hidden',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), visibility 0.35s',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'center', paddingTop: '12px', paddingBottom: '4px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '99px', background: theme === 'dark' ? '#1e293b' : '#e2e8f0' }} />
        </div>

        {/* Sheet header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img alt="AiroFox" width="38" height="38" style={{ borderRadius: '9px', objectFit: 'cover' }} src="/logo.jpeg" />
            <div>
              <p style={{ fontWeight: 800, fontSize: '16px', color: theme === 'dark' ? '#f8fafc' : '#08244c', margin: 0 }}>AiroFox</p>
              <p style={{ fontSize: '11px', color: '#00c758', fontWeight: 600, margin: 0 }}>● Accepting bookings</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: theme === 'dark' ? '#1e293b' : '#f8fafc', border: theme === 'dark' ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: theme === 'dark' ? '#1e293b' : '#f1f5f9', margin: '0 20px' }} />

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
                  color: active ? '#ff7a00' : (theme === 'dark' ? '#cbd5e1' : '#334155'),
                  fontWeight: active ? 700 : 600,
                  fontSize: '15px',
                  transition: 'all 0.18s ease',
                  WebkitTapHighlightColor: 'transparent',
                }}>
                <span style={{
                  width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
                  background: active ? 'rgba(255,122,0,0.12)' : (theme === 'dark' ? '#1e293b' : '#f8fafc'),
                  color: active ? '#ff7a00' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1.5px solid ${active ? 'rgba(255,122,0,0.2)' : (theme === 'dark' ? '#334155' : '#f1f5f9')}`,
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

          {/* Mobile Search Bar */}
          <div className="mt-4 mb-2 px-2 relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search services..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.length > 1) setShowSearchDropdown(true) }}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-orange outline-none dark:text-white transition-all placeholder:text-slate-400"
              />
            </div>
            
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-14 left-2 right-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-2">
                  {searchResults.map((res, idx) => (
                    <Link 
                      key={idx} 
                      href={`/services?service=${res.catId}`}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                        setOpen(false);
                      }}
                      className="block px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-navy dark:text-slate-200">{res.name}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{res.type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Sign In */}
          {user ? (
            <div style={{ 
              padding: '16px 12px', 
              marginTop: '8px',
              background: theme === 'dark' ? '#1a274c' : '#f8fafc',
              borderRadius: '14px',
              border: theme === 'dark' ? '1px solid #1e293b' : '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button 
                onClick={() => { setOpen(false); setShowProfileModal(true); }}
                style={{ fontWeight: 700, fontSize: '15px', color: theme === 'dark' ? '#cbd5e1' : '#08244c', margin: 0, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
              >
                Hi, {user.name}
              </button>
              <button
                onClick={async () => {
                  setOpen(false);
                  await handleLogout();
                }}
                style={{
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#ff7a00',
                  background: 'rgba(255,122,0,0.1)',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
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
                color: pathname === '/login' || pathname === '/register' ? '#ff7a00' : (theme === 'dark' ? '#cbd5e1' : '#334155'),
                fontWeight: pathname === '/login' || pathname === '/register' ? 700 : 600,
                fontSize: '15px',
                transition: 'all 0.18s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{
                width: '40px', height: '40px', borderRadius: '11px', flexShrink: 0,
                background: pathname === '/login' || pathname === '/register' ? 'rgba(255,122,0,0.12)' : (theme === 'dark' ? '#1e293b' : '#f8fafc'),
                color: pathname === '/login' || pathname === '/register' ? '#ff7a00' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${pathname === '/login' || pathname === '/register' ? 'rgba(255,122,0,0.2)' : (theme === 'dark' ? '#334155' : '#f1f5f9')}`,
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
          )}
        </nav>

        {/* Divider */}
        <div style={{ height: '1px', background: theme === 'dark' ? '#1e293b' : '#f1f5f9', margin: '8px 20px' }} />

        {/* CTA buttons */}
        <div style={{ display: 'flex', gap: '10px', padding: '12px 20px 20px' }}>
          <a
            href="tel:+919326065836"
            onClick={() => setOpen(false)}
            style={{
              flex: 1, padding: '17px 0', borderRadius: '14px',
              background: theme === 'dark' ? '#ff7a00' : '#08244c', color: '#fff', fontWeight: 700, fontSize: '14px',
              textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
            Call Us
          </a>
          <a
            href="https://wa.me/919326065836"
            onClick={(e) => handleProtectedAction(e, 'whatsapp')}
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

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-lg text-brand-navy dark:text-white">Edit Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-brand-navy dark:text-slate-200 mb-1">Name</label>
                <input type="text" value={profileData.name} onChange={e => setProfileData(p => ({...p, name: e.target.value}))} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-navy dark:text-slate-200 mb-1">Phone</label>
                <input type="tel" value={profileData.phone} onChange={e => setProfileData(p => ({...p, phone: e.target.value}))} className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-white" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-brand-navy dark:text-slate-200">Address</label>
                  <button onClick={handleGetLocation} disabled={isLocating} className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1 disabled:opacity-50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    {isLocating ? 'Locating...' : 'Use Current Location'}
                  </button>
                </div>
                <textarea rows={3} value={profileData.address} onChange={e => setProfileData(p => ({...p, address: e.target.value}))} placeholder="Enter your full address..." className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-orange text-slate-800 dark:text-white resize-none" />
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button onClick={() => setShowProfileModal(false)} className="px-5 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={handleSaveProfile} className="px-5 py-2 rounded-xl font-semibold bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
