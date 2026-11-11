import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowLeft, ArrowRight, Lock, CheckCircle, CreditCard, Building2, Smartphone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';
import { saveOrderToFirestore } from '../services/firestoreService';

export const CheckoutPage: React.FC = () => {
  const { cart, settings, clearCart, navigateTo, showToast } = useStore();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Karachi');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [paymentReference, setPaymentReference] = useState('');
  
  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeThreshold = settings?.shipping?.freeShippingThreshold || 5000;
  const standardFee = settings?.shipping?.standardRate || 350;
  const shippingFee = subtotal >= freeThreshold || cart.length === 0 ? 0 : standardFee;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const majorCities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Sialkot',
    'Hyderabad',
    'Gujranwala',
    'Bahawalpur',
    'Abbottabad',
    'Sargodha',
    'Other City / Town'
  ];

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
        setAppliedCoupon({ code: data.code, discount: data.discount });
        showToast(`Promo code "${data.code}" applied! Saved PKR ${data.discount.toLocaleString()}`);
      } else {
        showToast(data.error || 'Invalid promo code.', 'error');
      }
    } catch {
      showToast('Error validating coupon.', 'error');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your cart is empty.', 'error');
      navigateTo('shop');
      return;
    }

    if (!customerName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      showToast('Please provide your name, phone number, city, and delivery address.', 'error');
      return;
    }

    // Phone format check
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please provide a valid Pakistani mobile number (e.g. 0333 1234567).', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        city: city.trim(),
        address: address.trim(),
        notes: notes.trim(),
        paymentMethod,
        paymentReference: paymentReference.trim(),
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          brand: item.brand,
          image: item.image,
          price: item.price,
          flavor: item.flavor,
          weight: item.weight,
          quantity: item.quantity
        })),
        couponCode: appliedCoupon?.code
      };

      let finalOrderData: any = null;

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          finalOrderData = await res.json();
        }
      } catch (apiErr) {
        console.warn('Backend API order notice, using direct Firestore order placement:', apiErr);
      }

      // If backend was not reached or returned error on static host, create order record in Firestore
      if (!finalOrderData) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `NP-2026-${randomSuffix}`;
        const localOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber,
          customerName: customerName.trim(),
          phone: cleanPhone,
          email: email.trim(),
          city: city.trim(),
          address: address.trim(),
          notes: notes.trim(),
          paymentMethod,
          paymentReference: paymentReference.trim(),
          paymentStatus: 'Pending',
          orderStatus: 'Pending',
          items: payload.items,
          subtotal,
          shippingFee,
          discount,
          couponCode: appliedCoupon?.code,
          total,
          createdAt: new Date().toISOString()
        };
        finalOrderData = await saveOrderToFirestore(localOrder);
      } else {
        // Also ensure it is in Firestore!
        saveOrderToFirestore(finalOrderData).catch(e => console.warn('Firestore order sync:', e));
      }

      // Order created successfully
      clearCart();
      showToast(`Order #${finalOrderData.orderNumber} successfully placed!`);
      navigateTo('confirmation', { order: finalOrderData });
    } catch (err) {
      console.error(err);
      showToast('A network error occurred while submitting your order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add supplements to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/20 transition-colors"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header */}
      <div className="mb-8 pb-4 border-b border-slate-200 flex items-center justify-between">
        <button
          onClick={() => navigateTo('cart')}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Lock className="w-3.5 h-3.5 text-red-500" />
          <span>256-Bit Encrypted Order Processing</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Customer & Shipping Details (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Customer Information Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
                Customer & Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Hamza"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
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
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Courier dispatch alerts will be sent to this number.
                </span>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-600 font-semibold mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. athlete@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
                Pakistan Delivery Destination
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 focus:outline-none focus:border-red-600 cursor-pointer font-medium"
                >
                  {majorCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">
                  Fulfillment Speed
                </label>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-[11px]">
                    {city === 'Karachi' ? 'Express (24–48 Hours)' : 'Nationwide Courier (2–4 Days)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-600 font-semibold mb-1.5">
                Complete Delivery Street Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="House / Apartment #, Street Name, Sector, Block, Area, Landmark"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600 leading-relaxed"
              />
            </div>

            <div className="text-xs">
              <label className="block text-slate-600 font-semibold mb-1.5">
                Order Notes / Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Leave with guard, or call before 5 PM"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
              <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
                Select Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-red-600 bg-red-50/50 shadow-md shadow-red-950/5'
                    : 'border-slate-200 bg-white/60 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-red-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</span>
                    <span className="text-xs text-red-600 font-semibold">Doorstep Pay</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Pay in cash directly to the courier rider upon physical inspection of the parcel. Available across all Pakistan cities.
                  </p>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-red-600 bg-red-50/50 shadow-md shadow-red-950/5'
                    : 'border-slate-200 bg-white/60 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 accent-red-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-red-600" />
                      <span>Direct Online Bank Transfer</span>
                    </span>
                    <span className="text-xs text-red-600 font-mono">IBAN / Raast</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Transfer directly into our Meezan Bank / HBL corporate accounts via Raast or online banking.
                  </p>

                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 font-mono">
                      <p><span className="text-slate-400">Bank:</span> {settings?.payments?.bankDetails?.bankName || 'Meezan Bank Limited'}</p>
                      <p><span className="text-slate-400">Title:</span> {settings?.payments?.bankDetails?.accountTitle || 'Nautilus Nutrition / Micro Health'}</p>
                      <p><span className="text-slate-400">Account #:</span> {settings?.payments?.bankDetails?.accountNumber || '0102948102938102'}</p>
                      <p><span className="text-slate-400">IBAN:</span> {settings?.payments?.bankDetails?.iban || 'PK36MEZN0001029481029381'}</p>
                      <div className="pt-2">
                        <input
                          type="text"
                          placeholder="Enter your Bank Transfer Ref / Transaction ID"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-sans text-xs focus:outline-none focus:border-red-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* JazzCash */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-red-600 bg-red-50/50 shadow-md shadow-red-950/5'
                    : 'border-slate-200 bg-white/60 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 accent-red-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-red-600" />
                      <span>JazzCash Mobile Account</span>
                    </span>
                    <span className="text-[11px] text-red-700 font-bold bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">Instant</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Send funds directly to Nautilus JazzCash account number <strong className="text-slate-900">0333 2499499</strong>.
                  </p>

                  {paymentMethod === 'jazzcash' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                      <p><span className="text-slate-400">Account Title:</span> Nautilus Sports Nutrition</p>
                      <p><span className="text-slate-400">Account Number:</span> 0333 2499499</p>
                      <input
                        type="text"
                        placeholder="Enter JazzCash Transaction TID (e.g. TID: 10928371)"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 text-xs focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Easypaisa */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'border-red-600 bg-red-50/50 shadow-md shadow-red-950/5'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-1 accent-red-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-red-600" />
                      <span>Easypaisa Mobile Account</span>
                    </span>
                    <span className="text-[11px] text-red-700 font-bold bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">Instant</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Send funds directly to Nautilus Easypaisa account number <strong className="text-slate-900">0333 2499499</strong>.
                  </p>

                  {paymentMethod === 'easypaisa' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                      <p><span className="text-slate-400">Account Title:</span> Nautilus Sports Nutrition</p>
                      <p><span className="text-slate-400">Account Number:</span> 0333 2499499</p>
                      <input
                        type="text"
                        placeholder="Enter Easypaisa Transaction ID (e.g. TRX-992817)"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 text-xs focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Review & Confirmation (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 lg:sticky lg:top-28">
            <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-heading pb-3 border-b border-slate-200">
              Order Review ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
            </h3>

            {/* Itemized list */}
            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-neutral-900 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
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

            {/* Coupon Code Input */}
            <div className="pt-3 border-t border-slate-200">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300">
                  <span>Coupon &quot;{appliedCoupon.code}&quot; Applied (-PKR {discount.toLocaleString()})</span>
                  <button
                    type="button"
                    onClick={() => setAppliedCoupon(null)}
                    className="text-slate-500 hover:text-slate-900 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. NAUTILUS10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-red-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 rounded-xl text-xs font-bold uppercase transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 tabular-nums">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({city})</span>
                <span className="font-bold tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-red-600 font-bold">FREE</span>
                  ) : (
                    `PKR ${shippingFee}`
                  )}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span className="font-bold tabular-nums">-PKR {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-red-600 tabular-nums">PKR {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Final Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-colors"
            >
              <span>{isSubmitting ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              By confirming your order, you agree to Nautilus Protein shipping terms. No hidden taxes or extra customs fees.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
};
