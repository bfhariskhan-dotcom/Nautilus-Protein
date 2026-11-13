import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FaqsPage: React.FC = () => {
  const { navigateTo } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I know Nautilus Protein supplements are 100% authentic?',
      a: 'All Nautilus products feature genuine manufacturer tamper-evident outer neckband heat seals and inner induction seals. We ship directly from our dedicated distribution facility with zero third-party brokers, backed by full batch testing.'
    },
    {
      q: 'How fast is delivery across Pakistan?',
      a: 'Orders are dispatched immediately upon payment confirmation. Deliveries arrive within 24 to 48 hours in major metropolitan hubs, and within 2 to 4 business days nationwide via trusted couriers (TCS / Leopards).'
    },
    {
      q: 'What payment options do you support?',
      a: 'We accept Direct Online Bank Transfers (Meezan Bank Limited), JazzCash (0325 2571589), and Easypaisa (0325 2571589). All orders are dispatched promptly upon direct online payment confirmation.'
    },
    {
      q: 'What is the Free Delivery policy?',
      a: 'All orders over PKR 5,000 qualify for FREE Nationwide Delivery anywhere in Pakistan. For orders under PKR 5,000, a flat standard courier fee of PKR 350 applies.'
    },
    {
      q: 'What should I do if I have specific dietary goals or allergies?',
      a: 'Every product page contains our verified nutrition facts, ingredient lists, and allergen warnings. You can also message our WhatsApp Athlete Support team at 0325 2571589 for personalized stack guidance.'
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-[#ba0202] flex items-center justify-center mx-auto">
          <HelpCircle className="w-7 h-7" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-[#ba0202] font-heading">
          Knowledge Base & Help Desk
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black text-slate-900 tracking-tight uppercase font-heading leading-[0.98]">
          Frequently Asked Questions
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto font-medium">
          Clear answers regarding product authenticity, express delivery timelines, direct payment methods, and supplement safety.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 sm:space-y-6">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden transition-all shadow-sm hover:border-red-600/40"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-6 sm:p-8 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug uppercase font-heading">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-7 h-7 text-[#ba0202] shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 sm:px-8 pb-8 pt-2 text-base sm:text-xl text-slate-700 leading-relaxed border-t border-slate-200 font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions CTA */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-5">
        <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight font-heading">
          Still Have Questions About Supplements?
        </h3>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
          Speak with our sports nutrition advisor directly on WhatsApp for real-time guidance.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <a
            href="https://wa.me/923252571589?text=Hello%20Nautilus%20Protein,%20I%20have%20a%20question%20not%20covered%20in%20the%20FAQs."
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#ba0202] hover:bg-red-700 text-white rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-lg shadow-red-600/30 font-heading"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat on WhatsApp (0325 2571589)</span>
          </a>
          <button
            onClick={() => navigateTo('contact')}
            className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900 rounded-2xl text-sm sm:text-base font-black uppercase tracking-wider transition-colors font-heading"
          >
            Contact Desk
          </button>
        </div>
      </div>

    </div>
  );
};
