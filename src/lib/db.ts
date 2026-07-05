import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// Initialize Supabase Client (if keys are provided)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// TYPES
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  created_at: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  email?: string;
  age: number;
  gender: string;
  phone: string;
  photo: string; // Base64 or URL
  skills: string[];
  experience: string;
  languages: string[];
  status: 'pending' | 'approved' | 'rejected';
  online: boolean;
  rating: number;
  wallet_balance: number;
  bank_name: string;
  account_no: string;
  upi_id: string;
  aadhaar_status: 'pending' | 'verified' | 'unverified';
  working_hours: { [key: string]: string }; // e.g., { Monday: '9 AM - 8 PM' }
  holidays: string[]; // dates of holidays
  days_off: string[]; // days of the week, e.g. ['Wednesday']
  vacation_mode: boolean;
}

export interface Job {
  id: string;
  customer_name: string;
  service_required: string;
  distance: string;
  estimated_earnings: number;
  preferred_time: string;
  customer_rating: number;
  phone: string;
  address: string;
  status: 'pending' | 'accepted' | 'rejected' | 'on_the_way' | 'arrived' | 'started' | 'completed';
  worker_id: string | null;
  date: string;
}

export interface Review {
  id: string;
  worker_id: string;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppNotification {
  id: string;
  user_id: string; // worker_id or 'admin' or 'customer'
  title: string;
  message: string;
  date: string;
  read: boolean;
}

// ==========================================
// SEED DATA FOR LOCALSTORAGE FALLBACK
// ==========================================

const DEFAULT_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Test Customer',
    email: 'customer@example.com',
    phone: '9876543210',
    created_at: '2026-07-01',
  }
];

