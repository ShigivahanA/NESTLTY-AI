import { createContext, useContext, useState, useEffect } from 'react';
import { getSubscription, updateSubscription as updateDbSubscription, incrementUsage as incrementDbUsage, auth } from './services/db';

const SubscriptionContext = createContext();

export const PLANS = {
  free: {
    name: 'Free',
    limit: 3,
    price: 0,
    features: ['3 Stories per day', 'Standard AI Narrator', 'Basic Customization']
  },
  pro: {
    name: 'Pro',
    limit: 50,
    price: 299,
    features: ['50 Stories per day', 'Premium AI Narrator', 'Priority Generation', 'No Advertisements']
  },
  elite: {
    name: 'Elite',
    limit: Infinity,
    price: 599,
    features: ['Unlimited Stories', 'Experimental AI Models', 'Custom Voice Cloning (Future)', 'Dedicated Support']
  }
};

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await auth.getUser();
      if (!user) {
         setSubscription(null);
         setLoading(false);
         return;
      }
      
      const data = await getSubscription();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription:', err);
      // Don't set loading false here if we want to retry or handle it specifically
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSubscription();

    // Listen for auth changes
    const { data: { subscription: authSub } } = auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
        fetchSubscription();
      }
      if (event === 'SIGNED_OUT') {
        setSubscription(null);
        setLoading(false);
      }
    });

    return () => {
      if (authSub) authSub.unsubscribe();
    };
  }, []);

  const upgrade = async (tier) => {
    try {
      const updated = await updateDbSubscription(tier);
      setSubscription(updated);
      return updated;
    } catch (err) {
      console.error('Upgrade failed:', err);
      throw err;
    }
  };

  const useGeneration = async () => {
    if (!subscription) return false;
    const plan = PLANS[subscription.tier];
    if (subscription.stories_generated >= plan.limit) return false;

    try {
      const updated = await incrementDbUsage();
      setSubscription(updated);
      return true;
    } catch (err) {
      console.error('Usage update failed:', err);
      return false;
    }
  };

  const isLimitReached = () => {
    if (!subscription) return true;
    const plan = PLANS[subscription.tier];
    if (plan.limit === Infinity) return false;
    return subscription.stories_generated >= plan.limit;
  };

  return (
    <SubscriptionContext.Provider value={{ 
      subscription, 
      loading, 
      upgrade, 
      useGeneration, 
      isLimitReached, 
      refreshSubscription: fetchSubscription,
      plans: PLANS 
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
