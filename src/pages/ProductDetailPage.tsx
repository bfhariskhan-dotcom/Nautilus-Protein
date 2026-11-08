import React, { useState, useEffect } from 'react';
import {
  Star,
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
  Award,
  Zap
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
    isInWishlist,
    showToast
  } = useStore();

  const product = products.find(p => p.slug === selectedProductSlug) || products[0];

  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product?.flavors?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');
  
  // Accordion open states for clean vertical layout
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Review submission state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHeadline, setReviewHeadline] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      if (product.flavors && product.flavors.length > 0) {
        setSelectedFlavor(product.flavors[0]);
      }
    }
  }, [product?.id, product?.image]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-slate-900 font-bold">Product not found.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition-colors"
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

  // Consolidate all images (primary + gallery)
  const allImages = Array.from(new Set([product.image, ...(product.gallery || [])])).filter(Boolean);

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      showToast('Name and comment are required.', 'error');
      return;
    }
    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewName,
          rating: reviewRating,
          headline: reviewHeadline,
          comment: reviewComment
        })
      });
      if (res.ok) {
        showToast('Thank you! Your verified review has been submitted.');
        setIsReviewModalOpen(false);
        setReviewName('');
        setReviewHeadline('');
        setReviewComment('');
      } else {
        showToast('Failed to submit review.', 'error');
      }
    } catch {
      showToast('Network error submitting review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      
      {/* 1. Main Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
        
        {/* Left: Sticky Media Gallery with Thumbnail Selector */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <div className="aspect-square bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 flex items-center justify-center relative overflow-hidden shadow-lg shadow-purple-950/5">
            <img
              src={activeImage || product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-all duration-300"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/nautilus-logo.jpg';
              }}
            />
            
            {product.isBestSeller ? (
              <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 border border-purple-200 px-3 py-1 rounded-lg shadow-sm">
                Best Seller
              </span>
            ) : product.isNew ? (
              <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-lg shadow-sm">
                New Arrival
              </span>
            ) : null}

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-colors ${
                wishlisted
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/95 text-slate-400 hover:text-purple-600 hover:bg-white border border-slate-200 shadow-sm'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Interactive Thumbnail Strip */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 p-1.5 flex items-center justify-center shrink-0 transition-all ${
                    (activeImage || product.image) === imgUrl
                      ? 'border-purple-600 shadow-md shadow-purple-600/20 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                  }`}
                  aria-label={`Switch to image ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Purchase & Variant Selection */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1.5">
              <span>{product.brand} · {product.categoryName}</span>
              <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/80">
                <Star className="w-3.5 h-3.5 fill-current text-purple-600" />
                <span className="text-slate-900 font-extrabold tabular-nums">{product.rating}</span>
                <span className="text-slate-500 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-heading uppercase leading-tight">
              {product.name}
            </h1>

            {product.headline && (
              <p className="text-xs sm:text-sm font-semibold text-purple-700 mt-2">
                {product.headline}
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Row */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inclusive of All Taxes</p>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
                  PKR {price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-slate-400 line-through tabular-nums">
                    PKR {product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {hasDiscount && (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-purple-600 text-white shadow-sm">
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
              <span className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-800 shadow-sm">
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
                <span className="text-purple-600 font-bold normal-case text-xs">
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
                        ? 'border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-purple-300 hover:text-purple-700'
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
                className="flex-1 py-3.5 px-6 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-purple-700" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Direct 1-Click Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Buy Now with Cash on Delivery</span>
            </button>
          </div>

          {/* Direct WhatsApp Consultation */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <MessageCircle className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Questions regarding dosing or stacks?</span>
            </div>
            <a
              href={`https://wa.me/923252571589?text=${encodeURIComponent(
                `Hello Nautilus Protein, I would like to order/inquire about ${product.name} (${currentFlavor}) priced at PKR ${price.toLocaleString()}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-purple-600 hover:text-purple-700 transition-colors uppercase tracking-wider text-[11px]"
            >
              Chat on WhatsApp →
            </a>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-3 text-center text-xs text-slate-500">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <p className="font-bold text-slate-900 text-[11px]">100% Genuine</p>
              <p className="text-[10px] text-slate-500">Tamper-evident seal</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Truck className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <p className="font-bold text-slate-900 text-[11px]">Fast Dispatch</p>
              <p className="text-[10px] text-slate-500">Karachi Warehouse</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <RefreshCw className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <p className="font-bold text-slate-900 text-[11px]">COD Delivery</p>
              <p className="text-[10px] text-slate-500">All Pakistan Cities</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Structured Product Details (Clean Vertical Presentation, Zero Horizontal Tab Scroll) */}
      <div className="space-y-8">
        
        {/* Section A: Formula Highlights & Who Is It For */}
        {( (product.highlights && product.highlights.length > 0) || (product.whoIsItFor && product.whoIsItFor.length > 0) ) && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Clinical Formulation</p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase font-heading mt-1">
                Why Choose This Formula
              </h2>
            </div>

            {product.highlights && product.highlights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.highlights.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/70 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {product.whoIsItFor && product.whoIsItFor.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Recommended For Athletes Who:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {product.whoIsItFor.map((target, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-purple-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{target}</span>
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
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Transparent Labeling</p>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase font-heading mt-1">
                  Supplement Facts
                </h2>
              </div>
              <div className="text-xs font-mono text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Serving: <strong className="text-slate-900">{product.servingSize || '10g'}</strong> · {product.servings} Servings/Container
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-slate-200 text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <tr>
                    <th className="py-3 px-6 font-bold">Nutrient / Active Compound</th>
                    <th className="py-3 px-6 font-bold">Amount Per Serving</th>
                    <th className="py-3 px-6 font-bold text-right">% Daily Value*</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {product.nutritionFacts.map((fact, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-6 font-semibold text-slate-900">{fact.label}</td>
                      <td className="py-3 px-6 font-mono text-slate-700">{fact.amount}</td>
                      <td className="py-3 px-6 font-mono text-right text-purple-600 font-bold">
                        {fact.dailyValue || '†'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 text-[11px] text-slate-500 border-t border-slate-200">
              * Percent Daily Values are based on a 2,000 calorie diet. † Daily Value not established. Zero banned substances.
            </div>
          </div>
        )}

        {/* Section C: How to Use & Directions */}
        {product.directions && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Protocol & Timing</p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase font-heading mt-1">
                How To Use
              </h2>
            </div>
            <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-200/60">
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                {product.directions}
              </p>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-500 pt-1">
              <Zap className="w-4 h-4 text-purple-600 shrink-0" />
              <span>For best results, mix with chilled water in a Nautilus Shaker Cup for 20-30 seconds.</span>
            </div>
          </div>
        )}

        {/* Section D: Ingredients & Storage Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 uppercase font-heading">
              Ingredients Matrix
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.ingredients?.join(', ') || 'Pure pharmaceutical grade supplement formula with natural and artificial flavors.'}
            </p>
            <p className="text-[11px] text-purple-700 font-semibold pt-2">
              ✓ Zero Sugar · Zero Fat · Halal Certified Purity
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 uppercase font-heading">
              Warnings & Storage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {product.warnings || 'Store in a cool, dry place away from direct sunlight. Keep out of reach of children. Consult your physician prior to use if you have any medical condition.'}
            </p>
          </div>
        </div>

        {/* Section E: Interactive Frequently Asked Questions (Accordion) */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Product FAQs</p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase font-heading mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {product.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-purple-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
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

      {/* 3. Verified Customer Reviews */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase font-heading">
              Customer Reviews ({product.reviewCount})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Real feedback from verified purchasers in Pakistan.
            </p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-2.5 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-800 hover:text-purple-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
          >
            Write a Review
          </button>
        </div>

        {/* Modal for submitting review */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 text-base">Write a Verified Review</h4>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-slate-500 hover:text-slate-900 text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Asad Khan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5) - Outstanding Quality</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5) - Very Good</option>
                    <option value={3}>⭐⭐⭐ (3/5) - Average</option>
                    <option value={2}>⭐⭐ (2/5) - Below Expectation</option>
                    <option value={1}>⭐ (1/5) - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Review Headline</label>
                  <input
                    type="text"
                    value={reviewHeadline}
                    onChange={(e) => setReviewHeadline(e.target.value)}
                    placeholder="e.g. Clean mixability and authentic seal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Your Detailed Experience</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe flavor, energy response, mixability, and packaging..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold uppercase tracking-wider shadow-md shadow-purple-600/20 transition-colors"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 4. Frequently Stacked Together */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Complete The Stack</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase font-heading mt-1">
                Frequently Stacked Together
              </h3>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-slate-500 hover:text-purple-700 uppercase tracking-wider"
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
