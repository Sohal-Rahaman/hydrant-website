"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const navItems = [
  { name: 'My Profile', href: '/account' },
  { name: 'My Orders', href: '/account/orders' },
  { name: 'My Subscription', href: '/account/subscription' },
  { name: 'Policies', href: '/account/policies' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirect to homepage after logout
  };

  return (
    <aside className="bg-deep-blue/40 border border-light-blue/20 rounded-lg p-6">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block px-4 py-2 rounded-md font-medium transition-colors ${
              pathname === item.href
                ? 'bg-light-blue text-deep-blue'
                : 'text-white hover:bg-light-blue/10'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-6 pt-6 border-t border-light-blue/20">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-md font-medium text-slate-gray hover:bg-red-500/20 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}