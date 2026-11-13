import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  ShoppingBag,
  Plus,
  Minus,
  MessageCircle,
  Heart,
  Check,
  HelpCircle,
  Users,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Zap,
  Package
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    selectedProductSlug,
    addToCart,
    navigateTo,
    toggleWishlist,
    isInWishlist
  } = useStore();

  const product = products.find(p => p.slug === selectedProductSlug) || products[0];

  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product?.flavors?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

  // Cursor drag & finger swipe slider state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Accordion open state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    if (product) {
      setActiveSlideIdx(0);
      setDragOffset(0);
      if (product.flavors && product.flavors.length > 0) {
        setSelectedFlavor(product.flavors[0]);
      }
    }
  }, [product?.id, product?.slug, product?.image]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-slate-900 font-bold">Product not found.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const price = product.salePrice || product.price;
  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price);
  const savings = hasDiscount ? product.price - (product.salePrice || 0) : 0;
  const currentFlavor = selectedFlavor || product.flavors?.[0] || '';

  // Consolidate all images (primary + gallery), strictly excluding default logo URLs
  const isLogo = (url?: string) =>
    !url ||
    url.includes('Nautilus-Logo-Edited') ||
    url.includes('Nautilus-Protein-Black-Purple-Logo');

  const allImages = Array.from(new Set([product.image, ...(product.gallery || [])]))
    .filter(Boolean)
    .filter(img => !isLogo(img));

  const safeSlideIdx = allImages.length > 0 ? Math.min(activeSlideIdx, allImages.length - 1) : 0;

  const prevSlide = () => {
    if (allImages.length <= 1) return;
    setActiveSlideIdx((prev) => (prev <= 0 ? allImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (allImages.length <= 1) return;
    setActiveSlideIdx((prev) => (prev >= allImages.length - 1 ? 0 : prev + 1));
  };

  // Mouse cursor drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (allImages.length === 0) return;
    dragStartX.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX.current === null) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    const diff = dragStartX.current - e.clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    dragStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      dragStartX.current = null;
      setIsDragging(false);
      setDragOffset(0);
    }
  };

  // Touch finger swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (allImages.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) {
      setDragOffset(0);
      return;
    }
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
    setDragOffset(0);
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity, currentFlavor, product.weight);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, currentFlavor, product.weight);
    navigateTo('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      
      {/* 1. Main Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        
        {/* Left: Interactive Cursor-Drag & Touch-Swipe Image Carousel with Arrows */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`aspect-square bg-white border border-slate-200/90 rounded-3xl relative overflow-hidden shadow-lg shadow-red-950/5 select-none group ${
              allImages.length > 0
                ? isDragging
                  ? 'cursor-grabbing'
                  : 'cursor-grab'
                : ''
            }`}
            title={allImages.length > 1 ? 'Drag with cursor or swipe to slide images' : product.name}
          >
            {allImages.length > 0 ? (
              <div
                className={`flex w-full h-full ${
                  isDragging ? '' : 'transition-transform duration-500 ease-out'
                }`}
                style={{
                  transform: `translate3d(calc(-${safeSlideIdx * 100}% + ${dragOffset}px), 0, 0)`
                }}
              >
                {allImages.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="min-w-full w-full h-full p-6 sm:p-10 flex items-center justify-center shrink-0"
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} view ${idx + 1}`}
                      draggable={false}
                      className="max-h-full max-w-full object-contain pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 py-10 text-center p-4">
                <Package className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1.2] text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider font-heading">
                  Product Photo to be uploaded
                </p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Authentic container & seal photos can be selected via the Admin Panel.
                </p>
              </div>
            )}

            {/* Top Left Status Badge */}
            {product.isBestSeller ? (
              <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-white bg-red-600 border border-red-700 px-3 py-1 rounded-lg shadow-sm z-10 pointer-events-none">
                Best Seller
              </span>
            ) : product.isNew ? (
              <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-neutral-900 bg-neutral-100 border border-neutral-300 px-3 py-1 rounded-lg shadow-sm z-10 pointer-events-none">
                New Arrival
              </span>
            ) : null}

            {/* Top Right Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-colors z-10 ${
                wishlisted
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-white/95 text-slate-400 hover:text-red-600 hover:bg-white border border-slate-200 shadow-sm'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current text-white' : ''}`} />
            </button>

            {/* Left & Right Slider Arrows */}
            {allImages.length >= 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-[#ba0202] text-slate-900 hover:text-white border border-slate-200 hover:border-[#ba0202] shadow-md flex items-center justify-center transition-all z-10 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-[#ba0202] text-slate-900 hover:text-white border border-slate-200 hover:border-[#ba0202] shadow-md flex items-center justify-center transition-all z-10 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Bottom Dot Indicators when multiple images exist */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 z-10">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIdx(idx);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`h-2 rounded-full transition-all ${
                      safeSlideIdx === idx
                        ? 'w-7 bg-[#ba0202]'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Interactive Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 p-1.5 flex items-center justify-center shrink-0 transition-all ${
                    safeSlideIdx === idx
                      ? 'border-red-600 shadow-md shadow-red-600/20 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                  aria-label={`Switch to image ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="max-h-full max-w-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchase & Variant Selection */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-2">
              <span>{product.brand} · {product.categoryName}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-slate-900 tracking-tight font-heading uppercase leading-[1.0] break-words">
              {product.name}
            </h1>

            {product.headline && (
              <p className="text-sm sm:text-base md:text-lg font-bold text-red-600 mt-3">
                {product.headline}
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {/* Compact Pricing Row */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inclusive of All Taxes</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                  PKR {price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    PKR {product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {hasDiscount && (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-sm">
                Save PKR {savings.toLocaleString()}
              </span>
            )}
          </div>

          {/* Specs / Meta Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
              Weight: <strong className="text-slate-900 font-bold">{product.weight}</strong>
            </span>
            {product.servings && (
              <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
                Servings: <strong className="text-slate-900 font-bold">{product.servings}</strong>
              </span>
            )}
            {product.ratio && (
              <span className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 shadow-sm">
                Clinical Ratio: {product.ratio}
              </span>
            )}
            {product.servingSize && (
              <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
                Scoop: <strong className="text-slate-900 font-bold">{product.servingSize}</strong>
              </span>
            )}
          </div>

          {/* Flavor Variants */}
          {product.flavors && product.flavors.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                <span>Select Flavor</span>
                <span className="text-red-600 font-bold normal-case text-xs">
                  {currentFlavor}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map((flv) => (
                  <button
                    key={flv}
                    type="button"
                    onClick={() => setSelectedFlavor(flv)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                      currentFlavor === flv
                        ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-red-300 hover:text-red-600'
                    }`}
                  >
                    {flv}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stepper & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-3 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 text-sm font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3.5 py-3 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-3.5 px-6 bg-red-50 hover:bg-red-100 border border-red-200 text-red-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-red-600" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Direct 1-Click Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Buy Now · Direct Bank / Online Payment</span>
            </button>
          </div>

          {/* Direct WhatsApp Consultation */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-sm gap-2">
            <div className="flex items-center gap-2 text-slate-600">
              <MessageCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Questions regarding dosing or stacks?</span>
            </div>
            <a
              href={`https://wa.me/923252571589?text=${encodeURIComponent(
                `Hello Nautilus Protein, I would like to order/inquire about ${product.name} (${currentFlavor}) priced at PKR ${price.toLocaleString()}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-wider text-[11px] shrink-0"
            >
              Chat on WhatsApp (0325 2571589) →
            </a>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-red-600 mx-auto mb-1" />
              <p className="font-bold text-slate-900 text-[11px]">100% Genuine</p>
              <p className="text-[10px] text-slate-500">Tamper-evident seal</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Truck className="w-4 h-4 text-red-600 mx-auto mb-1" />
              <p className="font-bold text-slate-900 text-[11px]">Fast Dispatch</p>
              <p className="text-[10px] text-slate-500">Verified Courier</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <RefreshCw className="w-4 h-4 text-red-600 mx-auto mb-1" />
              <p className="font-bold text-slate-900 text-[11px]">Secure Transfer</p>
              <p className="text-[10px] text-slate-500">Bank & Digital Pay</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Structured Product Details (72px Headings on Desktop) */}
      <div className="space-y-8">
        
        {/* Section A: Formula Highlights & Who Is It For */}
        {((product.highlights && product.highlights.length > 0) || (product.whoIsItFor && product.whoIsItFor.length > 0)) && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600">Clinical Formulation</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-slate-900 uppercase font-heading tracking-tight mt-1 leading-[1.0]">
                Why Choose This Formula
              </h2>
            </div>

            {product.highlights && product.highlights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.highlights.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-red-50/50 border border-red-200/70 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      <Check className="w-5 h-5" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {product.whoIsItFor && product.whoIsItFor.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Recommended For Athletes Who:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {product.whoIsItFor.map((target, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">{target}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section B: Official Nutrition Facts Table */}
        {product.nutritionFacts && product.nutritionFacts.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600">Transparent Labeling</p>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-slate-900 uppercase font-heading tracking-tight mt-1 leading-[1.0]">
                  Supplement Facts
                </h2>
              </div>
              <div className="text-xs sm:text-sm font-mono text-slate-600 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl self-start sm:self-auto font-medium">
                Serving: <strong className="text-slate-900 font-bold">{product.servingSize || '10g'}</strong> · {product.servings} Servings/Container
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <tr>
                    <th className="py-3.5 px-6 font-bold">Nutrient / Active Compound</th>
                    <th className="py-3.5 px-6 font-bold">Amount Per Serving</th>
                    <th className="py-3.5 px-6 font-bold text-right">% Daily Value*</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.nutritionFacts.map((fact, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-slate-900">{fact.label}</td>
                      <td className="py-3.5 px-6 font-mono text-slate-700">{fact.amount}</td>
                      <td className="py-3.5 px-6 font-mono text-right text-red-600 font-bold">
                        {fact.dailyValue || '†'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 text-xs text-slate-500 border-t border-slate-200">
              * Percent Daily Values are based on a 2,000 calorie diet. † Daily Value not established. Zero banned substances.
            </div>
          </div>
        )}

        {/* Section C: How to Use & Directions */}
        {product.directions && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600">Protocol & Timing</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-slate-900 uppercase font-heading tracking-tight mt-1 leading-[1.0]">
                How To Use
              </h2>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl bg-red-50/40 border border-red-200/60">
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                {product.directions}
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-500 pt-1">
              <Zap className="w-4 h-4 text-red-600 shrink-0" />
              <span>For best results, mix with chilled water in a Nautilus Shaker Cup for 20-30 seconds.</span>
            </div>
          </div>
        )}

        {/* Section D: Ingredients & Storage Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase font-heading tracking-tight leading-tight">
              Ingredients Matrix
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.ingredients?.join(', ') || 'Pure pharmaceutical grade supplement formula with natural and artificial flavors.'}
            </p>
            <p className="text-xs sm:text-sm text-red-600 font-semibold pt-2">
              ✓ Zero Sugar · Zero Fat · Halal Certified Purity
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 uppercase font-heading tracking-tight leading-tight">
              Warnings & Storage
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.warnings || 'Store in a cool, dry place away from direct sunlight. Keep out of reach of children. Consult your physician prior to use if you have any medical condition.'}
            </p>
          </div>
        </div>

        {/* Section E: Interactive Frequently Asked Questions (Accordion) */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-600">Product FAQs</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-slate-900 uppercase font-heading tracking-tight mt-1 leading-[1.0]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3.5">
              {product.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-base sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                        <HelpCircle className="w-5 h-5 text-red-600 shrink-0" />
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-red-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-5 sm:p-6 pt-2 text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed bg-white border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 3. Frequently Stacked Together */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-600">Complete The Stack</p>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-slate-900 uppercase font-heading tracking-tight mt-1 leading-[1.0]">
                Frequently Stacked Together
              </h3>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-slate-500 hover:text-red-600 uppercase tracking-wider shrink-0"
            >
              View More →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
