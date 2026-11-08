import React from 'react';
import { Phone, Mail, MapPin, Shield, Clock, Truck, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-700 text-sm">
      {/* Trust Badges Sliding Marquee / Ticker Strip */}
      <div className="border-b border-slate-200 bg-slate-50/80 py-4 overflow-hidden relative select-none">
        {/* Left and right fade gradient masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10" />

        <div className="flex w-max nautilus-marquee-track hover:[animation-play-state:paused] gap-6 sm:gap-10 items-center px-4">
          {/* Set 1 */}
          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">100% Authentic Supplements</p>
              <p className="text-[11px] text-slate-500">Tamper-evident verified seals</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">Fast Nationwide Dispatch</p>
              <p className="text-[11px] text-slate-500">Express courier delivery across all Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">Cash on Delivery (COD)</p>
              <p className="text-[11px] text-slate-500">Pay safely at your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">WhatsApp Athlete Desk</p>
              <p className="text-[11px] text-slate-500">Direct stack advice & live order help</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">Zero Filler Guarantee</p>
              <p className="text-[11px] text-slate-500">100% bioactive clinical grade purity</p>
            </div>
          </div>

          {/* Set 2 (Identical loop set) */}
          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">100% Authentic Supplements</p>
              <p className="text-[11px] text-slate-500">Tamper-evident verified seals</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">Fast Nationwide Dispatch</p>
              <p className="text-[11px] text-slate-500">Express courier delivery across all Pakistan</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 px-4 py-2 rounded-xl bg-white border border-slate-200 shrink-0 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-900 text-xs font-bold uppercase tracking-wider">Cash on Delivery (COD)</p>
              <p className="text-[11px] text-slate-500">Pay safely at your doorstep</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info - Pure Logo without duplicate text beside it */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <button
                onClick={() => navigateTo('home')}
                className="group focus:outline-none block"
                aria-label="Nautilus Protein Home"
              >
                <img
                  src="https://i.postimg.cc/C54Q75KX/Nautilus-Protein-Black-Purple-Logo.png"
                  alt="Nautilus Protein"
                  className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm pt-1">
              Formulated for serious bodybuilding athletes, powerlifters, and fitness enthusiasts across Pakistan.
              Supplying 100% genuine imported and locally manufactured bioactive sports supplements with lab-verified purity.
            </p>

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-center gap-2.5 text-slate-700">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Central Logistics Hub · Delivering Nationwide Across Pakistan</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                <a href="tel:+923252571589" className="hover:text-purple-700 font-semibold transition-colors">
                  +92 325 2571589 (Call & WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                <a href="mailto:nautilusprotein@gmail.com" className="hover:text-purple-700 font-semibold transition-colors">
                  nautilusprotein@gmail.com
                </a>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700 mb-2">
                Follow Nautilus Protein
              </p>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61596560121205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-semibold transition-all shadow-sm"
                  title="Facebook: Nautilus Protein"
                >
                  <svg className="w-4 h-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/nautilusprotein/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-semibold transition-all shadow-sm"
                  title="Instagram: @nautilusprotein"
                >
                  <svg className="w-4 h-4 fill-current text-[#E4405F]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@nautilus.protein?_r=1&_t=ZS-9BD3rthYNkK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 text-xs font-semibold transition-all shadow-sm"
                  title="TikTok: @nautilus.protein"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading mb-4 text-purple-700">
              Popular Supplements
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => navigateTo('category', { category: 'whey-protein' })}
                  className="text-left block w-full hover:text-purple-700 transition-colors"
                >
                  100% Whey Protein
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('category', { category: 'mass-gainers' })}
                  className="text-left block w-full hover:text-purple-700 transition-colors"
                >
                  High-Calorie Mass Gainers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('category', { category: 'creatine' })}
                  className="text-left block w-full hover:text-purple-700 transition-colors"
                >
                  Micronized Creatine Monohydrate
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('category', { category: 'amino-acids' })}
                  className="text-left block w-full hover:text-purple-700 transition-colors"
                >
                  Nautilus BCAA & Amino Acids
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('category', { category: 'health-essentials' })}
                  className="text-left block w-full hover:text-purple-700 transition-colors"
                >
                  Vitamins & Health Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading mb-4 text-purple-700">
              Customer Desk
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={() => navigateTo('track')} className="text-left block w-full hover:text-purple-700 transition-colors font-bold text-purple-700">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="text-left block w-full hover:text-purple-700 transition-colors">
                  About Nautilus
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="text-left block w-full hover:text-purple-700 transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faqs')} className="text-left block w-full hover:text-purple-700 transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="text-left block w-full hover:text-purple-700 font-semibold transition-colors text-purple-600">
                  Admin Panel Login
                </button>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading mb-4 text-purple-700">
              Official Policies
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <button onClick={() => navigateTo('shipping')} className="text-left block w-full hover:text-purple-700 transition-colors">
                  Nationwide Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('refund')} className="text-left block w-full hover:text-purple-700 transition-colors">
                  Authenticity & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy')} className="text-left block w-full hover:text-purple-700 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('terms')} className="text-left block w-full hover:text-purple-700 transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nautilus Protein. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