const DEFAULT_WORKERS: WorkerProfile[] = [
  {
    id: 'worker-1',
    name: 'Rahul Sharma',
    email: 'worker@airofox.com',
    age: 28,
    gender: 'Male',
    phone: '9876543210',
    photo: '/team/member1.jpg',
    skills: ['AC Repair', 'Electrical Wiring', 'Appliance Repair'],
    experience: '5 Years',
    languages: ['Hindi', 'English', 'Marathi'],
    status: 'approved',
    online: true,
    rating: 4.9,
    wallet_balance: 4850,
    bank_name: 'HDFC Bank',
    account_no: '50100432891234',
    upi_id: 'rahulsharma@okhdfcbank',
    aadhaar_status: 'verified',
    working_hours: {
      Monday: '9 AM - 8 PM',
      Tuesday: '9 AM - 8 PM',
      Wednesday: 'Off',
      Thursday: '9 AM - 8 PM',
      Friday: '9 AM - 8 PM',
      Saturday: '10 AM - 6 PM',
      Sunday: 'Off',
    },
    holidays: ['2026-08-15'],
    days_off: ['Wednesday', 'Sunday'],
    vacation_mode: false,
  },
  {
    id: 'worker-2',
    name: 'Amit Patel',
    email: 'amit@airofox.com',
    age: 32,
    gender: 'Male',
    phone: '9123456789',
    photo: '',
    skills: ['Plumbing', 'Leak Detection', 'Pipe Fitting'],
    experience: '8 Years',
    languages: ['Hindi', 'Gujarati'],
    status: 'pending',
    online: false,
    rating: 4.5,
    wallet_balance: 0,
    bank_name: 'State Bank of India',
    account_no: '30245678912',
    upi_id: 'amitpatel@oksbi',
    aadhaar_status: 'pending',
    working_hours: {
      Monday: '9 AM - 7 PM',
      Tuesday: '9 AM - 7 PM',
      Wednesday: '9 AM - 7 PM',
      Thursday: '9 AM - 7 PM',
      Friday: '9 AM - 7 PM',
      Saturday: '9 AM - 7 PM',
      Sunday: 'Off',
    },
    holidays: [],
    days_off: ['Sunday'],
    vacation_mode: false,
  }
];

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job-1',
    customer_name: 'Priya Sen',
    service_required: 'AC Deep Cleaning',
    distance: '1.8 km',
    estimated_earnings: 850,
    preferred_time: 'Today, 2:00 PM',
    customer_rating: 4.8,
    phone: '+91 98333 44555',
    address: 'Apt 402, Sea Breeze Heights, Bandra West, Mumbai',
    status: 'pending',
    worker_id: 'worker-1',
    date: '2026-07-03',
  },
  {
    id: 'job-2',
    customer_name: 'Karan Malhotra',
    service_required: 'AC Gas Refill',
    distance: '3.2 km',
    estimated_earnings: 1200,
    preferred_time: 'Today, 4:30 PM',
    customer_rating: 4.7,
    phone: '+91 98222 77888',
    address: 'Flat 12B, Windsor Towers, Oshiwara, Andheri West, Mumbai',
    status: 'pending',
    worker_id: 'worker-1',
    date: '2026-07-03',
  },
  {
    id: 'job-3',
    customer_name: 'Meera Nair',
    service_required: 'Short Circuit Repair',
    distance: '0.9 km',
    estimated_earnings: 450,
    preferred_time: 'Today, 10:00 AM',
    customer_rating: 4.9,
    phone: '+91 97111 22333',
    address: '601, Shanti Sadan, Carter Road, Bandra West, Mumbai',
    status: 'completed',
    worker_id: 'worker-1',
    date: '2026-07-03',
  },
  {
    id: 'job-4',
    customer_name: 'Rajesh Koothrapali',
    service_required: 'AC Installation',
    distance: '2.5 km',
    estimated_earnings: 1400,
    preferred_time: 'Yesterday, 3:00 PM',
    customer_rating: 4.6,
    phone: '+91 96555 44332',
    address: 'House 45, Gulmohar Road, Juhu, Mumbai',
    status: 'completed',
    worker_id: 'worker-1',
    date: '2026-07-02',
  },
  {
    id: 'job-5',
    customer_name: 'Suresh Kumar',
    service_required: 'Electrician Callout',
    distance: '1.2 km',
    estimated_earnings: 300,
    preferred_time: 'Yesterday, 11:30 AM',
    customer_rating: 5.0,
    phone: '+91 99888 77665',
    address: 'Block C, 302 Sky Apartments, Khar West, Mumbai',
    status: 'completed',
    worker_id: 'worker-1',
    date: '2026-07-02',
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    worker_id: 'worker-1',
    reviewer: 'Meera Nair',
    rating: 5,
    comment: 'Very professional. Arrived on time and solved the issue quickly. Highly recommend Rahul!',
    date: 'Today',
  },
  {
    id: 'rev-2',
    worker_id: 'worker-1',
    reviewer: 'Rajesh Koothrapali',
    rating: 4,
    comment: 'Clean installation of my split AC. Good work, minor cleanup required afterwards.',
    date: 'Yesterday',
  },
  {
    id: 'rev-3',
    worker_id: 'worker-1',
    reviewer: 'Suresh Kumar',
    rating: 5,
    comment: 'Quick and responsive. Fixed the switchboard error immediately.',
    date: '2 days ago',
  }
];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    user_id: 'worker-1',
    title: 'New Booking Request',
    message: 'You have a new AC Deep Cleaning request from Priya Sen (1.8 km away).',
    date: '10 mins ago',
    read: false,
  },
  {
    id: 'notif-2',
    user_id: 'worker-1',
    title: 'Payment Received',
    message: '₹450 has been credited to your wallet for Meera Nair\'s booking.',
    date: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    user_id: 'worker-1',
    title: 'Profile Approved',
    message: 'Welcome to AiroFox! Your profile has been verified and approved by the administrator.',
    date: '1 day ago',
    read: true,
  },
  {
    id: 'notif-4',
    user_id: 'worker-1',
    title: 'Bonus Unlocked!',
    message: 'Completed 5 jobs this week! You earned a weekend incentive of ₹500.',
    date: '2 days ago',
    read: true,
  }
];

