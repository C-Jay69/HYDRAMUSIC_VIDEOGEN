
import React, { useState } from 'react';

const Showcase: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const categories = ['Cinematic', 'Anime', 'Cyberpunk', 'Realistic', 'Abstract'];
  
  // Using some public sample videos for the demonstration
  const videoData = [
    { id: 1, title: 'Midnight Drift', style: 'Cinematic', videoUrl: 'https://cdn.pixabay.com/vimeo/450863953/city-48811.mp4?width=1280&hash=f577319984b5b7b134984534123447c23498' },
    { id: 2, title: 'Neon Pulse', style: 'Cyberpunk', videoUrl: 'https://cdn.pixabay.com/vimeo/207036688/neon-7589.mp4?width=1280&hash=f24982349823498234982349823498234' },
    { id: 3, title: 'Skyline Rhythm', style: 'Realistic', videoUrl: 'https://cdn.pixabay.com/vimeo/346851433/clouds-25102.mp4?width=1280&hash=a82349823498234982349823498' },
    { id: 4, title: 'Digital Dream', style: 'Abstract', videoUrl: 'https://cdn.pixabay.com/vimeo/472403268/abstract-53900.mp4?width=1280&hash=b23498234982349823498234' },
    { id: 5, title: 'Samurai Vibe', style: 'Anime', videoUrl: 'https://cdn.pixabay.com/vimeo/517604655/nature-66885.mp4?width=1280&hash=c23498234982349823498234' },
    { id: 6, title: 'Retro Groove', style: 'Cyberpunk', videoUrl: 'https://cdn.pixabay.com/vimeo/303423719/retro-19616.mp4?width=1280&hash=d23498234982349823498234' },
  ];

  const openModal = (url: string) => {
    setSelectedVideo(url);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <section id="examples" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase italic">Stunning Styles</h2>
            <p className="text-gray-400">Whatever your sound, we have the visual identity to match.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} className="px-5 py-2 rounded-full text-xs font-bold border border-white/10 hover:bg-white/5 transition-colors uppercase tracking-widest">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoData.map((v) => (
            <div 
              key={v.id} 
              onClick={() => openModal(v.videoUrl)}
              className="group relative aspect-video rounded-3xl overflow-hidden bg-white/5 cursor-pointer"
            >
              <img 
                src={`https://picsum.photos/seed/mv${v.id}/800/450`} 
                alt={v.title} 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform border border-white/20">
                  <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-400">{v.style} Style</span>
                <h4 className="text-xl font-bold text-white mt-1">{v.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={closeModal}></div>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/50 hover:bg-black rounded-full flex items-center justify-center transition-colors border border-white/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video 
              autoPlay 
              controls 
              className="w-full h-full object-contain"
              src={selectedVideo}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Showcase;
