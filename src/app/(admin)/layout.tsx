'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Cookies from 'js-cookie';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authCookie = Cookies.get('quickcart_auth');
    
    if (!authCookie) {
      router.replace('/login');
      return;
    }
    
    try {
      const { user } = JSON.parse(authCookie);
      if (user.role !== 'admin') {
        router.replace('/dashboard');
        return;
      }
    } catch (error) {
      router.replace('/login');
    }
  }, [pathname, router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0">
        {children}
      </main>
    </div>
  );
}