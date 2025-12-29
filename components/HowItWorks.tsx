
import React, { useState, useEffect, useRef } from 'react';

const PulseVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 40;
      const barWidth = canvas.width / bars;
      
      for (let i = 0; i < bars; i++) {
        const height = Math.random() * (canvas.height * 0.8) + (Math.sin(Date.now() / 200 + i) * 10);
        const opacity = Math.random() * 0.5 + 0.5;
        
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
        
        // Glitch line
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#d946ef';
          ctx.fillRect(0, Math.random() * canvas.height, canvas.width, 1);
        }
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  return (
    <div className="mt-8 pt-8 border-t border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">
            {isActive ? 'PulseEngine™ Active' : 'PulseEngine™ Dormant'}
          </span>
        </div>
        <button 
          onClick={() => setIsActive(!isActive)}
          className="text-[9px] font-black uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full hover:bg-white/5 transition-colors"
        >
          {isActive ? 'Stop Analysis' : 'Run Diagnostic'}
        </button>
      </div>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={60} 
        className="w-full h-12 rounded-lg bg-black/40 border border-white/5"
      />
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Upload Audio',
      description: 'Inject your Suno, Udio, or WAV master into the Hydra network. Our core analyzes the tonal frequency spectrum and emotional weight.',
      icon: '🔊'
    },
    {
      number: '02',
      title: 'Set Head Style',
      description: 'Deploy one of hundred of Hydra heads. Each head specializes in a specific cinematic aesthetic that reacts to your sound.',
      icon: '🐉'
    },
    {
      number: '03',
      title: 'Neural Sync',
      description: 'The PulseEngine™ maps transients to frame-perfect visual shifts. It automatically adjusts camera physics, lighting intensity, and motion blur.',
      icon: '⚡'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase italic">The Hydra Method</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">From raw audio to cinematic domination in seconds.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 transition-all hover:bg-white/[0.07] group overflow-hidden flex flex-col">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform origin-left">{step.icon}</div>
              <span className="absolute top-6 right-8 text-6xl font-black text-white/[0.03] italic pointer-events-none">{step.number}</span>
              <h3 className="text-2xl font-bold mb-4 uppercase italic">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
              {i === 2 && <PulseVisualizer />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
