"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // First, sign up the user in the 'auth' schema
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
        setError("An unknown error occurred during signup.");
        setLoading(false);
        return;
    }
    
    // If signup is successful, insert their details into the 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ 
        id: authData.user.id, 
        full_name: fullName, 
        phone: phone,
        email: email
      });

    if (profileError) {
      setError(`Signup successful, but could not save profile: ${profileError.message}`);
    } else {
      // On success, you can either redirect them or show a "please check your email" message
      alert('Signup successful! Please check your email to verify your account.');
      router.push('/login');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-deep-blue flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/polotno.png" alt="HYDRANT 2.O Logo" width={60} height={60} className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Create Your Account</h1>
          <p className="text-slate-gray">Start your journey with hassle-free water delivery.</p>
        </div>

        <form onSubmit={handleSignup} className="bg-deep-blue/40 border border-light-blue/20 rounded-lg p-8 shadow-lg space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-gray mb-2">Full Name</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-deep-blue/50 border border-light-blue/30 rounded-md p-3 text-white" required/>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-gray mb-2">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-deep-blue/50 border border-light-blue/30 rounded-md p-3 text-white" required/>
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-gray mb-2">Phone Number</label>
            <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-deep-blue/50 border border-light-blue/30 rounded-md p-3 text-white" required/>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-gray mb-2">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-deep-blue/50 border border-light-blue/30 rounded-md p-3 text-white" required minLength={6}/>
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-light-blue text-deep-blue font-semibold py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-gray mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-light-blue hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}