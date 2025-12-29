
import React, { useState } from 'react';
import { useApp } from '../App';

interface ProfileModalProps {
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, setUser } = useApp();
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API update
    await new Promise(r => setTimeout(r, 1000));
    
    if (user) {
      setUser({
        ...user,
        email: email
      });
    }
    
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-[#0d0d0e] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black mb-2 italic uppercase tracking-tighter">Edit Profile</h2>
          <p className="text-gray-400 text-sm font-medium">Update your studio credentials</p>
        </div>

        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto ring-1 ring-green-500/50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-green-400 font-bold uppercase tracking-widest text-sm">Profile Updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all" 
              />
              <p className="text-[9px] text-gray-600 mt-2 ml-1 uppercase font-bold tracking-wider">Leave as is to keep current password</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl border border-white/10 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 cta-gradient py-4 rounded-2xl font-black uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
