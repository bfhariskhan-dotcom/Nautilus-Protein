import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PolicyPageProps {
  type: 'shipping' | 'refund' | 'privacy' | 'terms';
}

export const PolicyPages: React.FC<PolicyPageProps> = ({ type }) => {
  const { navigateTo } = useStore();

  const getPolicyContent = () => {
    switch (type) {
      case 'shipping':
        return {
          title: 'Shipping and Delivery Policy',
          subtitle: 'Fulfillment operations, timelines, courier partners, and inspection protocols.',
          sections: [
            {
              heading: '1. Dispatch Origin & Warehousing',
              text: 'All orders placed on https://nautilusprotein.pk are dispatched directly from our verified climate-controlled fulfillment center. Supplements are stored away from direct sunlight, moisture, and extreme heat to maintain bioactive integrity.'
            },
            {
              heading: '2. Delivery Timelines',
              text: 'Major Metros (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad): Delivered within 24 to 48 hours via specialized logistics riders.\nNationwide: Delivered within 2 to 4 business days via TCS, Leopards, or Trax.'
            },
            {
              heading: '3. Shipping Rates & Free Delivery',
              text: 'Orders with a subtotal equal to or exceeding PKR 5,000 qualify for FREE Nationwide Delivery across Pakistan. For orders below PKR 5,000, a flat standard delivery rate of PKR 350 is applied at checkout.'
            },
            {
              heading: '4. Physical Parcel Inspection',
              text: 'Customers are encouraged to inspect outer carton seals upon delivery. In the rare event that an outer box appears visibly torn or damaged, please make a note with the rider and immediately notify our WhatsApp support desk at 0325 2571589.'
            }
          ]
        };

      case 'refund':
        return {
          title: 'Returns and Refund Policy',
          subtitle: 'Our strict health safety and authenticity standards for returns and exchanges.',
          sections: [
            {
              heading: '1. Health & Supplement Safety',
              text: 'Due to strict health and contamination standards for ingestible dietary supplements, opened or unsealed supplement containers (protein tubs, softgels, pre-workouts) cannot be returned or refunded once the tamper-evident security seal or induction liner has been breached.'
            },
            {
              heading: '2. Eligibility for Returns (Unopened Goods)',
              text: 'Unopened, pristine products with original tamper neckbands intact may be returned within 7 calendar days of receipt. The customer is responsible for safe return shipping to our Karachi warehouse.'
            },
            {
              heading: '3. Damaged or Defective Items',
              text: 'If you receive an incorrect product or a manufacturer defect (e.g. broken lid in transit), notify us within 48 hours of delivery with photographic evidence. We will arrange a free immediate replacement or full refund.'
            },
            {
              heading: '4. Refund Processing',
              text: 'Approved refunds are processed via Bank Transfer, JazzCash, or Easypaisa within 3 to 5 business days after physical receipt and inspection of the returned parcel.'
            }
          ]
        };

      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'How Nautilus Protein safeguards your personal data and ordering information.',
          sections: [
            {
              heading: '1. Information Collected',
              text: 'We collect your name, phone number, delivery address, city, and email address solely for fulfilling supplement purchases, sending delivery notifications, and answering customer support inquiries.'
            },
            {
              heading: '2. Payment Data Security',
              text: 'Nautilus Protein does NOT store customer credit/debit card numbers. All manual transactions (Bank Transfer, JazzCash, Easypaisa) are verified through customer-provided transaction reference IDs.'
            },
            {
              heading: '3. Non-Disclosure & Third Parties',
              text: 'We do not sell, rent, or trade your contact details with external advertising brokers. Data is shared strictly with contracted courier partners (e.g. TCS, Leopards) necessary for door-to-door fulfillment.'
            },
            {
              heading: '4. Contact & Deletion Requests',
              text: 'To review or request deletion of your order history, please contact our privacy compliance desk at nautilusprotein@gmail.com or via WhatsApp at 0325 2571589.'
            }
          ]
        };

      case 'terms':
        return {
          title: 'Terms and Conditions',
          subtitle: 'Terms governing the purchase and consumption of Nautilus Protein supplements.',
          sections: [
            {
              heading: '1. General Store Terms',
              text: 'By visiting and purchasing from https://nautilusprotein.pk, you agree to comply with our commercial terms and local laws of Pakistan. All product descriptions, pricing, and stock levels are maintained accurately.'
            },
            {
              heading: '2. Dietary Supplement Disclaimer',
              text: 'Supplements sold on this website are intended for healthy adults over the age of 18 engaged in exercise or sports nutrition programs. Statements on this site have not been evaluated to diagnose, treat, cure, or prevent any medical condition. Always consult a certified physician before beginning an intense exercise regimen or supplement cycle.'
            },
            {
              heading: '3. Order Acceptance & Pricing',
              text: 'All orders are subject to stock availability and address verification. Prices are stated in Pakistani Rupees (PKR) and are inclusive of relevant packaging.'
            },
            {
              heading: '4. Governing Jurisdiction',
              text: 'These terms are governed by the laws of the Islamic Republic of Pakistan.'
            }
          ]
        };
    }
  };

  const content = getPolicyContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div>
        <button
          onClick={() => navigateTo('home')}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#ba0202] text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Nautilus Trust & Compliance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight uppercase font-heading leading-none">
            {content.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            {content.subtitle}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 space-y-8 text-slate-600 text-sm leading-relaxed divide-y divide-neutral-900">
        {content.sections.map((sec, idx) => (
          <div key={idx} className="pt-6 first:pt-0 space-y-2.5">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight font-heading">
              {sec.heading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
              {sec.text}
            </p>
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-500 text-center space-y-1">
        <p>Nautilus Protein · 238/170  Floor 8 Ratchadaview Codo, Soi, Sannibattasaban Jankhseam, Jatujak district, Bangkok 10900</p>
        <p>Inquiries: 0325 2571589 · nautilusprotein@gmail.com</p>
      </div>

    </div>
  );
};
