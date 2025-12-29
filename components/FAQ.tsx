
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does it take?",
      answer: "Processing time depends on your chosen package. Solo takes 24h, Professional takes 6h, and Team takes 3h. We notify you via email as soon as they are ready."
    },
    {
      question: "What kind of photos should I upload?",
      answer: "For the best results, upload 10-20 photos with different backgrounds, outfits, and lighting. They should be clear, solo shots of your face and shoulders."
    },
    {
      question: "Can I use these on LinkedIn?",
      answer: "Absolutely! Our headshots are specifically optimized for LinkedIn, company websites, resumes, and other professional networks."
    },
    {
      question: "What is your refund policy?",
      answer: "If you are not satisfied with the results, we offer a 100% money-back guarantee within 7 days of your purchase, provided you haven't downloaded more than 3 headshots."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade encryption and delete all your source photos and generated data within 24 hours of project completion."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white/[0.01]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 italic">Questions?</h2>
          <p className="text-gray-400">Everything you need to know about OneMoreShot AI.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="glass-card rounded-2xl border border-white/5 overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left transition-colors hover:bg-white/5"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`px-8 transition-all duration-300 ease-in-out ${
                  openIndex === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
