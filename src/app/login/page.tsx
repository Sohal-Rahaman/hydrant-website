"use client"; // This is required for using hooks like useState and useRouter

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase'; // Make sure you have the supabase client in lib/supabase.ts (or .js)

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      // On successful login, redirect to the account dashboard
      router.push('/account');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-deep-blue flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/polotno.png" alt="HYDRANT 2.O Logo" width={60} height={60} className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">Welcome Back</h1>
          <p className="text-slate-gray">Sign in to access your account.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-deep-blue/40 border border-light-blue/20 rounded-lg p-8 shadow-lg space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-gray mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-deep-blue/50 border border-light-blue/30 rounded-md p-3 text-white focus:ring-light-blue focus:border-light-blue"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-gray mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-deep-blue/50 border border-light-blue/30 rounded-md p-3 text-white focus:ring-light-blue focus:border-light-blue"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-light-blue text-deep-blue font-semibold py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-gray mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-light-blue hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}