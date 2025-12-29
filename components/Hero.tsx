
import React from 'react';
import { useApp } from '../App';

const Hero: React.FC = () => {
  const { user, setShowAuth } = useApp();

  const handleStart = () => {
    if (!user) setShowAuth(true);
    else document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark Moody Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514525253361-bee8718a74a2?q=80&w=2574&auto=format&fit=crop" 
          alt="Music Atmosphere" 
          className="w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Rating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-semibold mb-10">
          <div className="flex text-yellow-500">
            {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
          </div>
          <span className="text-white">#1 AI Music Video Engine</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 text-white leading-[0.9] uppercase italic">
          HYDRA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">PRODUCTION</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
          The Hydra multi-head processing engine creates professional music videos for Suno, Udio, and beyond. Precision sync, devastating visuals.
        </p>

        <div className="flex flex-col items-center gap-12">
          <button 
            onClick={handleStart}
            className="cta-gradient px-12 py-5 rounded-full text-xl font-bold flex items-center gap-2 shadow-2xl shadow-purple-500/20"
          >
            <span className="text-2xl">🐉</span> {user ? 'Go to Hydra Studio' : 'Summon Hydra'}
          </button>

          <div className="space-y-6">
            <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">
              Dominating the industry with 50,000+ creators
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
              <span className="text-2xl font-black tracking-widest">SUNO</span>
              <span className="text-2xl font-black tracking-widest">UDIO</span>
              <span className="text-2xl font-black tracking-widest">MUREKA</span>
              <span className="text-2xl font-black tracking-widest">HYDRA AI</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => document.getElementById('examples')?.scrollIntoView({behavior:'smooth'})}>
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
