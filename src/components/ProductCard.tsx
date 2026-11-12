import React, { useState, useRef } from 'react';
import { Eye, ShoppingBag, Heart, Star, Package } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useStore();
  const wishlisted = isInWishlist(product.id);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt & interactive spotlight state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [imgError, setImgError] = useState(false);

  const price = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Subtle 3D tilt calculation (-3 to +3 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -3;
    const tiltY = ((x - centerX) / centerX) * 3;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovering
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className="group relative bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-red-400 transition-all duration-300 hover:shadow-xl hover:shadow-red-950/10 flex flex-col will-change-transform select-none"
    >
      {/* Interactive Red Spotlight Sheen Tracking Mouse Position */}
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-200"
          style={{
            background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(220, 38, 38, 0.08), transparent 70%)`,
          }}
        />
      )}

      {/* Visual Container - Clicking Picture navigates directly to Single Product Page */}
      <div
        onClick={() => navigateTo('product', { slug: product.slug })}
        className="relative aspect-square w-full bg-slate-50/80 overflow-hidden p-4 sm:p-6 flex items-center justify-center border-b border-slate-100 cursor-pointer"
      >
        {product.image && !product.image.includes('Nautilus-Logo-Edited') && !product.image.includes('Nautilus-Protein-Black-Purple-Logo') && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-108"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300 group-hover:text-red-400 transition-colors py-4">
            <Package className="w-12 h-12 stroke-[1.3] text-slate-300" />
            <span className="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-wider">
              Photo to be uploaded
            </span>
          </div>
        )}

        {/* Brand Red Badge */}
        {product.isBestSeller ? (
          <span className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-red-700 bg-red-100 border border-red-200 px-2 sm:px-2.5 py-0.5 rounded-md shadow-sm">
            Best Seller
          </span>
        ) : product.isNew ? (
          <span className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-black bg-slate-100 border border-slate-200 px-2 sm:px-2.5 py-0.5 rounded-md shadow-sm">
            New
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-colors z-20 ${
            wishlisted
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
              : 'bg-white/90 text-slate-400 hover:text-red-600 hover:bg-white border border-slate-200 shadow-sm'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Desktop Hover Quick Actions */}
        <div className="hidden sm:flex absolute inset-x-4 bottom-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 shadow-md backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-red-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Info Content Block */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            <div className="flex items-center gap-1 text-red-600">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold tabular-nums text-slate-800">{product.rating}</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => navigateTo('product', { slug: product.slug })}
            className="font-black text-xl sm:text-2xl lg:text-[28px] text-slate-900 font-heading uppercase group-hover:text-red-700 transition-colors line-clamp-2 cursor-pointer leading-[1.08] tracking-tight"
          >
            {product.name}
          </h3>

          {/* Weight & Servings */}
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-semibold">
            {product.weight} {product.servings && `· ${product.servings} Servings`}
          </p>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tabular-nums whitespace-nowrap">
              PKR {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs sm:text-sm text-slate-400 line-through tabular-nums whitespace-nowrap">
                PKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={`p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0 ${
              product.inStock
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 active:scale-95'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
