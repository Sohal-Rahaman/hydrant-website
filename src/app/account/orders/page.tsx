"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Define a type for our order data
type Order = {
  id: string;
  created_at: string;
  status: 'Progress' | 'Completed' | 'Canceled';
  total_amount: number;
  items: { name: string; quantity: number; price: string }[];
};

const TABS: Order['status'][] = ['Progress', 'Completed', 'Canceled'];

export default function OrdersPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Order['status']>('Progress');

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
        } else {
          setOrders(data as Order[]);
        }
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);
  
  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">My Orders</h1>
      
      {/* Tabs for filtering */}
      <div className="flex border-b border-light-blue/20 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === tab 
                ? 'border-b-2 border-light-blue text-white' 
                : 'text-slate-gray hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-slate-gray">Loading orders...</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-deep-blue/40 border border-light-blue/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Order #{order.id.substring(0, 8)}</p>
                  <p className="text-sm text-slate-gray">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-white">₹{order.total_amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                        order.status === 'Canceled' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                    }`}>
                        {order.status}
                    </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-gray text-center py-8">You have no {activeTab.toLowerCase()} orders.</p>
        )}
      </div>
    </div>
  );
}