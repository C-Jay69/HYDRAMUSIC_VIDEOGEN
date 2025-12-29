
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-24 pb-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-3xl font-black italic text-[#8b5cf6]">H</span>
              <span className="text-2xl font-bold tracking-tight text-white">Hydra Music Gen</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-8 font-medium leading-relaxed">
              Empowering creators to visualize their sound. The world's first multi-head dedicated AI music video production suite for independent artists.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><a href="#" className="hover:text-purple-500">Hydra Tutorials</a></li>
              <li><a href="#" className="hover:text-purple-500">Head Styles Library</a></li>
              <li><a href="#" className="hover:text-purple-500">Artist Blog</a></li>
              <li><a href="#" className="hover:text-purple-500">Hydra Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><a href="#" className="hover:text-purple-500">Help Center</a></li>
              <li><a href="#" className="hover:text-purple-500">Terms of Service</a></li>
              <li><a href="#" className="hover:text-purple-500">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-purple-500">Contact Hydra</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-gray-600">
          <p>© 2024 Hydra Music Video Gen. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Built for the multi-head future of music</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
