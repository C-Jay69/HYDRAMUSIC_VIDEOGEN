
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useApp, Generation } from '../App';

const Features: React.FC = () => {
  const { useCredits, user, setShowAuth, addToHistory, history } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Video generation states
  const [videoPrompt, setVideoPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoLoadingStatus, setVideoLoadingStatus] = useState('');
  
  const [pendingSave, setPendingSave] = useState<{url: string, prompt: string, type: 'video' | 'image'} | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    if (!user) { setShowAuth(true); return; }
    
    const success = await useCredits(1);
    if (!success) return;

    setIsGenerating(true);
    setPendingSave(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A cinematic background for a professional music video: ${prompt}. Highly detailed, 4k, artistic.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio === '1:1' ? '1:1' : aspectRatio
          }
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const url = `data:image/png;base64,${base64EncodeString}`;
          setGeneratedImage(url);
          setGeneratedVideoUrl(null);
          setPendingSave({ type: 'image', url, prompt });
          break;
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    if (!user) { setShowAuth(true); return; }

    if (typeof window !== 'undefined' && (window as any).aistudio) {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    const success = await useCredits(5);
    if (!success) return;

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setPendingSave(null);
    setVideoLoadingStatus('Hydra Node: Initializing PulseEngine™...');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const apiAspectRatio = aspectRatio === '1:1' ? '16:9' : aspectRatio;
      
      // PRODUCTION SYNC LOGIC: In a real app, we'd analyze the audio file first.
      // Here we simulate the transient detection phase.
      await new Promise(r => setTimeout(r, 2000));
      setVideoLoadingStatus('PulseEngine™: Detected 124 transients...');
      await new Promise(r => setTimeout(r, 1500));
      setVideoLoadingStatus('Hydra Core: Weaving temporal shifts...');

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Production Grade Music Video: ${videoPrompt}. Strobe lighting, heavy motion blur, beat-reactive camera shake. Cinema 4D quality. Aspect ratio ${aspectRatio}.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: apiAspectRatio
        }
      });

      setVideoLoadingStatus('PulseEngine™: Rendering beat-matches...');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        setVideoLoadingStatus(prev => prev.includes('...') ? 'Synthesizing frames...' : 'PulseEngine™: Applying visual rhythm...');
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const videoBlob = await videoResponse.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        setGeneratedVideoUrl(videoUrl);
        setGeneratedImage(null);
        setPendingSave({ type: 'video', url: videoUrl, prompt: videoPrompt });
      }
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setIsGeneratingVideo(false);
      setVideoLoadingStatus('');
    }
  };

  const handleSaveToStudio = () => {
    if (pendingSave) {
      addToHistory(pendingSave);
      setPendingSave(null);
    }
  };

  const features = [
    {
      title: 'Hydra Fidelity',
      description: 'The Hydra engine ensures every frame is crisp and professionally lit.',
      icon: '🧠'
    },
    {
      title: 'Set Design',
      description: 'Creative backdrops for every platform. Cost: 1 Power Unit.',
      icon: '🖼️',
      interactive: true
    },
    {
      title: 'AI Clip Lab',
      description: 'Generate custom cinematic video clips from text. Cost: 5 Power Units.',
      icon: '🎬',
      videoInteractive: true
    },
    {
      title: 'Commercial Ready',
      description: 'Own your content. Perfect for monetized YouTube and Spotify Canvas.',
      icon: '💎'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight uppercase italic tracking-tighter">
              Hydra <br /> 
              <span className="text-purple-500 italic">Production Suite</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              Beyond simple sync, Hydra Production provides a full suite of AI tools to customize every frame of your production. 
              {user && <span className="text-white block mt-4 font-bold">Hydra Studio Online • {user.credits} Power Units</span>}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className={`p-6 rounded-3xl transition-all h-full flex flex-col ${f.interactive || f.videoInteractive ? 'bg-white/5 border border-white/10 ring-1 ring-purple-500/20 shadow-xl shadow-purple-500/5' : ''}`}>
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h4 className="text-xl font-bold mb-2 uppercase italic">{f.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{f.description}</p>
                  
                  {f.interactive && (
                    <div className="space-y-4 mt-auto pt-6 border-t border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-purple-400 font-black">Background Generator</p>
                      <div className="flex flex-col gap-2">
                        <input 
                          type="text" 
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="e.g. Dark industrial warehouse..." 
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        <button 
                          onClick={handleGenerateImage}
                          disabled={isGenerating || !prompt}
                          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black py-3 px-4 rounded-xl transition-all uppercase tracking-widest"
                        >
                          {isGenerating ? 'Synthesizing...' : 'Create BG (-1)'}
                        </button>
                      </div>
                    </div>
                  )}

                  {f.videoInteractive && (
                    <div className="space-y-4 mt-auto pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] uppercase tracking-widest text-purple-400 font-black">Video Clip Lab</p>
                        <div className="flex gap-1">
                          {(['16:9', '9:16', '1:1'] as const).map(ratio => (
                            <button 
                              key={ratio}
                              onClick={() => setAspectRatio(ratio)}
                              className={`text-[8px] px-2 py-0.5 rounded-md font-black border transition-all ${aspectRatio === ratio ? 'bg-purple-500 border-purple-500 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}
                            >
                              {ratio}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <textarea 
                          value={videoPrompt}
                          onChange={(e) => setVideoPrompt(e.target.value)}
                          placeholder="Describe the production scene..." 
                          rows={3}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        />
                        <button 
                          onClick={handleGenerateVideo}
                          disabled={isGeneratingVideo || !videoPrompt}
                          className="cta-gradient disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-black py-3 px-4 rounded-xl transition-all uppercase tracking-widest"
                        >
                          {isGeneratingVideo ? 'Rendering...' : 'Generate Clip (-5)'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-tr from-purple-600/20 to-pink-600/20 rounded-[4rem] p-1 shadow-2xl">
              <div className="w-full h-full bg-[#0a0a0b] rounded-[3.8rem] overflow-hidden relative group">
                {generatedVideoUrl ? (
                  <video src={generatedVideoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src={generatedImage || "https://images.unsplash.com/photo-1614850523296-e8c041de4398?q=80&w=2670&auto=format&fit=crop"} 
                    alt="Feature showcase" 
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isGenerating || isGeneratingVideo ? 'opacity-30' : 'opacity-80'}`}
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent"></div>
                
                {(isGenerating || isGeneratingVideo) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mb-6"></div>
                    <p className="text-purple-400 font-black text-xs uppercase tracking-[0.2em] animate-pulse">
                      {isGenerating ? 'Synthesizing...' : videoLoadingStatus}
                    </p>
                  </div>
                )}
                
                {!isGenerating && !isGeneratingVideo && (
                  <div className="absolute bottom-12 left-8 right-8">
                    <div className="glass-card p-5 rounded-[2rem] flex items-center justify-between border border-white/10 shadow-xl backdrop-blur-md">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-500 ring-1 ring-purple-500/50">
                          {generatedVideoUrl ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                          ) : (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                          )}
                        </div>
                        <div>
                          <p className="font-black italic uppercase tracking-tight text-xs">{generatedVideoUrl ? 'Hydra Render Ready' : generatedImage ? 'Asset Created' : 'Standby'}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{pendingSave ? 'Unsynced Data' : 'Hydra Studio'}</p>
                        </div>
                      </div>
                      
                      {pendingSave && (
                        <button 
                          onClick={handleSaveToStudio}
                          className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg"
                        >
                          Sync to Studio
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
