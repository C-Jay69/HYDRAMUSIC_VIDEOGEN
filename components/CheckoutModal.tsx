
import React, { useState } from 'react';
import { useApp } from '../App';

interface CheckoutModalProps {
  plan: any;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, onClose }) => {
  const [step, setStep] = useState(1);
  const [cardName, setCardName] = useState('');
  const { addCredits, user } = useApp();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Loading
    // Simulate real Stripe payment processing
    await new Promise(r => setTimeout(r, 2500));
    setStep(3); // Success
    addCredits(plan.credits || 10);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-white text-black rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left: Summary */}
        <div className="w-full md:w-[45%] bg-[#f6f9fc] p-12 flex flex-col justify-between border-r border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-black italic text-xs">H</span>
              </div>
              <span className="text-sm font-black uppercase tracking-widest italic">Hydra Production</span>
            </div>
            
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Summary</span>
            <h3 className="text-4xl font-black mb-2 italic mt-4 uppercase tracking-tighter">{plan.name} Pack</h3>
            <p className="text-gray-500 text-sm font-medium mb-8 italic">"{plan.tagline || 'Instantly increase your production capacity'}"</p>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-y border-gray-200">
                <span className="text-sm font-bold text-gray-600">{plan.credits} Power Units</span>
                <span className="text-xl font-black">${plan.price}.00</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Network Fee</span>
                <span>$0.00</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 text-green-500">
                <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.925-3.467 9.47-9.066 10.945L8.499 18l-.435-.111C2.466 16.411-1 11.866-1 6.941c0-.68.056-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              </div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic">Verified by Stripe Encryption</p>
            </div>
            <p className="text-[8px] text-gray-300 font-medium">© 2024 Hydra Music Gen • Secured Production Gateway</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-[55%] p-12 bg-white flex flex-col justify-center">
          {step === 1 && (
            <form onSubmit={handlePayment} className="space-y-8">
              <h4 className="font-black text-xl uppercase italic tracking-tight mb-2">Payment Details</h4>
              
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Cardholder Name</label>
                  <input 
                    type="text" 
                    required
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="E.g. J. Hydra" 
                    className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                  />
                </div>
                
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Card Information</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      required
                      placeholder="4242 4242 4242 4242" 
                      className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-mono"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                      <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                      <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-1/2 group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Expiry</label>
                    <input type="text" placeholder="MM / YY" className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-mono" />
                  </div>
                  <div className="w-1/2 group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-purple-600">CVC</label>
                    <input type="text" placeholder="•••" className="w-full border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all font-mono" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-[#635bff] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-[#5249cf] transition-all transform active:scale-[0.98] shadow-lg shadow-purple-600/20"
                >
                  Pay ${plan.price}.00
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">By paying, you authorize Hydra to sync these Power Units to <span className="text-black font-bold">{user?.email}</span></p>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 border-4 border-gray-100 border-t-purple-600 rounded-full animate-spin mb-8"></div>
              <h4 className="text-2xl font-black uppercase italic tracking-tight mb-2">Syncing Gateway</h4>
              <p className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Validating Stripe Ledger...</p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100 shadow-xl shadow-green-500/5">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Units Online</h4>
              <p className="text-gray-500 text-sm font-medium mb-12 max-w-xs mx-auto italic">Your Hydra ID has been successfully credited with {plan.credits} Power Units.</p>
              <button 
                onClick={onClose}
                className="w-full max-w-xs bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-transform active:scale-95 shadow-2xl"
              >
                Launch Production
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
