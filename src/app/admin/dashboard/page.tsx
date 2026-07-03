"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, LogOut, Search, UserCheck, UserX, Clock, ClipboardList, TrendingUp, Users, CheckCircle, XCircle, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import { db, WorkerProfile, Job, AppNotification } from '@/lib/db';
import { Bell } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'bookings' | 'notifications'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const loadData = async () => {
    setWorkers(await db.getWorkers());
    setJobs(await db.getJobs());
    setNotifications(await db.getNotifications('admin'));
  };

  // Load and check auth
  useEffect(() => {
    const token = localStorage.getItem('af_admin_token');
    if (token !== 'true') {
      router.push('/admin/login');
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthorized(true);
      loadData();
    }
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async (id: string) => {
    try {
      await db.approveWorker(id);
      await loadData();
      showToast('Worker approved successfully! They can now log in.');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Operation failed', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await db.rejectWorker(id);
      await loadData();
      showToast('Worker registration application declined.', 'error');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Operation failed', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('af_admin_token');
    router.push('/admin/login');
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-orange" />
          <p className="text-sm text-slate-400">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  // Filtered lists
  const pendingWorkers = workers.filter(w => w.status === 'pending');
  const approvedWorkers = workers.filter(w => w.status === 'approved');
  const rejectedWorkers = workers.filter(w => w.status === 'rejected');

  const filteredWorkers = workers.filter(w => {
    if (w.status !== activeTab) return false;
    return (
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.phone.includes(searchQuery)
    );
  });

  const filteredBookings = jobs.filter(j => {
    return (
      j.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.service_required.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Stats calculation
  const totalRevenue = jobs.filter(j => j.status === 'completed').reduce((sum, j) => sum + j.estimated_earnings, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-brand-slate flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-brand-border/60 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 mr-4 text-brand-slate hover:text-brand-navy transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-10 h-10 bg-brand-orange/10 rounded-xl border border-brand-orange/20 flex items-center justify-center text-brand-orange">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm md:text-lg text-brand-navy leading-none">AiroFox Operations</h1>
              <span className="text-[9px] md:text-[10px] font-bold text-brand-slate/60 uppercase tracking-widest">Secret Admin Console</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-brand-slate hover:text-brand-orange hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-6 space-y-5 md:space-y-8 animate-fade-in">
        
        {/* KPI Dashboard Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white border border-brand-border/60 p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1 sm:line-clamp-none">Awaiting Verification</p>
              <h3 className="text-2xl sm:text-3xl font-black text-brand-orange mt-0.5 sm:mt-1">{pendingWorkers.length}</h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-brand-orange flex-shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white border border-brand-border/60 p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1 sm:line-clamp-none">Verified Partners</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-0.5 sm:mt-1">{approvedWorkers.length}</h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white border border-brand-border/60 p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1 sm:line-clamp-none">Total Customer Jobs</p>
              <h3 className="text-2xl sm:text-3xl font-black text-brand-navy mt-0.5 sm:mt-1">{jobs.length}</h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-navy/5 border border-brand-navy/10 rounded-2xl flex items-center justify-center text-brand-navy flex-shrink-0">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          <div className="bg-white border border-brand-border/60 p-4 sm:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-all duration-300 gap-3 sm:gap-4">
            <div className="space-y-1">
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1 sm:line-clamp-none">Gross Booking Value</p>
              <h3 className="text-2xl sm:text-3xl font-black text-brand-navy mt-0.5 sm:mt-1">₹{totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl flex items-center justify-center text-brand-orange flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </section>

        {/* Tab Controls and Search */}
        <section className="bg-white border border-brand-border/60 rounded-3xl p-4 md:p-6 shadow-sm space-y-5">
          <div className="flex flex-col gap-4">
            {/* Tabs – horizontally scrollable on all screen sizes */}
            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-brand-border/60 w-max min-w-full">
                <button
                  onClick={() => { setActiveTab('pending'); setSearchQuery(''); }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex-1 ${
                    activeTab === 'pending'
                      ? 'bg-brand-orange text-white shadow-sm'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  Pending ({pendingWorkers.length})
                </button>
                <button
                  onClick={() => { setActiveTab('approved'); setSearchQuery(''); }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex-1 ${
                    activeTab === 'approved'
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  Active ({approvedWorkers.length})
                </button>
                <button
                  onClick={() => { setActiveTab('rejected'); setSearchQuery(''); }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex-1 ${
                    activeTab === 'rejected'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  Declined ({rejectedWorkers.length})
                </button>
                <button
                  onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex-1 ${
                    activeTab === 'bookings'
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  Bookings ({jobs.length})
                </button>
                <button
                  onClick={() => { setActiveTab('notifications'); setSearchQuery(''); }}
                  className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex-1 ${
                    activeTab === 'notifications'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-brand-slate hover:text-brand-navy'
                  }`}
                >
                  Alerts ({notifications.filter(n => !n.read).length || notifications.length})
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative md:w-80">
              <Search className="absolute left-4 inset-y-0 my-auto text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder={activeTab === 'bookings' ? "Search bookings or status..." : "Search name, skills, contact..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-brand-border/60 rounded-2xl text-xs focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 text-brand-navy transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* TAB CONTENTS: PARTNER APPLICATIONS */}
          {activeTab === 'notifications' ? (
            <div className="space-y-4 pt-2 animate-fade-in">
              {notifications.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-slate-50/50 rounded-2xl border border-brand-border/60">
                  <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">No active alerts.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-start justify-between gap-4 transition-all duration-300 ${notif.read ? 'border-brand-border/60 opacity-70' : 'border-amber-200 bg-amber-50/30'}`}>
                      <div>
                        <h4 className="font-bold text-sm text-brand-navy flex items-center gap-2">
                          <Bell className={`w-4 h-4 ${notif.read ? 'text-slate-400' : 'text-amber-500'}`} /> 
                          {notif.title}
                        </h4>
                        <p className="text-xs text-brand-slate/80 mt-1">{notif.message}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-2">{notif.date}</p>
                      </div>
                      {!notif.read && (
                        <button 
                          onClick={async () => {
                            await db.markNotificationRead(notif.id);
                            await loadData();
                          }} 
                          className="px-3 py-1.5 bg-white border border-brand-border rounded-lg text-[10px] font-bold text-brand-slate hover:text-brand-navy hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab !== 'bookings' ? (
            <div className="space-y-4 pt-2 animate-fade-in">
              {filteredWorkers.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-slate-50/50 rounded-2xl border border-brand-border/60">
                  <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">No records found matching current query.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredWorkers.map((worker) => (
                    <div
                      key={worker.id}
                      className="bg-slate-50/40 border border-brand-border/60 rounded-3xl p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center hover:bg-slate-50 hover:border-brand-orange/40 transition-all duration-300"
                    >
                      {/* Photo & Basic Details */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {worker.photo ? (
                          <img src={worker.photo} alt={worker.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md" />
                        ) : (
                          <div className="w-20 h-20 bg-brand-navy/5 text-brand-navy rounded-full flex items-center justify-center font-black text-2xl uppercase border border-brand-navy/10">
                            {worker.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-brand-navy">{worker.name}</h3>
                            <span className="text-xs text-slate-400 font-semibold">({worker.gender}, Age: {worker.age})</span>
                          </div>
                          
                          <p className="text-xs text-brand-slate/80 font-medium mt-1">
                            📞 {worker.phone} {worker.email && ` | ✉️ ${worker.email}`}
                          </p>
                          
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {worker.skills.map((skill) => (
                              <span key={skill} className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-white text-brand-navy border border-brand-border">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Professional and Payout details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:w-3/5 border-t lg:border-t-0 border-brand-border/60 pt-4 lg:pt-0">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience & Lang</p>
                          <p className="text-xs font-bold text-brand-navy mt-1">💼 {worker.experience}</p>
                          <p className="text-[11px] text-brand-slate/85 mt-0.5">🗣️ {worker.languages.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aadhaar Status</p>
                          <p className={`text-xs font-bold mt-1 inline-flex items-center gap-1 ${
                            worker.aadhaar_status === 'verified'
                              ? 'text-emerald-600'
                              : 'text-brand-orange'
                          }`}>
                            🛡️ {worker.aadhaar_status === 'verified' ? 'Verified' : 'Pending Verification'}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payout Info</p>
                          <p className="text-xs font-bold text-brand-navy mt-1">🏦 {worker.bank_name || 'N/A'}</p>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">{worker.upi_id || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      {worker.status === 'pending' && (
                        <div className="flex gap-2 w-full lg:w-auto border-t lg:border-t-0 border-brand-border/60 pt-4 lg:pt-0">
                          <button
                            onClick={() => handleReject(worker.id)}
                            className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-bold hover:bg-red-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <UserX className="w-4 h-4" /> Decline
                          </button>
                          <button
                            onClick={() => handleApprove(worker.id)}
                            className="flex-1 lg:flex-none px-5 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <UserCheck className="w-4 h-4" /> Verify & Accept
                          </button>
                        </div>
                      )}

                      {worker.status === 'approved' && (
                        <div className="w-full lg:w-auto text-right">
                          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            🟢 Verified Active
                          </span>
                        </div>
                      )}

                      {worker.status === 'rejected' && (
                        <div className="w-full lg:w-auto text-right">
                          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1">
                            🔴 Declined Request
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* TAB CONTENTS: BOOKINGS */
            <div className="space-y-4 pt-2 animate-fade-in">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-16 text-slate-400 bg-slate-50/50 rounded-2xl border border-brand-border/60">
                  <ClipboardList className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">No booking records found.</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="flex flex-col gap-3 md:hidden">
                    {filteredBookings.map((job) => (
                      <div key={job.id} className="bg-slate-50 rounded-2xl border border-brand-border/60 p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-extrabold text-sm text-brand-navy">{job.customer_name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{job.address}</p>
                          </div>
                          <span className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                            job.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : job.status === 'pending'
                              ? 'bg-brand-orange/5 text-brand-orange border-brand-orange/20'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {job.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t border-brand-border/60 pt-3">
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Service</p>
                            <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-brand-navy/5 text-brand-navy font-bold border border-brand-navy/10 text-[11px]">
                              {job.service_required}
                            </span>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Payout</p>
                            <p className="font-extrabold text-brand-orange text-sm mt-1">₹{job.estimated_earnings}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
                            <p className="text-[11px] font-semibold text-brand-slate mt-1">{job.date}</p>
                            <p className="text-[10px] text-slate-400">{job.preferred_time}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Distance</p>
                            <p className="text-[11px] font-semibold text-brand-slate mt-1">{job.distance}</p>
                          </div>
                        </div>
                        <p className="text-[9px] font-mono text-slate-400">ID: {job.id}</p>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto rounded-2xl border border-brand-border/60 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-brand-navy border-b border-brand-border/80 uppercase font-bold tracking-wider">
                          <th className="p-4">Job ID</th>
                          <th className="p-4">Customer Details</th>
                          <th className="p-4">Service Required</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4">Distance</th>
                          <th className="p-4">Payout</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredBookings.map((job) => (
                          <tr key={job.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-4 font-mono font-bold text-brand-slate/70">{job.id}</td>
                            <td className="p-4">
                              <p className="font-bold text-brand-navy">{job.customer_name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{job.address}</p>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-lg bg-brand-navy/5 text-brand-navy font-bold border border-brand-navy/10">
                                {job.service_required}
                              </span>
                            </td>
                            <td className="p-4">
                              <p className="text-brand-slate font-medium">{job.date}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{job.preferred_time}</p>
                            </td>
                            <td className="p-4 text-brand-slate font-semibold">{job.distance}</td>
                            <td className="p-4 font-bold text-brand-orange">₹{job.estimated_earnings}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${
                                job.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : job.status === 'pending'
                                  ? 'bg-brand-orange/5 text-brand-orange border-brand-orange/20 animate-pulse'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {job.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
