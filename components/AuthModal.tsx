
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      } else {
        const { error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin,
          }
        });
        if (authError) throw authError;
        alert('Hydra ID Deployed. Check your email to verify the uplink.');
      }
    } catch (err: any) {
      setError({ message: err.message, code: err.code || 'AUTH_ERR' });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError({ 
        message: err.message || "Uplink Interrupted", 
        code: "OAUTH_INIT_FAIL" 
      });
      setLoading(false);
    }
  };

  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#0d0d0e] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_80px_-20px_rgba(139,92,246,0.5)] overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="text-center mb-8 relative">
          <h2 className="text-4xl font-black mb-2 italic uppercase tracking-tighter text-white">
            {isLogin ? 'Hydra Login' : 'Deploy Hydra ID'}
          </h2>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest leading-none">
            {loading ? 'Establishing Link...' : 'Access the production swarm'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 relative">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-center">Handshake Diagnostic</p>
            
            <div className="space-y-3 font-black uppercase text-[8px] tracking-[0.15em]">
              <div className="p-2 bg-black/40 rounded border border-red-500/10">
                <p className="text-red-500/60 mb-1 italic">Google Cloud Fix (Redirect URI):</p>
                <code className="text-white block bg-white/5 p-1 rounded break-all select-all">https://iwnycvkvibmjfdlnwwkf.supabase.co/auth/v1/callback</code>
              </div>
              
              <div className="p-2 bg-black/40 rounded border border-red-500/10">
                <p className="text-red-500/60 mb-1 italic">Supabase Fix (Site URL):</p>
                <code className="text-white block bg-white/5 p-1 rounded break-all select-all">{window.location.origin}</code>
              </div>

              <div className="p-2 bg-black/40 rounded border border-red-500/10">
                <p className="text-red-500/60 mb-1 italic">Google Cloud (Origins):</p>
                <code className="text-white block bg-white/5 p-1 rounded break-all select-all">{window.location.origin}</code>
              </div>
            </div>
            <p className="mt-4 text-[9px] text-center text-red-400/50 animate-pulse italic">⚠️ Match these exactly in your dashboards</p>
          </div>
        )}

        {isIframe && (
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-purple-400 mb-2 italic">Iframe security active</p>
            <button 
              onClick={openInNewTab}
              className="text-[10px] font-black text-white bg-purple-600 px-6 py-3 rounded-xl hover:bg-purple-500 transition-all uppercase tracking-[0.2em] shadow-lg shadow-purple-600/20"
            >
              Breakout to Main View
            </button>
          </div>
        )}

        <button 
          onClick={handleOAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest mb-6 hover:bg-gray-200 transition-all transform active:scale-95 disabled:opacity-50 shadow-xl"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Link
            </>
          )}
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-black text-gray-600"><span className="bg-[#0d0d0e] px-4 italic">OR DIRECT ACCESS</span></div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-700 font-medium" 
            placeholder="Identity Email" 
          />
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all placeholder:text-gray-700 font-medium" 
            placeholder="Hydra Passkey" 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full cta-gradient py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs disabled:opacity-50 shadow-xl shadow-purple-500/20"
          >
            {loading ? 'Establishing...' : (isLogin ? 'Establish Link' : 'Initialize ID')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
            {isLogin ? "No access to the swarm?" : "Already part of Hydra?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-2 text-purple-500 hover:text-purple-400 transition-colors"
            >
              {isLogin ? 'Request Deployment' : 'Reconnect Link'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
