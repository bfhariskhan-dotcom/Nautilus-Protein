import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSent(true);
    showToast('Your message has been received by our athlete support team!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600">
          Athlete Support & Wholesale Desk
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
          Get in Touch With Us
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Questions regarding batch verification, custom orders, or wholesale distribution? Our team responds within 2 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Contact Info & Details */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading">
              Official Contact Points
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-red-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold uppercase text-[11px]">Fulfillment Facility</h4>
                  <p className="text-slate-500 mt-0.5">Saima Arabian Villas, Karachi, Pakistan</p>
                  <p className="text-[10px] text-slate-400">Dispatch hub for all nationwide orders</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-red-600 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold uppercase text-[11px]">WhatsApp & Phone</h4>
                  <p className="text-slate-700 font-semibold mt-0.5 font-mono text-sm">+92 325 2571589</p>
                  <p className="text-[10px] text-slate-500">Available 10:00 AM – 10:00 PM (Mon–Sat) for athlete support</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-red-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-bold uppercase text-[11px]">Official Email</h4>
                  <p className="text-slate-700 font-semibold mt-0.5">nautilusprotein@gmail.com</p>
                  <p className="text-[10px] text-slate-500">For inquiries, batch verification & order updates</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2">
              <a
                href="https://wa.me/923252571589?text=Hello%20Nautilus%20Protein,%20I%20have%20an%20inquiry%20regarding%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-red-600/30"
              >
                <Phone className="w-4 h-4" />
                <span>Start Direct WhatsApp Chat (0325 2571589)</span>
              </a>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
                Official Social Channels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61596560121205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 transition-all text-xs"
                >
                  <svg className="w-5 h-5 fill-current text-[#1877F2] shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">Facebook</p>
                    <p className="text-[10px] text-slate-500">Nautilus Protein</p>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/nautilusprotein/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 transition-all text-xs"
                >
                  <svg className="w-5 h-5 fill-current text-[#E4405F] shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">Instagram</p>
                    <p className="text-[10px] text-slate-500">@nautilusprotein</p>
                  </div>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@nautilus.protein?_r=1&_t=ZS-9BD3rthYNkK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 transition-all text-xs"
                >
                  <svg className="w-5 h-5 fill-current text-slate-900 shrink-0" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">TikTok</p>
                    <p className="text-[10px] text-slate-500">@nautilus.protein</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading mb-6">
            Send an Online Inquiry
          </h2>

          {isSent ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Message Transmitted</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you, {name}. Our sports nutrition desk will review your message and reply via WhatsApp or phone shortly.
              </p>
              <button
                onClick={() => {
                  setIsSent(false);
                  setName('');
                  setPhone('');
                  setMessage('');
                }}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Umar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0333 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 tabular-nums"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  Inquiry Topic
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer"
                >
                  <option value="Product Inquiry">Product Information & Recommendation</option>
                  <option value="Order Status">Existing Order Tracking / Update</option>
                  <option value="Wholesale / Gym Supply">Gym / Coach Wholesale Supply</option>
                  <option value="Batch Verification">Batch Seal & Authenticity Verification</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your questions or supplement requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-red-600/30"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
