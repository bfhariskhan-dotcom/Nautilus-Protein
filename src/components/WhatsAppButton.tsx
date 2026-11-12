import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '923252571589';

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end">
      {/* Tooltip / Mini Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white border border-red-200 rounded-2xl shadow-2xl p-4 text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm shadow-red-500/80 animate-pulse" />
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Nautilus Athlete Desk</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-600 leading-relaxed mb-3">
            Assalam-o-Alaikum! Welcome to Nautilus Protein. Need help selecting supplements, verifying batch numbers, or tracking an order?
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              'Hello Nautilus Protein, I would like to inquire about your supplements and delivery in Pakistan.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-red-600/30"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (0325 2571589)</span>
          </a>
        </div>
      )}

      {/* Floating Action Button with Red Theme */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 border border-red-300"
        aria-label="Contact Nautilus on WhatsApp"
        title="WhatsApp Support (0325 2571589)"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};
