"use client";
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { showToast } from '@/components/shared/Toast';

export function useProtectedAction() {
  const router = useRouter();

  const handleProtectedAction = async (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    actionType: 'call' | 'whatsapp' | 'book',
    serviceName: string = 'a service'
  ) => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('af_logged_user') : null;
    
    if (!userStr) {
      e.preventDefault();
      showToast('info', 'Sign in required', 'Please log in to continue booking with AiroFox.');
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);

    if (actionType === 'whatsapp') {
      e.preventDefault();
      const addressLine = user.address ? `\nAddress: ${user.address}` : '';
      const message = `Hi AiroFox, I need help with ${serviceName}.\n\nMy Details:\nName: ${user.name}\nEmail: ${user.email}${addressLine}`;
      const url = `https://wa.me/919326065836?text=${encodeURIComponent(message)}`;
      
      // Log an admin notification in Supabase
      try {
        await db.createNotification({
          user_id: 'admin',
          title: 'WhatsApp Inquiry',
          message: `${user.name} (${user.email}) initiated a WhatsApp chat regarding ${serviceName}.`,
        });

        // Log a customer notification too
        await db.createNotification({
          user_id: user.email,
          title: 'WhatsApp Inquiry Initiated',
          message: `You opened a WhatsApp chat with support for ${serviceName}. We are ready to assist you!`,
        });
      } catch (err) {
        console.error('Failed to log WhatsApp notification', err);
      }

      showToast('success', '💬 Opening WhatsApp', `Connecting you with AiroFox support for ${serviceName}.`);
      window.open(url, '_blank');
    }
    // For 'call' and 'book', if user is logged in, let the default action proceed.
  };

  return { handleProtectedAction };
}
