import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, Clock, AlertCircle, MessageCircle, MapPin, Truck } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { getOrdersFromFirestore } from '../services/firestoreService';

export const OrderTrackingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setOrders(null);

    try {
      let foundOrders: Order[] = [];

      // 1. Try querying Firestore orders directly
      try {
        const allOrders = await getOrdersFromFirestore();
        const cleanQ = searchQuery.trim().toLowerCase().replace(/[\s-]/g, '');
        foundOrders = allOrders.filter(o => {
          const matchNum = (o.orderNumber || '').toLowerCase().replace(/[\s-]/g, '').includes(cleanQ);
          const matchPhone = (o.phone || '').toLowerCase().replace(/[\s-]/g, '').includes(cleanQ);
          return matchNum || matchPhone;
        });
      } catch (fsErr) {
        console.warn('Firestore tracking lookup fallback:', fsErr);
      }

      // 2. If nothing found in Firestore yet, try backend endpoint
      if (foundOrders.length === 0) {
        try {
          const res = await fetch(`/api/orders/track?query=${encodeURIComponent(searchQuery.trim())}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              foundOrders = data;
            }
          }
        } catch (apiErr) {
          console.warn('API tracking lookup notice:', apiErr);
        }
      }

      if (foundOrders.length > 0) {
        setOrders(foundOrders);
      } else {
        setSearchError('No matching orders found. Please verify your order number or phone number.');
      }
    } catch {
      setSearchError('Network error while searching for order. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'Cancelled') return -1;
    return steps.indexOf(status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600">
          Real-Time Shipment Lookup
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
          Track Your Nautilus Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Enter your order reference number (e.g. <span className="text-red-600 font-mono">NP-2026-1001</span>) or mobile number used during checkout.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-2xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              placeholder="e.g. NP-2026-1001 or 0333 1234567"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-md shadow-red-600/20"
          >
            {isSearching ? 'Locating...' : 'Track Order'}
          </button>
        </form>

        {searchError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Results */}
      {orders && orders.length > 0 && (
        <div className="space-y-8">
          {orders.map((ord) => {
            const currentIdx = getStepIndex(ord.orderStatus);
            const isCancelled = ord.orderStatus === 'Cancelled';

            return (
              <div
                key={ord.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Order Reference
                    </span>
                    <h2 className="text-xl font-black text-slate-900 font-mono tracking-wider">
                      {ord.orderNumber}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Placed on {new Date(ord.createdAt).toLocaleDateString('en-PK', { dateStyle: 'long' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isCancelled
                        ? 'bg-red-950/60 text-red-400 border border-red-800'
                        : ord.orderStatus === 'Delivered'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      Status: {ord.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper (if not cancelled) */}
                {!isCancelled ? (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      {steps.map((st, i) => {
                        const isDone = i <= currentIdx;
                        const isCurrent = i === currentIdx;

                        return (
                          <div key={st} className="flex-1 relative flex flex-col items-center">
                            {/* Connecting Line */}
                            {i > 0 && (
                              <div
                                className={`absolute top-4 -left-1/2 w-full h-[2px] transition-colors ${
                                  i <= currentIdx ? 'bg-red-600' : 'bg-neutral-200'
                                }`}
                              />
                            )}

                            {/* Node Icon */}
                            <div
                              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                                  : 'bg-slate-50 text-slate-400 border border-slate-200'
                              } ${isCurrent ? 'ring-4 ring-red-600/30' : ''}`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                            </div>

                            <span
                              className={`text-[11px] font-semibold mt-2 text-center uppercase tracking-wider ${
                                isCurrent
                                  ? 'text-slate-900 font-bold'
                                  : isDone
                                  ? 'text-red-600'
                                  : 'text-slate-400'
                              }`}
                            >
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-950/30 border border-red-900 text-xs text-red-300">
                    This order was marked as Cancelled. For assistance, reach out to our WhatsApp desk.
                  </div>
                )}

                {/* Shipping & Recipient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Destination Details</span>
                    </p>
                    <p><span className="text-slate-400">Name:</span> {ord.customerName}</p>
                    <p><span className="text-slate-400">Phone:</span> {ord.phone}</p>
                    <p><span className="text-slate-400">City:</span> {ord.city}</p>
                    <p><span className="text-slate-400">Address:</span> {ord.address}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-red-600" />
                      <span>Fulfillment & Payment</span>
                    </p>
                    <p>
                      <span className="text-slate-400">Payment:</span>{' '}
                      <strong className="text-slate-900 uppercase">{ord.paymentMethod.replace('_', ' ')}</strong>
                    </p>
                    <p><span className="text-slate-400">Payment Status:</span> {ord.paymentStatus}</p>
                    <p><span className="text-slate-400">Total Amount:</span> PKR {ord.total.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-500 pt-1">
                      Warehouse Hub: Saima Arabian Villas, Karachi
                    </p>
                  </div>
                </div>

                {/* Items in this order */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Items in this Package
                  </h3>
                  <div className="divide-y divide-slate-100 border-y border-slate-200">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-contain rounded-md bg-white border border-slate-200 p-1"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-slate-500 text-[11px]">
                              {item.flavor && <span>{item.flavor} · </span>}
                              <span>Qty: {item.quantity}</span>
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 tabular-nums">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick WhatsApp Support Link */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span>Need to modify delivery address or verify rider timing?</span>
                  </div>
                  <a
                    href={`https://wa.me/923252571589?text=${encodeURIComponent(
                      `Hello Nautilus Protein, I am checking the status of Order #${ord.orderNumber}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-md shadow-red-600/30 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Courier Desk</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Trust Notice */}
      <div className="p-6 rounded-3xl bg-white/40 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-red-600" />
          <span>Nautilus Official Pakistan Logistics Network</span>
        </div>
        <p>Direct shipments dispatched across all cities and towns in Pakistan.</p>
        <p>Support hotline: +92 325 2571589 · nautilusprotein@gmail.com</p>
      </div>

    </div>
  );
};
