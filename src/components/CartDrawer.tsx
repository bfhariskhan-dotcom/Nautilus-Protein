import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    navigateTo,
    settings
  } = useStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeThreshold = settings?.shipping?.freeShippingThreshold || 5000;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigateTo('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-white/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-slate-900 tracking-wide">Your Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 tabular-nums">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-slate-50/60 px-6 py-3 border-b border-slate-200 text-xs">
            {remainingForFree > 0 ? (
              <p className="text-slate-600">
                Add <span className="text-red-600 font-bold tabular-nums">PKR {remainingForFree.toLocaleString()}</span> more for <span className="text-slate-900 font-semibold">FREE Nationwide Delivery</span>
              </p>
            ) : (
              <p className="text-red-600 font-semibold flex items-center gap-1.5">
                <span>✓</span> You qualify for FREE Nationwide Delivery!
              </p>
            )}
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-slate-600 font-medium">Your cart is currently empty</p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Fuel your fitness journey with 100% authentic whey protein and performance supplements.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('shop');
                  }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors"
                >
                  Explore Supplements
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  {item.image && !item.image.includes('Nautilus-Logo-Edited') && !item.image.includes('Nautilus-Protein-Black-Purple-Logo') ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-18 h-18 object-contain rounded-lg bg-white border border-slate-200 p-1.5 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-18 h-18 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300 shrink-0">
                      <Package className="w-8 h-8 stroke-[1.2]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-red-600 font-medium">{item.brand}</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                    {(item.flavor || item.weight) && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.flavor && <span>Flavor: {item.flavor}</span>}
                        {item.flavor && item.weight && <span> · </span>}
                        {item.weight && <span>{item.weight}</span>}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Price & Remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action Buttons */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 bg-white px-6 py-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-900 font-bold text-base tabular-nums">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Shipping and taxes calculated during final checkout step.
              </p>
              
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={handleViewCart}
                  className="py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
                >
                  View Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md shadow-red-600/30 transition-colors"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
