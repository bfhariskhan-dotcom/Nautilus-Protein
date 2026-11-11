import React from 'react';
import { ShieldCheck, Zap, Award, MapPin, Phone, Mail, ArrowRight, CheckCircle2, QrCode, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ba0202]">
          ABOUT US · NAUTILUS PROTEIN
        </p>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight uppercase font-heading leading-tight">
          Born in Pakistan.<br />
          <span className="text-[#ba0202]">Built for Performance.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
          Nautilus Protein was started with one simple mission — To give Pakistan pure, lab-tested, and affordable supplements that actually work.
        </p>
      </div>

      {/* Main Story & Value Proposition */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Quote Block */}
        <div className="bg-red-50/70 border-l-4 border-[#ba0202] rounded-r-2xl p-5 sm:p-6 text-slate-800 text-sm sm:text-base italic leading-relaxed">
          &ldquo;Nautilus Protein is Pakistan&apos;s trusted supplement brand — Pure, Halal & Lab-Tested protein, creatine and vitamins, made for real results at honest prices.&rdquo;
        </div>

        {/* Narrative Paragraphs */}
        <div className="space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed">
          <p>
            For years, Pakistani athletes and gym-goers had only two choices: Expensive imported supplements that were often fake, or cheap local supplements with no quality, no lab testing, and no results. <strong className="text-slate-900 font-bold">We decided to change that.</strong>
          </p>
          <p>
            Nautilus is a Pakistani brand, made in a <strong className="text-slate-900">PFA Licensed, GMP & ISO Certified facility in Karachi</strong>. Every product — from our Fast Protein, Creatine, Biotin, Magnesium to our Omega-3 + CoQ10 — is made with imported, <strong className="text-[#ba0202]">Creapure® & DSM Grade</strong> raw materials, tested for purity, heavy metals and potency, and is <strong className="text-slate-900">100% Halal</strong>.
          </p>
          <p>
            We believe in transparency. No amino spiking. No fake labels. No hidden fillers. What is written on the jar is what is inside the jar — and every batch has a QR lab report to prove it.
          </p>
          <p>
            Today, Nautilus is trusted by thousands of gym-goers, athletes, students, and families across Pakistan who want strength, recovery, better sleep, hair growth and a healthier life.
          </p>
        </div>

        {/* Our Promise Banner Box */}
        <div className="bg-black text-white rounded-2xl p-6 sm:p-8 space-y-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-red-600/30 to-transparent pointer-events-none" />
          <p className="text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Our Promise</span>
          </p>
          <h2 className="text-xl sm:text-3xl font-extrabold uppercase tracking-tight font-heading text-white">
            Pure. Potent. Halal. Affordable. — For Every Pakistani.
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 font-semibold tracking-wide uppercase font-heading pt-1">
            Nautilus Protein — Strength Starts Here.
          </p>
        </div>

        {/* Call to action */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigateTo('shop')}
            className="px-8 py-3.5 bg-[#ba0202] hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md shadow-red-600/30 font-heading"
          >
            <span>Explore The Supplement Roster</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('contact')}
            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors font-heading"
          >
            Contact Advisor
          </button>
        </div>

      </div>

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#ba0202]">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 uppercase font-heading">PFA, GMP & ISO Certified</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Manufactured in a certified pharmaceutical-grade facility in Karachi ensuring international safety standards.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#ba0202]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 uppercase font-heading">Creapure® & DSM Grade</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Imported raw materials clinically tested for potency, heavy metals, and bioactive purity. 100% Halal.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#ba0202]">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 uppercase font-heading">QR Lab Reports</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every batch features a scannable QR lab report proving full label accuracy with zero amino spiking.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#ba0202]">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 uppercase font-heading">Nationwide Delivery</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dispatched direct from Karachi with Cash on Delivery (COD) across Karachi, Lahore, Islamabad, and all cities.
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
            <MapPin className="w-4 h-4 text-[#ba0202] shrink-0" />
            <span>Saima Arabian Villas, Karachi, Pakistan</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-[#ba0202] shrink-0" />
            <a href="tel:+923252571589" className="hover:text-red-700 font-semibold transition-colors">
              WhatsApp / Phone: +92 325 2571589
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-[#ba0202] shrink-0" />
            <a href="mailto:nautilusprotein@gmail.com" className="hover:text-red-700 font-semibold transition-colors">
              Email: nautilusprotein@gmail.com
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
