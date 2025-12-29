
import React from 'react';
import { useApp } from '../App';

const Pricing: React.FC = () => {
  const { setShowCheckout, user, setShowAuth } = useApp();
  
  const plans = [
    {
      name: 'Starter',
      price: '19',
      credits: 50,
      tagline: 'Ideal for Suno hobbyists',
      features: ['5 Minutes of Video', '1080p HD Export', 'Standard Sync AI', '24h Delivery'],
      isPopular: false
    },
    {
      name: 'Producer',
      price: '39',
      credits: 150,
      tagline: 'The best value for creators',
      features: ['15 Minutes of Video', '4K Ultra HD Export', 'Precision Beat-Sync', 'Priority Processing', 'Custom Styles'],
      isPopular: true
    },
    {
      name: 'Artist',
      price: '79',
      credits: 500,
      tagline: 'For full music albums',
      features: ['45 Minutes of Video', '8K Pro Export', 'Advanced Physics Sync', 'Vip Support', 'Commercial License'],
      isPopular: false
    }
  ];

  const handleAction = (plan: any) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowCheckout(plan);
  };

  return (
    <section id="pricing" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 italic tracking-tight uppercase">Join the visual revolution</h2>
          <p className="text-gray-400 text-lg">Choose a plan to refill your credits instantly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative p-10 rounded-[2.5rem] transition-all duration-300 ${
                plan.isPopular 
                ? 'bg-[#111111] border-2 border-[#8b5cf6] scale-105' 
                : 'bg-[#0a0a0a] border border-white/5 hover:border-white/10'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 cta-gradient text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">
                  Best Value
                </span>
              )}
              
              <h3 className="text-2xl font-black mb-1 uppercase italic">{plan.name}</h3>
              <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest">{plan.tagline}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black tracking-tighter">${plan.price}</span>
                <span className="text-gray-500 font-bold">/one-time</span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleAction(plan)}
                className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-sm transition-all ${
                  plan.isPopular 
                  ? 'cta-gradient text-white shadow-xl shadow-purple-500/20' 
                  : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {user ? `Get ${plan.credits} Credits` : 'Sign Up to Start'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
