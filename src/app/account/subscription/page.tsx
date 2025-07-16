"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Define a type for subscription data
type Subscription = {
  id: string;
  status: 'Active' | 'Paused';
  quantity: number;
  frequency: string;
  timeSlot: string;
  price: string;
};

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (data) {
          setSubscription(data as Subscription);
        }
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine.
          console.error("Error fetching subscription:", error);
        }
      }
      setLoading(false);
    };

    fetchSubscription();
  }, []);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">My Subscription</h1>
      
      {loading ? (
        <p className="text-slate-gray">Loading subscription details...</p>
      ) : subscription ? (
        // Display current subscription
        <div className="bg-deep-blue/40 border border-light-blue/20 rounded-lg p-8">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xl font-bold text-white">Your Delivery Plan</p>
                    <p className="text-slate-gray">Status: 
                        <span className={subscription.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}>
                            {` ${subscription.status}`}
                        </span>
                    </p>
                </div>
                <p className="text-2xl font-bold text-light-blue">{subscription.price}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-light-blue/20">
                <div>
                    <label className="text-sm text-slate-gray">Quantity</label>
                    <p className="text-lg text-white">{subscription.quantity} Jar(s)</p>
                </div>
                <div>
                    <label className="text-sm text-slate-gray">Frequency</label>
                    <p className="text-lg text-white">{subscription.frequency}</p>
                </div>
                <div>
                    <label className="text-sm text-slate-gray">Time Slot</label>
                    <p className="text-lg text-white">{subscription.timeSlot}</p>
                </div>
            </div>
            <div className="flex space-x-4 mt-8">
                <button className="bg-light-blue text-deep-blue font-semibold py-2 px-6 rounded-md hover:bg-opacity-90">Update</button>
                <button className="border border-yellow-400 text-yellow-400 font-semibold py-2 px-6 rounded-md hover:bg-yellow-400 hover:text-deep-blue">
                    {subscription.status === 'Active' ? 'Pause' : 'Resume'}
                </button>
            </div>
        </div>
      ) : (
        // UI to create a new subscription
        <div className="text-center py-10 border-2 border-dashed border-light-blue/30 rounded-lg">
          <p className="text-slate-gray">You do not have an active subscription.</p>
          <button className="mt-4 bg-light-blue text-deep-blue font-semibold py-2 px-6 rounded-md hover:bg-opacity-90">
            Create a Subscription
          </button>
        </div>
      )}
    </div>
  );
}