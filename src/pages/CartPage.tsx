import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    navigateTo,
    settings,
    showToast
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    discountType: string;
    discountValue: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeThreshold = settings?.shipping?.freeShippingThreshold || 5000;
  const standardFee = settings?.shipping?.standardRate || 350;
  const shippingFee = subtotal >= freeThreshold || cart.length === 0 ? 0 : standardFee;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponInput.trim(),
          subtotal
        })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data);
        showToast(`Promo code "${data.code}" applied! Saved PKR ${data.discount.toLocaleString()}`);
      } else {
        showToast(data.error || 'Invalid discount coupon.', 'error');
      }
    } catch {
      showToast('Error validating coupon.', 'error');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    showToast('Promo code removed', 'info');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-neutral-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Looks like you haven&apos;t added any athletic supplements to your cart yet. Explore our best-selling whey protein, creatine, and pre-workouts.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-purple-600/30"
        >
          Explore Supplement Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8 pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-purple-400">Review Items</p>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading mt-1">
            Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Shipping Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200 text-xs">
        <div className="flex items-center justify-between">
          {remainingForFree > 0 ? (
            <span className="text-slate-600">
              Add <span className="text-purple-400 font-bold tabular-nums">PKR {remainingForFree.toLocaleString()}</span> more to unlock <strong className="text-slate-900">FREE Nationwide Delivery</strong>
            </span>
          ) : (
            <span className="text-purple-300 font-bold flex items-center gap-1.5">
              <span>✓</span> Free Nationwide Delivery Unlocked!
            </span>
          )}
          <span className="text-slate-400 tabular-nums">{progressPercent}%</span>
        </div>
        <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 divide-y divide-neutral-900 border-y border-slate-200">
          {cart.map((item) => (
            <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
              <div className="flex gap-4 items-center flex-1 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded-xl bg-white border border-slate-200 p-2 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                    {item.brand}
                  </p>
                  <h3
                    onClick={() => navigateTo('product', { slug: item.productId })}
                    className="text-base font-bold text-slate-900 hover:text-purple-300 cursor-pointer transition-colors truncate"
                  >
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    {item.flavor && <span>Flavor: {item.flavor}</span>}
                    {item.flavor && item.weight && <span>·</span>}
                    {item.weight && <span>{item.weight}</span>}
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-1 sm:hidden tabular-nums">
                    PKR {item.price.toLocaleString()} each
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                {/* Stepper */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900 tabular-nums block">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:block tabular-nums">
                    PKR {item.price.toLocaleString()} each
                  </span>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-heading">
              Order Summary
            </h3>

            {/* Price lines */}
            <div className="space-y-2.5 text-xs text-slate-600 divide-y divide-neutral-900 pt-1">
              <div className="flex justify-between pb-2">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900 tabular-nums">PKR {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-2">
                <span>Nationwide Shipping</span>
                <span className="font-bold tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-purple-300">FREE</span>
                  ) : (
                    `PKR ${shippingFee}`
                  )}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between py-2 text-purple-300">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-purple-400" />
                    <span>Coupon ({appliedCoupon.code})</span>
                  </span>
                  <span className="font-bold tabular-nums">-PKR {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between pt-3 text-base font-extrabold text-slate-900">
                <span>Estimated Total</span>
                <span className="text-purple-400 tabular-nums">PKR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-slate-200">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Have a Promo Code?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-950/40 border border-purple-800 text-xs text-purple-300">
                  <span className="font-semibold">{appliedCoupon.code} Applied</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-slate-500 hover:text-slate-900 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. NAUTILUS10 or POWER500"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isValidatingCoupon}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    {isValidatingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Primary Checkout Button */}
            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className="w-full py-2 text-center text-xs text-slate-500 hover:text-slate-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 border border-slate-200 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Nautilus Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              All sports supplements ship directly from our climate-controlled fulfillment center with certified seals, delivering nationwide across Pakistan.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
