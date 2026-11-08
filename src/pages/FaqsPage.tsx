import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FaqsPage: React.FC = () => {
  const { navigateTo } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I know Nautilus Protein supplements are 100% authentic?',
      a: 'All Nautilus products feature genuine manufacturer tamper-evident outer neckband heat seals and inner induction seals. We ship directly from our dedicated warehouse in Saima Arabian Villas, Karachi, with zero third-party brokers.'
    },
    {
      q: 'How fast is delivery to Karachi and other cities in Pakistan?',
      a: 'Karachi orders are delivered via express riders within 24 to 48 hours. Orders to Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and other nationwide destinations are dispatched via leading couriers (TCS / Leopards) and arrive within 2 to 4 business days.'
    },
    {
      q: 'What payment options do you support?',
      a: 'We support Cash on Delivery (COD) across Pakistan. In addition, we accept Direct Online Bank Transfers (Meezan Bank & HBL), JazzCash (0325 2571589), and Easypaisa (0325 2571589).'
    },
    {
      q: 'What is the Free Delivery policy?',
      a: 'All orders over PKR 5,000 qualify for FREE Nationwide Delivery anywhere in Pakistan. For orders under PKR 5,000, a flat standard courier fee of PKR 350 applies.'
    },
    {
      q: 'What should I do if I have specific dietary goals or allergies?',
      a: 'Every product page contains our verified nutrition facts, ingredient lists, and allergen warnings. You can also message our WhatsApp Athlete Support team at +92 325 2571589 for personalized stack guidance.'
    },
    {
      q: 'Can I track my order once dispatched?',
      a: 'Yes! Use our built-in Order Tracking tool by entering your Order Reference Number (e.g. NP-2026-1002) or phone number to view live shipment milestones.'
    },
    {
      q: 'What is your return and refund policy?',
      a: 'If your product arrives damaged or with an unsealed tamper band, contact us within 48 hours of delivery. Sealed, unopened containers in original condition can be returned within 7 days.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-800 text-purple-400 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
          Knowledge Base & Help
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Clear answers regarding product authenticity, delivery timelines, payment methods, and supplement safety.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm font-bold text-slate-900 leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-purple-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-slate-50/40 border border-slate-200 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
          Still Have Questions About Supplements?
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Speak with our sports nutrition advisor directly on WhatsApp for real-time guidance.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="https://wa.me/923252571589?text=Hello%20Nautilus%20Protein,%20I%20have%20a%20question%20not%20covered%20in%20the%20FAQs."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-purple-600/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+92 325 2571589)</span>
          </a>
          <button
            onClick={() => navigateTo('contact')}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Contact Desk
          </button>
        </div>
      </div>

    </div>
  );
};
