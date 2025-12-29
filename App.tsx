
import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Showcase from './components/Showcase';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import Dashboard from './components/Dashboard';
import ProfileModal from './components/ProfileModal';

// --- Types ---
export interface Generation {
  id: string;
  type: 'video' | 'image';
  url: string;
  prompt: string;
  timestamp: number;
}

export interface User {
  id: string;
  email: string;
  credits: number;
  plan: 'free' | 'starter' | 'producer' | 'artist';
  isAdmin?: boolean;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
  showCheckout: any | null;
  setShowCheckout: (plan: any | null) => void;
  addCredits: (amount: number) => void;
  useCredits: (amount: number) => Promise<boolean>;
  history: Generation[];
  addToHistory: (item: Omit<Generation, 'id' | 'timestamp'>) => void;
  view: 'landing' | 'dashboard';
  setView: (view: 'landing' | 'dashboard') => void;
  brandLogo: string | null;
  setBrandLogo: (url: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCheckout, setShowCheckout] = useState<any | null>(null);
  const [history, setHistory] = useState<Generation[]>([]);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [brandLogo, setBrandLogo] = useState<string | null>(localStorage.getItem('hydra_brand_logo'));

  useEffect(() => {
    // Initial Session Check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user.id, session.user.email!);
      }
    };

    checkSession();

    // Listen for Auth Events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event:", event);
      if (session) {
        await fetchUserProfile(session.user.id, session.user.email!);
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
           setShowAuth(false);
        }
      } else {
        setUser(null);
        setView('landing');
      }
    });

    const savedHistory = localStorage.getItem('hydra_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (id: string, email: string) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id, email, credits: 5, plan: 'free' }])
          .select()
          .single();
        
        if (newProfile) data = newProfile;
      }

      if (data) {
        setUser({
          id,
          email,
          credits: data.credits,
          plan: data.plan || 'free',
          isAdmin: email.endsWith('@hydra.ai') || email === 'admin@hydra.ai' || email === 'nathan@onemoreshot.ai'
        });
      }
    } catch (err) {
      console.error("Hydra Profile Error:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem('hydra_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (brandLogo) localStorage.setItem('hydra_brand_logo', brandLogo);
  }, [brandLogo]);

  const addCredits = async (amount: number) => {
    if (!user) return;
    const newCredits = user.credits + amount;
    
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);

    if (!error) setUser({ ...user, credits: newCredits });
  };

  const useCredits = async (amount: number): Promise<boolean> => {
    if (!user) {
      setShowAuth(true);
      return false;
    }
    if (user.isAdmin) return true;

    if (user.credits < amount) {
      setShowCheckout({ name: 'Refill', price: '9', credits: 20 });
      return false;
    }

    const newCredits = user.credits - amount;
    const { error } = await supabase
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', user.id);

    if (!error) {
      setUser({ ...user, credits: newCredits });
      return true;
    }
    return false;
  };

  const addToHistory = (item: Omit<Generation, 'id' | 'timestamp'>) => {
    const newItem: Generation = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, showAuth, setShowAuth, showProfile, setShowProfile, showCheckout, setShowCheckout, 
      addCredits, useCredits, history, addToHistory, view, setView, brandLogo, setBrandLogo
    }}>
      <div className="min-h-screen bg-[#000000] text-white selection:bg-purple-500/30">
        <Navbar scrolled={scrolled} />
        
        {view === 'landing' ? (
          <main>
            <Hero />
            <Showcase />
            <HowItWorks />
            <Features />
            <Pricing />
          </main>
        ) : (
          <Dashboard />
        )}
        
        <Footer />
        
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
        {showCheckout && <CheckoutModal plan={showCheckout} onClose={() => setShowCheckout(null)} />}
      </div>
    </AppContext.Provider>
  );
};

export default App;
