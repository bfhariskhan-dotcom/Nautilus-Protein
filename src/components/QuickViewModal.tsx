import React, { useState } from 'react';
import { X, Star, ShoppingBag, Plus, Minus, ArrowRight, MessageCircle, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, navigateTo } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');

  if (!quickViewProduct) return null;

  const currentFlavor = selectedFlavor || (quickViewProduct.flavors && quickViewProduct.flavors[0]) || '';
  const price = quickViewProduct.salePrice || quickViewProduct.price;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, currentFlavor, quickViewProduct.weight);
    setQuickViewProduct(null);
  };

  const handleFullDetails = () => {
    const slug = quickViewProduct.slug;
    setQuickViewProduct(null);
    navigateTo('product', { slug });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Column */}
        <div className="md:w-1/2 bg-white p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
          {quickViewProduct.image && !quickViewProduct.image.includes('Nautilus-Logo-Edited') && !quickViewProduct.image.includes('Nautilus-Protein-Black-Purple-Logo') ? (
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="max-h-80 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300 py-12 text-center">
              <Package className="w-16 h-16 stroke-[1.2] text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading">
                Photo to be uploaded
              </p>
            </div>
          )}
        </div>

        {/* Info & Purchase Column */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">
              {quickViewProduct.brand} · {quickViewProduct.categoryName}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 leading-tight">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
              <div className="flex items-center text-red-600">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold text-slate-900 tabular-nums">{quickViewProduct.rating}</span>
              </div>
              <span>·</span>
              <span>{quickViewProduct.reviewCount} customer reviews</span>
              <span>·</span>
              <span className="text-red-700 font-semibold">
                {quickViewProduct.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
                PKR {price.toLocaleString()}
              </span>
              {quickViewProduct.salePrice && (
                <span className="text-sm text-slate-400 line-through tabular-nums">
                  PKR {quickViewProduct.price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {quickViewProduct.shortDescription}
            </p>

            {/* Flavor Options */}
            {quickViewProduct.flavors && quickViewProduct.flavors.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Select Flavor
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.flavors.map((flv) => (
                    <button
                      key={flv}
                      type="button"
                      onClick={() => setSelectedFlavor(flv)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        currentFlavor === flv
                          ? 'border-red-600 bg-red-600 text-white font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {flv}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stepper & CTAs */}
          <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-500 hover:text-slate-900"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 text-sm font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                  className="px-3 py-2 text-slate-500 hover:text-slate-900"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!quickViewProduct.inStock}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-red-600/30"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={handleFullDetails}
                className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Full specifications & facts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href={`https://wa.me/923252571589?text=${encodeURIComponent(
                  `Hello Nautilus Protein, I would like to inquire about ${quickViewProduct.name} (${currentFlavor}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp inquiry</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
