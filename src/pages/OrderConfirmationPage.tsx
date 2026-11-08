import React from 'react';
import { CheckCircle2, PackageCheck, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationPage: React.FC = () => {
  const { lastConfirmedOrder, navigateTo } = useStore();

  if (!lastConfirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">No Recent Order</h2>
        <p className="text-xs text-slate-500">If you already placed an order, you can look it up using our tracking tool.</p>
        <button
          onClick={() => navigateTo('track')}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-purple-600/20 transition-colors"
        >
          Track An Order
        </button>
      </div>
    );
  }

  const order = lastConfirmedOrder;
  const whatsappInquiryUrl = `https://wa.me/923252571589?text=${encodeURIComponent(
    `Hello Nautilus Protein, I just placed Order #${order.orderNumber} for PKR ${order.total.toLocaleString()} (${order.customerName}, ${order.city}). Please confirm receipt.`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Success Hero Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-purple-950/80 border border-purple-800 text-purple-400 flex items-center justify-center mx-auto shadow-xl shadow-purple-950/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
            Order Successfully Placed
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
            Thank You, {order.customerName}
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your supplement order is now registered in the Nautilus Protein fulfillment system. A dispatch notification with tracked courier details will be sent directly to your phone.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="inline-block mt-2 p-4 rounded-2xl bg-white border border-slate-200 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
            Order Reference Number
          </span>
          <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono tracking-wider">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Destination & Payment Method */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-purple-400" />
              <span>Delivery Information</span>
            </h3>
            <div className="text-xs text-slate-600 space-y-2">
              <p><span className="text-slate-400">Recipient:</span> {order.customerName}</p>
              <p><span className="text-slate-400">Phone:</span> {order.phone}</p>
              {order.email && <p><span className="text-slate-400">Email:</span> {order.email}</p>}
              <p><span className="text-slate-400">City:</span> {order.city}</p>
              <p><span className="text-slate-400">Address:</span> {order.address}</p>
              {order.notes && <p><span className="text-slate-400">Notes:</span> {order.notes}</p>}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Payment Protocol</span>
            </h3>
            <div className="text-xs text-slate-600 space-y-1.5">
              <p>
                <span className="text-slate-400">Method:</span>{' '}
                <strong className="text-slate-900 uppercase">{order.paymentMethod.replace('_', ' ')}</strong>
              </p>
              {order.paymentReference && (
                <p>
                  <span className="text-slate-400">Transaction Ref:</span>{' '}
                  <span className="font-mono text-purple-300">{order.paymentReference}</span>
                </p>
              )}
              <p>
                <span className="text-slate-400">Payment Status:</span>{' '}
                <span className="text-purple-300 font-semibold">{order.paymentStatus}</span>
              </p>
              {order.paymentMethod === 'cod' ? (
                <p className="text-[11px] text-slate-500 pt-1">
                  Please have the exact cash amount of PKR {order.total.toLocaleString()} ready for the courier rider upon delivery.
                </p>
              ) : (
                <p className="text-[11px] text-slate-500 pt-1">
                  Your payment will be verified by our accounts desk before dispatch.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Purchased Products & Total Receipt */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3">
              Itemized Receipt
            </h3>
            <div className="divide-y divide-neutral-900 py-2 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.flavor && <span>{item.flavor} · </span>}
                      <span>Qty: {item.quantity}</span>
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">PKR {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Nationwide Shipping</span>
                <span className="tabular-nums">{order.shippingFee === 0 ? 'FREE' : `PKR ${order.shippingFee}`}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-purple-400">
                  <span>Discount ({order.couponCode})</span>
                  <span className="tabular-nums">-PKR {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                <span>Final Total Paid/Due</span>
                <span className="text-purple-400 tabular-nums">PKR {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire / Send WhatsApp Slip</span>
            </a>

            <button
              onClick={() => navigateTo('track')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Track Order Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => navigateTo('shop')}
          className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Continue Browsing Nautilus Protein
        </button>
      </div>

    </div>
  );
};
