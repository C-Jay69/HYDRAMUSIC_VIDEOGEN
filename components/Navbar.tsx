
import React, { useState } from 'react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const { user, setShowAuth, setUser, view, setView, setShowProfile, brandLogo, setBrandLogo } = useApp();

  const handleLogoClick = () => {
    setView('landing');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const generateHydraLogo = async () => {
    if (isGeneratingLogo) return;
    setIsGeneratingLogo(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: "Modern minimalist high-tech logo for 'Hydra Music Video Gen'. Featuring a stylized three-headed dragon symbol, neon purple and cyan glow, vector art style, dark background, cinematic lighting, sleek professional branding." }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const url = `data:image/png;base64,${part.inlineData.data}`;
          setBrandLogo(url);
          break;
        }
      }
    } catch (e) {
      console.error("Logo gen error", e);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || view === 'dashboard' ? 'bg-black/90 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              {brandLogo ? (
                <img src={brandLogo} alt="Hydra Logo" className="w-full h-full object-cover rounded-lg border border-purple-500/30" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                   <span className="text-xl font-black italic text-white">H</span>
                </div>
              )}
              {(!brandLogo || user?.isAdmin) && (
                <button 
                  onClick={(e) => { e.stopPropagation(); generateHydraLogo(); }}
                  className={`absolute -bottom-1 -right-1 w-5 h-5 bg-black border border-white/20 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors ${isGeneratingLogo ? 'animate-spin' : ''}`}
                  title="Regenerate Brand Logo"
                >
                  <span className="text-[10px]">✨</span>
                </button>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">Hydra</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-purple-400 uppercase leading-none mt-1">Music Gen</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {view === 'landing' && (
              <>
                <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#examples" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Examples</a>
                <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</a>
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView(view === 'dashboard' ? 'landing' : 'dashboard')}
                  className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-widest transition-colors"
                >
                  {view === 'dashboard' ? 'Back Home' : 'Hydra Studio'}
                </button>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                    {user.isAdmin ? 'UNLIMITED HYDRA POWER' : `${user.credits} Credits`}
                  </span>
                </div>
                <div className="group relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer shadow-lg shadow-purple-500/20 ${user.isAdmin ? 'bg-gradient-to-tr from-yellow-500 to-orange-500' : 'bg-gradient-to-tr from-purple-600 to-pink-500'}`}>
                    {user.isAdmin ? '👑' : user.email[0].toUpperCase()}
                  </div>
                  <div className="absolute top-full right-0 mt-2 w-52 bg-[#0a0a0b] border border-white/10 rounded-2xl p-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto transform origin-top-right translate-y-2 group-hover:translate-y-0 shadow-2xl">
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-[10px] text-gray-500 uppercase font-bold truncate">{user.email}</p>
                      {user.isAdmin && <p className="text-[8px] text-yellow-500 font-black uppercase mt-1">Hydra Master</p>}
                    </div>
                    <button 
                      onClick={() => { setView('dashboard'); }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      My Generations
                    </button>
                    <button 
                      onClick={() => setShowProfile(true)}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Edit Profile
                    </button>
                    <button 
                      onClick={() => setUser(null)}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-sm text-red-400 font-medium transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-red-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className="bg-white text-black hover:bg-gray-200 px-6 py-2 rounded-full text-sm font-bold transition-all"
              >
                Enter Studio
              </button>
            )}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