// ==========================================
// DATABASE LAYER
// ==========================================

class Database {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    try {
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // --- Users (Customers) ---
  async getUsers(): Promise<User[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('users').select('*');
      if (error) console.error('Supabase error:', error);
      if (data) return data;
    }
    return this.getStorageItem<User[]>('af_users', DEFAULT_USERS);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).single();
      if (error && error.code !== 'PGRST116') console.error('Supabase error:', error);
      if (data) return data;
    }
    const users = await this.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async registerUser(user: Partial<User>): Promise<User> {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('users').insert([newUser]);
      if (error) throw error;
    } else {
      const users = await this.getUsers();
      users.push(newUser);
      this.setStorageItem('af_users', users);
    }
    
    return newUser;
  }

  async updateUser(email: string, data: Partial<User>): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      const { data: updatedData, error } = await supabase.from('users').update(data).eq('email', email.toLowerCase()).select().single();
      if (error) throw error;
      return updatedData;
    }

    const users = await this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) throw new Error('User not found');
    
    const updated = { ...users[idx], ...data };
    users[idx] = updated;
    this.setStorageItem('af_users', users);
    return updated;
  }

  // --- Workers ---
  async getWorkers(): Promise<WorkerProfile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('workers').select('*');
      if (error) console.error('Supabase error:', error);
      if (data) return data;
    }
    return this.getStorageItem<WorkerProfile[]>('af_workers', DEFAULT_WORKERS);
  }

  async getWorkerByEmail(email: string): Promise<WorkerProfile | undefined> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('workers').select('*').eq('email', email.toLowerCase()).single();
      if (error && error.code !== 'PGRST116') console.error('Supabase error:', error);
      if (data) return data;
    }
    const workers = await this.getWorkers();
    return workers.find(w => w.email && w.email.toLowerCase() === email.toLowerCase());
  }

  async getWorkerByEmailOrPhone(identifier: string): Promise<WorkerProfile | undefined> {
    const cleanId = identifier.trim().toLowerCase();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .or(`email.eq.${cleanId},phone.eq.${cleanId}`)
        .single();
      if (error && error.code !== 'PGRST116') console.error('Supabase error:', error);
      if (data) return data;
    }
    const workers = await this.getWorkers();
    return workers.find(w => 
      (w.email && w.email.toLowerCase() === cleanId) || 
      (w.phone && w.phone.replace(/[\s-()]/g, '') === cleanId.replace(/[\s-()]/g, ''))
    );
  }

  async getWorkerById(id: string): Promise<WorkerProfile | undefined> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('workers').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') console.error('Supabase error:', error);
      if (data) return data;
    }
    const workers = await this.getWorkers();
    return workers.find(w => w.id === id);
  }

  async registerWorker(worker: Partial<WorkerProfile>): Promise<WorkerProfile> {
    const cleanEmail = worker.email && worker.email.trim() !== '' ? worker.email.trim().toLowerCase() : undefined;
    const newWorker: WorkerProfile = {
      id: `worker-${Date.now()}`,
      name: worker.name || '',
      email: cleanEmail,
      age: worker.age || 18,
      gender: worker.gender || 'Male',
      phone: worker.phone || '',
      photo: worker.photo || '',
      skills: worker.skills || [],
      experience: worker.experience || '1 Year',
      languages: worker.languages || ['Hindi'],
      status: 'pending',
      online: false,
      rating: 5.0,
      wallet_balance: 0,
      bank_name: worker.bank_name || '',
      account_no: worker.account_no || '',
      upi_id: worker.upi_id || '',
      aadhaar_status: 'pending',
      working_hours: {
        Monday: '9 AM - 8 PM',
        Tuesday: '9 AM - 8 PM',
        Wednesday: '9 AM - 8 PM',
        Thursday: '9 AM - 8 PM',
        Friday: '9 AM - 8 PM',
        Saturday: '9 AM - 8 PM',
        Sunday: 'Off',
      },
      holidays: [],
      days_off: ['Sunday'],
      vacation_mode: false,
      ...worker,
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('workers').insert([newWorker]);
      if (error) throw error;
    } else {
      const workers = await this.getWorkers();
      workers.push(newWorker);
      this.setStorageItem('af_workers', workers);
    }
    
    // Add admin notification
    await this.createNotification({
      user_id: 'admin',
      title: 'New Worker Application',
      message: `${newWorker.name} has registered as a worker (${newWorker.skills.join(', ')}).`,
    });

    return newWorker;
  }

  async updateWorker(id: string, data: Partial<WorkerProfile>): Promise<WorkerProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data: updatedData, error } = await supabase.from('workers').update(data).eq('id', id).select().single();
      if (error) throw error;
      return updatedData;
    }

    const workers = await this.getWorkers();
    const idx = workers.findIndex(w => w.id === id);
    if (idx === -1) throw new Error('Worker not found');
    
    const updated = { ...workers[idx], ...data };
    workers[idx] = updated;
    this.setStorageItem('af_workers', workers);
    return updated;
  }

  async approveWorker(id: string): Promise<WorkerProfile> {
    const updated = await this.updateWorker(id, { status: 'approved', aadhaar_status: 'verified' });
    
    // Notify worker
    await this.createNotification({
      user_id: id,
      title: 'Application Approved! 🎉',
      message: 'Congratulations! Your AiroFox partner application has been approved. You can now go online and accept jobs.',
    });

    return updated;
  }

  async rejectWorker(id: string): Promise<WorkerProfile> {
    const updated = await this.updateWorker(id, { status: 'rejected' });
    
    // Notify worker
    await this.createNotification({
      user_id: id,
      title: 'Application Declined',
      message: 'Unfortunately, your registration was not approved. Please verify your details and contact partner support.',
    });

    return updated;
  }

  // --- Jobs ---
  async getJobs(): Promise<Job[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('jobs').select('*');
      if (error) console.error('Supabase error:', error);
      if (data) return data;
    }
    return this.getStorageItem<Job[]>('af_jobs', DEFAULT_JOBS);
  }

  async getJobsByWorker(workerId: string): Promise<Job[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('jobs').select('*').eq('worker_id', workerId);
      if (error) console.error('Supabase error:', error);
      if (data) return data;
    }
    const jobs = await this.getJobs();
    return jobs.filter(j => j.worker_id === workerId);
  }

  async updateJobStatus(jobId: string, status: Job['status']): Promise<Job> {
    let updatedJob: Job;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('jobs').update({ status }).eq('id', jobId).select().single();
      if (error) throw error;
      updatedJob = data;
    } else {
      const jobs = await this.getJobs();
      const idx = jobs.findIndex(j => j.id === jobId);
      if (idx === -1) throw new Error('Job not found');

      const oldJob = jobs[idx];
      updatedJob = { ...oldJob, status };
      jobs[idx] = updatedJob;
      this.setStorageItem('af_jobs', jobs);
    }

    // Side effects
    if (status === 'accepted' && updatedJob.worker_id) {
      await this.createNotification({
        user_id: updatedJob.worker_id,
        title: 'Job Confirmed',
        message: `You accepted the job for ${updatedJob.customer_name}. Navigate to the location.`,
      });
    } else if (status === 'completed' && updatedJob.worker_id) {
      const worker = await this.getWorkerById(updatedJob.worker_id);
      if (worker) {
        const incentive = Math.random() > 0.7 ? 150 : 0; 
        const netEarnings = updatedJob.estimated_earnings + incentive;
        const newBalance = worker.wallet_balance + netEarnings;
        await this.updateWorker(worker.id, { wallet_balance: newBalance });

        await this.createReview({
          worker_id: worker.id,
          reviewer: updatedJob.customer_name,
          rating: 5,
          comment: 'Perfect job! Polite professional.',
        });

        await this.createNotification({
          user_id: worker.id,
          title: 'Payment Credited',
          message: `₹${netEarnings} (Job: ₹${updatedJob.estimated_earnings}${incentive ? ` + Bonus: ₹${incentive}` : ''}) has been added to your wallet.`,
        });
      }
    }

    return updatedJob;
  }

  async createJob(job: Partial<Job>): Promise<Job> {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      customer_name: job.customer_name || 'Guest Customer',
      service_required: job.service_required || 'General Cleaning',
      distance: job.distance || '1.0 km',
      estimated_earnings: job.estimated_earnings || 500,
      preferred_time: job.preferred_time || 'Immediate',
      customer_rating: job.customer_rating || 5.0,
      phone: job.phone || '+91 90000 00000',
      address: job.address || 'Mumbai, India',
      status: 'pending',
      worker_id: job.worker_id || null,
      date: new Date().toISOString().split('T')[0],
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('jobs').insert([newJob]);
      if (error) throw error;
    } else {
      const jobs = await this.getJobs();
      jobs.push(newJob);
      this.setStorageItem('af_jobs', jobs);
    }
    return newJob;
  }

  // --- Reviews ---
  async getReviews(workerId: string): Promise<Review[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('reviews').select('*').eq('worker_id', workerId);
      if (error) console.error('Supabase error:', error);
      if (data) return data;
    }
    const reviews = this.getStorageItem<Review[]>('af_reviews', DEFAULT_REVIEWS);
    return reviews.filter(r => r.worker_id === workerId);
  }

  async createReview(review: Partial<Review>): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      worker_id: review.worker_id || 'worker-1',
      reviewer: review.reviewer || 'Anonymous',
      rating: review.rating || 5,
      comment: review.comment || 'Good service.',
      date: 'Just now',
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('reviews').insert([newReview]);
      if (error) throw error;
    } else {
      const reviews = this.getStorageItem<Review[]>('af_reviews', DEFAULT_REVIEWS);
      reviews.push(newReview);
      this.setStorageItem('af_reviews', reviews);
    }

    // Update worker rating average
    const workerId = newReview.worker_id;
    const allReviews = await this.getReviews(workerId);
    const avgRating = parseFloat((allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1)).toFixed(1));
    await this.updateWorker(workerId, { rating: avgRating });

    return newReview;
  }

  // --- Notifications ---
  async getNotifications(userId: string): Promise<AppNotification[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('id', { ascending: false });
      if (error) console.error('Supabase error:', error);
      if (data) return data;
    }
    return this.getStorageItem<AppNotification[]>('af_notifications', DEFAULT_NOTIFICATIONS)
      .filter(n => n.user_id === userId)
      .sort((a, b) => b.id.localeCompare(a.id));
  }

  async createNotification(notif: Partial<AppNotification>): Promise<AppNotification> {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      user_id: notif.user_id || 'worker-1',
      title: notif.title || 'Notification',
      message: notif.message || '',
      date: 'Just now',
      read: false,
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('notifications').insert([newNotif]);
      if (error) throw error;
    } else {
      const notifications = this.getStorageItem<AppNotification[]>('af_notifications', DEFAULT_NOTIFICATIONS);
      notifications.push(newNotif);
      this.setStorageItem('af_notifications', notifications);
    }
    return newNotif;
  }

  async markNotificationRead(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
      return;
    }
    const notifications = this.getStorageItem<AppNotification[]>('af_notifications', DEFAULT_NOTIFICATIONS);
    const idx = notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifications[idx].read = true;
      this.setStorageItem('af_notifications', notifications);
    }
  }

  async clearNotifications(userId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').delete().eq('user_id', userId);
      return;
    }
    const notifications = this.getStorageItem<AppNotification[]>('af_notifications', DEFAULT_NOTIFICATIONS);
    const filtered = notifications.filter(n => n.user_id !== userId);
    this.setStorageItem('af_notifications', filtered);
  }
}

export const db = new Database();
