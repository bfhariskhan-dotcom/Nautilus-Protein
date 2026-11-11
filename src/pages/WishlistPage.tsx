import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, navigateTo } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-slate-200 pb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#ba0202]">
          Saved Supplements
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading mt-1">
          Your Wishlist ({wishlistedProducts.length})
        </h1>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 text-neutral-600 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click the heart icon on any supplement card to save products here for quick ordering later.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 bg-[#ba0202] hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/20 transition-colors font-heading"
          >
            Explore Supplements
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((p) => {
            const price = p.salePrice || p.price;
            return (
              <div
                key={p.id}
                className="bg-slate-50/50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between p-4 space-y-4"
              >
                <div className="relative aspect-square bg-white rounded-xl p-4 flex items-center justify-center">
                  {p.image && !p.image.includes('Nautilus-Logo-Edited') && !p.image.includes('Nautilus-Protein-Black-Purple-Logo') ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain cursor-pointer"
                      onClick={() => navigateTo('product', { slug: p.slug })}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center text-slate-300 cursor-pointer"
                      onClick={() => navigateTo('product', { slug: p.slug })}
                    >
                      <Package className="w-10 h-10 stroke-[1.3] text-slate-300 mb-1" />
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">No Photo</span>
                    </div>
                  )}
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-50/80 text-rose-500 hover:text-slate-900 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#ba0202]">
                    {p.brand}
                  </p>
                  <h3
                    onClick={() => navigateTo('product', { slug: p.slug })}
                    className="text-sm font-bold text-slate-900 hover:text-[#ba0202] cursor-pointer transition-colors line-clamp-1"
                  >
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-900 font-extrabold tabular-nums">
                    PKR {price.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => addToCart(p, 1)}
                  disabled={!p.inStock}
                  className="w-full py-2.5 px-4 bg-[#ba0202] hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors font-heading"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{p.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {wishlistedProducts.length > 0 && (
        <div className="pt-4 flex justify-between items-center text-xs">
          <button
            onClick={() => navigateTo('shop')}
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            ← Continue Shopping
          </button>
          <button
            onClick={() => navigateTo('cart')}
            className="text-[#ba0202] hover:text-red-700 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Go to Shopping Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
