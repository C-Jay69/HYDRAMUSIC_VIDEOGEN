
import React, { useState } from 'react';
import { useApp, Generation } from '../App';

const Dashboard: React.FC = () => {
  const { history, user, setView } = useApp();
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  if (!user) return null;

  const togglePin = (id: string) => {
    const next = new Set(pinnedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPinnedIds(next);
  };

  const handleShare = async (item: Generation) => {
    const shareText = `Check out my AI creation: "${item.prompt}" #HydraAI #HydraMusicGen`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hydra AI Generation',
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log('Share failed or cancelled');
      }
    }
    setSharingId(sharingId === item.id ? null : item.id);
  };

  const shareToSocial = (platform: string, item: Generation) => {
    const text = encodeURIComponent(`Check out my AI creation: "${item.prompt}" #HydraMusicGen`);
    const url = encodeURIComponent(window.location.origin);
    
    let shareLink = '';
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'instagram':
        alert('Copy the link to share on Instagram!');
        return;
    }
    
    window.open(shareLink, '_blank', 'noopener,noreferrer');
    setSharingId(null);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Hydra Studio</h1>
            {user.isAdmin && (
              <span className="bg-yellow-500/10 text-yellow-500 text-[10px] font-black px-3 py-1 rounded-full border border-yellow-500/20 uppercase tracking-widest">
                Hydra Master
              </span>
            )}
          </div>
          <p className="text-gray-400">Manage your cinematic generations and production assets within the Hydra network.</p>
        </div>
        <button 
          onClick={() => setView('landing')}
          className="cta-gradient px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest shadow-xl shadow-purple-500/10"
        >
          Summon New Asset
        </button>
      </div>

      {user.isAdmin && (
        <div className="mb-12 p-8 rounded-[2rem] bg-gradient-to-r from-purple-900/20 to-pink-900/10 border border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
          <h3 className="text-xl font-black uppercase italic mb-4 text-purple-300">Hydra Master Control</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Compute Cost</p>
              <p className="text-xl font-bold text-green-400">$0.00 (Hydra-Core)</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Transaction Mock</p>
              <p className="text-xl font-bold text-blue-400">Simulated Sync</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Hydra Status</p>
              <p className="text-xl font-bold text-purple-400">Active - 3 Heads</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Root Access</p>
              <p className="text-xl font-bold text-yellow-400">GRANTED</p>
            </div>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] p-24 text-center">
          <div className="text-6xl mb-8 opacity-20">🐉</div>
          <h3 className="text-2xl font-bold mb-4">Your studio is dormant</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start creating Hydra AI music videos or cinematic clips to see them appear here.</p>
          <button 
            onClick={() => setView('landing')}
            className="text-purple-400 font-bold hover:underline"
          >
            Create your first Hydra asset →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item) => (
            <div key={item.id} className="group relative bg-[#0d0d0e] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-purple-500/30">
              <div className="aspect-video relative overflow-hidden bg-black">
                {item.type === 'video' ? (
                  <video src={item.url} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                )}
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {item.type}
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
                <h4 className="text-sm font-medium text-gray-300 line-clamp-2 italic">"{item.prompt}"</h4>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <a 
                    href={item.url} 
                    download={`hydra-${item.id}`}
                    className="flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold transition-colors border border-white/5 uppercase tracking-widest"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download
                  </a>
                  <button 
                    onClick={() => handleShare(item)}
                    className="flex items-center justify-center gap-2 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl text-[10px] font-bold transition-colors border border-purple-500/10 uppercase tracking-widest"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
                    Share
                  </button>
                  <button 
                    onClick={() => togglePin(item.id)}
                    className={`col-span-2 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-widest ${pinnedIds.has(item.id) ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill={pinnedIds.has(item.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    {pinnedIds.has(item.id) ? 'Archived in Hydra' : 'Sync to Core'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-24 grid md:grid-cols-3 gap-8 border-t border-white/5 pt-12">
        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Hydra Cycles</p>
          <p className="text-4xl font-black italic">{history.length}</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Plan Access</p>
          <p className="text-4xl font-black italic">{user.isAdmin ? 'MASTER ACCESS' : user.plan.toUpperCase()}</p>
        </div>
        <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Power Units</p>
          <p className="text-4xl font-black italic">{user.isAdmin ? '∞' : user.credits}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
