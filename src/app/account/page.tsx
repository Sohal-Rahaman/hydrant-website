"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Define a type for our profile data
type Profile = {
  full_name: string;
  email: string;
  phone: string;
  wallet_balance: number;
  jars_occupied: number;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch session and user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Fetch profile details from the 'profiles' table
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(profileData);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-slate-gray">Loading profile...</p>;
  }
  
  if (!profile || !user) {
    return <p className="text-red-400">Could not load user profile.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>
      <div className="bg-deep-blue/40 border border-light-blue/20 rounded-lg p-8 space-y-4">
        <div>
          <label className="text-sm text-slate-gray">Full Name</label>
          <p className="text-lg text-white">{profile.full_name}</p>
        </div>
        <hr className="border-light-blue/10"/>
        <div>
          <label className="text-sm text-slate-gray">Email Address</label>
          <p className="text-lg text-white">{user.email}</p>
        </div>
        <hr className="border-light-blue/10"/>
        <div>
          <label className="text-sm text-slate-gray">Phone Number</label>
          <p className="text-lg text-white">{profile.phone}</p>
        </div>
        <hr className="border-light-blue/10"/>
        <div className="flex justify-between items-center">
            <div>
                <label className="text-sm text-slate-gray">Wallet Balance</label>
                <p className="text-lg text-white">₹{profile.wallet_balance?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
                <label className="text-sm text-slate-gray">Jars Held</label>
                <p className="text-lg text-white">{profile.jars_occupied || 0}</p>
            </div>
        </div>
      </div>
    </div>
  );
}