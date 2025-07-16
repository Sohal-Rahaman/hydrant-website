"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import Sidebar from '@/components/account/Sidebar';
import Header from '@/components/Header';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-blue flex justify-center items-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="min-h-screen bg-deep-blue">
      <Header />
      <div className="container mx-auto px-6 py-24 pt-32">
        <div className="md:flex">
          <div className="md:w-1/4">
            <Sidebar />
          </div>
          <main className="md:w-3/4 md:pl-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}