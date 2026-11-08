import React from 'react';
import { Shield, Zap, Award, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
          The Nautilus Protein Mission
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
          Built For Relentless Performance
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Nautilus Protein was founded to solve a critical issue in the Pakistani fitness landscape: the widespread circulation of questionable, counterfeit, and diluted supplement powders.
        </p>
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-2xl font-extrabold text-slate-900 uppercase font-heading">
            Our Standard: Uncompromised Integrity
          </h2>
          <p>
            Operating out of our climate-controlled distribution facility in <strong className="text-slate-900">Saima Arabian Villas, Karachi</strong>, Nautilus Protein imports and distributes genuine sports nutrition compounds manufactured to the highest clinical specifications.
          </p>
          <p>
            Whether formulating our signature <strong className="text-purple-400">Nautilus Fast Protein</strong> whey matrix with 25g protein and 5.5g BCAAs, or crafting our synergistic <strong className="text-purple-400">Creatine Omega-3 CoQ10</strong> softgels, we refuse to cut corners with cheap maltodextrin spikes, amino spiking, or deceptive serving sizes.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md shadow-purple-600/30"
            >
              <span>Explore The Roster</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xl relative aspect-video flex items-center justify-center p-8">
          <img
            src="/images/hero_athlete_training_1792514848740.jpg"
            alt="Nautilus Athletic Performance"
            className="w-full h-full object-cover rounded-2xl filter contrast-110 brightness-95"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase font-heading">Authentic Tamper-Seals</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every tub features manufacturer heat seals and induction barrier foils. We stand behind every batch with full traceability.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase font-heading">Effective Active Dosages</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No &quot;pixie dusting&quot; or masked proprietary blends. We provide transparent milligram breakdowns for active amino acids, citrulline, creatine, and proteins.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase font-heading">Pakistan-Wide Trust</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fast dispatch from Karachi with Cash on Delivery convenience for athletes across Karachi, Lahore, Islamabad, Peshawar, Quetta, and beyond.
          </p>
        </div>
      </div>

      {/* Business Details Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-2xl mx-auto text-center space-y-4">
        <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
          Official Headquarters & Fulfillment
        </h3>
        <div className="text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Saima Arabian Villas, Karachi, Pakistan</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-purple-600 shrink-0" />
            <a href="tel:+923252571589" className="hover:text-purple-700 font-semibold transition-colors">
              WhatsApp / Phone: +92 325 2571589
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-purple-600 shrink-0" />
            <a href="mailto:nautilusprotein@gmail.com" className="hover:text-purple-700 font-semibold transition-colors">
              Email: nautilusprotein@gmail.com
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
