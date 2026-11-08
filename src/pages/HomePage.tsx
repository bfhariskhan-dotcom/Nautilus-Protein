import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck, Zap, Award, Truck, Star, CheckCircle, Mail, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { products, categories, brands, navigateTo, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  // 1. Hero Slider State & Touch Gestures (Arrows removed per user request)
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // 2. Promo Banner Slider State
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isPromoPaused, setIsPromoPaused] = useState(false);
  const promoTouchStartX = useRef<number | null>(null);
  const promoTouchEndX = useRef<number | null>(null);

  // 3. Testimonials Interactive Slider State & Drag
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const [isDraggingReview, setIsDraggingReview] = useState(false);
  const reviewDragStartX = useRef<number | null>(null);
  const reviewTouchStartX = useRef<number | null>(null);

  // 3 High-Impact Clean Hero Slides with Reduced Content & Premium Imagery
  const heroSlides = [
    {
      id: 'slide-1',
      eyebrow: 'Nautilus Sports Nutrition · Pakistan',
      headline: 'Fuel Your',
      headlineAccent: 'Potential.',
      subtitle: 'Pure bioactive protein & clinical supplements engineered for peak athletic performance. Rapid nationwide delivery across Pakistan.',
      primaryBtn: 'Shop Supplements',
      primaryAction: () => navigateTo('shop'),
      secondaryBtn: 'Explore Whey',
      secondaryAction: () => navigateTo('category', { category: 'whey-protein' }),
      image: '/images/hero_athlete_training_1792514848740.jpg',
      badge: '100% Authentic Nutrition'
    },
    {
      id: 'slide-2',
      eyebrow: 'Zero Fat · Zero Sugar · Ultra Filtered',
      headline: 'Hydrolyzed',
      headlineAccent: 'Whey Isolate.',
      subtitle: '25g rapid-absorbing bioactive protein per scoop. Clean mixability, zero bloating, and unmatched recovery for serious lifters.',
      primaryBtn: 'Get Whey Isolate',
      primaryAction: () => navigateTo('product', { slug: 'nautilus-hydrolyzed-whey-isolate-5lbs' }),
      secondaryBtn: 'View Nutrition',
      secondaryAction: () => navigateTo('category', { category: 'whey-protein' }),
      image: '/images/product_nautilus_isolate_1792514848952.jpg',
      badge: '25g Bioactive Purity'
    },
    {
      id: 'slide-3',
      eyebrow: 'Clinical Nitric Oxide & Focus Catalyst',
      headline: 'Volt Xtreme',
      headlineAccent: 'Pre-Workout.',
      subtitle: '6000mg pure Citrulline Malate, 3200mg CarnoSyn Beta-Alanine, and clean sustained energy without crash.',
      primaryBtn: 'Claim Pre-Workout',
      primaryAction: () => navigateTo('product', { slug: 'nautilus-volt-xtreme-pre-workout' }),
      secondaryBtn: 'All Pre-Workouts',
      secondaryAction: () => navigateTo('category', { category: 'pre-workout' }),
      image: '/images/product_nautilus_preworkout_1792514849391.jpg',
      badge: '6000mg Citrulline'
    }
  ];

  const promoSlides = [
    {
      tag: 'Exclusive Stack Savings',
      headline: 'Power Up Your Routine. Save Up To 20%.',
      description: 'Combine Nautilus Fast Protein with Micronized Creatine and Volt Pre-Workout. Use coupon POWER500 for an instant PKR 500 discount on orders above PKR 5,000.',
      code: 'POWER500',
      cta: 'Claim Stack Offer',
      action: () => navigateTo('shop')
    },
    {
      tag: 'Express Nationwide Fulfillment',
      headline: 'Fast Tracked Courier Dispatch Across Pakistan',
      description: 'Dispatched with verified courier tracking to Karachi, Lahore, Islamabad, Faisalabad, and all cities across Pakistan. Climate-controlled storage preserves delicate bioactive peptides.',
      code: 'FREE-SHIPPING',
      cta: 'Shop Now & Get Free Delivery',
      action: () => navigateTo('shop')
    },
    {
      tag: 'Verified Batch Transparency',
      headline: '100% Genuine Seals & Tamper-Evident Packaging',
      description: 'Every tub features intact induction seals and verified batch tracking. Zero amino spiking, zero cheap fillers. Transparent labeling for serious athletes.',
      code: 'NAUTILUS10',
      cta: 'Explore Authentic Supplements',
      action: () => navigateTo('shop')
    }
  ];

  // Verified Athlete Reviews Across Pakistan (12 Comprehensive Testimonials)
  const testimonials = [
    {
      id: 1,
      quote: "Nautilus BCAA Lemon is a game changer! Tastes like real fresh lemons with zero bitter aftertaste. Muscle soreness after leg day is cut in half, and it keeps me fully hydrated through intense workouts.",
      author: "Farhan Zafar",
      city: "Karachi",
      badge: "Verified Buyer",
      product: "Nautilus BCAA - Tangy Lemon (450g)",
      rating: 5
    },
    {
      id: 2,
      quote: "Best tasting chocolate whey available in Pakistan. Mixes completely without lumps and the macros are clean. Absolutely authentic packaging with tamper seal intact.",
      author: "Zain Malik",
      city: "Lahore",
      badge: "Verified Buyer",
      product: "Nautilus Fast Hydrolyzed Isolate",
      rating: 5
    },
    {
      id: 3,
      quote: "Gained 3.8 kg of solid lean mass in 5 weeks. Unlike generic mass gainers full of cheap maltodextrin sugar spikes, this didn't cause any digestive distress or bloating. Clean complex carbs and high-grade protein.",
      author: "Dr. Shahmeer Khan",
      city: "Islamabad",
      badge: "Verified Athlete",
      product: "Elite Mass Gainer (5 Lbs)",
      rating: 5
    },
    {
      id: 4,
      quote: "Volt Xtreme pre-workout gives an unreal pump with zero crash. The 6000mg Citrulline dosage is genuine and you feel the vascularity and razor focus within 15 minutes of drinking.",
      author: "Hamza Tariq",
      city: "Faisalabad",
      badge: "Competitive Bodybuilder",
      product: "Volt Xtreme Pre-Workout",
      rating: 5
    },
    {
      id: 5,
      quote: "Delivered to Rawalpindi in 48 hours via express courier. Tamper seal was 100% tight and authentic. The micronized creatine dissolves smoothly without any sandy residue.",
      author: "Bilal Ahmed",
      city: "Rawalpindi",
      badge: "Verified Buyer",
      product: "Micronized Creatine 300g",
      rating: 5
    },
    {
      id: 6,
      quote: "Best sports nutrition service in Pakistan. Transparent macros, immediate WhatsApp tracking support, and real high-grade formulas. 10/10 recommended for every serious lifter.",
      author: "Usman Afridi",
      city: "Peshawar",
      badge: "Fitness Coach",
      product: "Nautilus Performance Stack",
      rating: 5
    },
    {
      id: 7,
      quote: "The 2:1:1 ratio in Nautilus BCAA is pure gold. My recovery during fasting and cutting has never been this smooth. I have zero muscle loss and energy stays constant throughout the gym session.",
      author: "Daniyal Qureshi",
      city: "Multan",
      badge: "Fitness Influencer",
      product: "Nautilus BCAA - Tangy Lemon (450g)",
      rating: 5
    },
    {
      id: 8,
      quote: "I’ve tried imported brands from GNC and MyProtein for years, and Nautilus matches the highest international purity standards. Lab tested, zero banned substances, and very reasonable pricing.",
      author: "Saad Sheikh",
      city: "Sialkot",
      badge: "Powerlifter",
      product: "Nautilus 100% Whey Protein",
      rating: 5
    },
    {
      id: 9,
      quote: "Quick delivery to Gujranwala with COD payment option. Packaging was sturdy and induction seal was completely untouched. Authentic supplement stores are rare in Pakistan, Nautilus is truly reliable.",
      author: "Raza Ali",
      city: "Gujranwala",
      badge: "Verified Buyer",
      product: "Nautilus Fast Whey",
      rating: 5
    },
    {
      id: 10,
      quote: "Having 45 full servings in one 450g tub makes Nautilus BCAA the absolute best value for money in Pakistan. Delicious tangy lemon taste with ice cold water!",
      author: "Taimoor Baig",
      city: "Hyderabad",
      badge: "Crossfit Athlete",
      product: "Nautilus BCAA - Tangy Lemon (450g)",
      rating: 5
    },
    {
      id: 11,
      quote: "Super impressed with the customer service desk on WhatsApp. They assisted with stack advice according to my daily caloric goals. Products arrived within 2 days in pristine condition.",
      author: "Waqas Mehmood",
      city: "Quetta",
      badge: "Verified Buyer",
      product: "Creatine Monohydrate 300g",
      rating: 5
    },
    {
      id: 12,
      quote: "Cleanest profile with zero sugar and zero filler. The electrolyte blend inside the BCAA prevents muscle cramps even during heavy 2-hour workout days. Highly satisfied!",
      author: "Kamran Akram",
      city: "Karachi",
      badge: "Marathon Runner",
      product: "Nautilus BCAA - Tangy Lemon (450g)",
      rating: 5
    }
  ];

  // Auto-slide Hero Carousel (Arrows removed, smooth timer)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  // Auto-slide Promo Carousel
  useEffect(() => {
    if (isPromoPaused) return;
    const promoInterval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoSlides.length);
    }, 6000);
    return () => clearInterval(promoInterval);
  }, [isPromoPaused, promoSlides.length]);

  // Auto-slide Testimonials Carousel
  useEffect(() => {
    if (isTestimonialPaused) return;
    const testInterval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testInterval);
  }, [isTestimonialPaused, testimonials.length]);

  // Touch Swipe for Hero Banner
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    } else if (distance < -50) {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Touch Swipe for Promo Banner
  const handlePromoTouchStart = (e: React.TouchEvent) => {
    promoTouchStartX.current = e.touches[0].clientX;
  };
  const handlePromoTouchMove = (e: React.TouchEvent) => {
    promoTouchEndX.current = e.touches[0].clientX;
  };
  const handlePromoTouchEnd = () => {
    if (!promoTouchStartX.current || !promoTouchEndX.current) return;
    const distance = promoTouchStartX.current - promoTouchEndX.current;
    if (distance > 50) {
      setCurrentPromo((prev) => (prev + 1) % promoSlides.length);
    } else if (distance < -50) {
      setCurrentPromo((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
    }
    promoTouchStartX.current = null;
    promoTouchEndX.current = null;
  };

  // Cursor Drag / Touch Gestures for Testimonials Carousel
  const handleReviewMouseDown = (e: React.MouseEvent) => {
    setIsDraggingReview(true);
    reviewDragStartX.current = e.clientX;
  };
  const handleReviewMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingReview || reviewDragStartX.current === null) return;
    const diff = reviewDragStartX.current - e.clientX;
    if (diff > 40) {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    } else if (diff < -40) {
      setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
    setIsDraggingReview(false);
    reviewDragStartX.current = null;
  };
  const handleReviewTouchStart = (e: React.TouchEvent) => {
    reviewTouchStartX.current = e.touches[0].clientX;
  };
  const handleReviewTouchEnd = (e: React.TouchEvent) => {
    if (reviewTouchStartX.current === null) return;
    const diff = reviewTouchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    } else if (diff < -40) {
      setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
    reviewTouchStartX.current = null;
  };

  const bestSellers = products.filter(p => p.isBestSeller || p.isFeatured).slice(0, 6);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribing(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Subscribed successfully!');
        setNewsletterEmail('');
      } else {
        showToast(data.error || 'Failed to subscribe', 'error');
      }
    } catch {
      showToast('Network error while subscribing.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const goals = [
    {
      id: 'muscle-building',
      title: 'Muscle Building',
      tagline: 'High-protein whey isolates & clean caloric mass gainers.',
      icon: Zap,
      action: () => navigateTo('shop', { category: 'whey-protein' })
    },
    {
      id: 'strength',
      title: 'Strength & Performance',
      tagline: 'Micronized creatine & clinical high-stim pre-workouts.',
      icon: Award,
      action: () => navigateTo('shop', { category: 'creatine' })
    },
    {
      id: 'recovery',
      title: 'Deep Recovery',
      tagline: 'Fermented BCAAs, EAAs, and cellular electrolyte hydration.',
      icon: ShieldCheck,
      action: () => navigateTo('shop', { category: 'amino-acids' })
    },
    {
      id: 'vitality',
      title: 'Everyday Vitality',
      tagline: 'Omega-3 EPA/DHA, CoQ10 bioenergetics, and athlete health.',
      icon: CheckCircle,
      action: () => navigateTo('shop', { category: 'creatine' })
    }
  ];

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 overflow-hidden">
      
      {/* 1. SLIDING HERO BANNER (CLEAN & PUNCHY, ZERO AI ICONS, SINGLE MOBILE BUTTON, RICH CONTRAST OVERLAY) */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative min-h-[460px] sm:min-h-[560px] lg:min-h-[620px] flex items-center bg-black overflow-hidden select-none"
      >
        {/* Horizontal Sliding Track */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translate3d(-${currentSlide * 100}%, 0, 0)` }}
        >
          {heroSlides.map((slide) => (
            <div
              key={slide.id}
              className="min-w-full w-full h-full relative shrink-0 flex items-center py-12 sm:py-16"
              style={{ minHeight: 'inherit' }}
            >
              {/* Background Media with Darker Rich Contrast Overlay */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.headline}
                  className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-110 scale-105"
                  loading="eager"
                />
                {/* Rich gradients for high-contrast crisp typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
                {/* Purple radial ambient accent */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-900/25 blur-3xl rounded-full pointer-events-none" />
              </div>

              {/* Foreground Banner Content (Streamlined & Clean) */}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                <div className="max-w-2xl space-y-4 sm:space-y-6">
                  
                  {/* Clean Hero Headline */}
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white font-heading leading-[0.95] drop-shadow-lg">
                    {slide.headline}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-violet-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                      {slide.headlineAccent}
                    </span>
                  </h1>

                  {/* Concise Punchy Subtitle */}
                  <p className="text-sm sm:text-base text-neutral-200 max-w-xl leading-relaxed drop-shadow-md">
                    {slide.subtitle}
                  </p>

                  {/* Call to Actions - Single button on mobile, dual on desktop */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      onClick={slide.primaryAction}
                      className="w-full sm:w-auto px-7 sm:px-8 py-3.5 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-xl shadow-purple-950/70 hover:shadow-purple-700/50 hover:scale-[1.02] flex items-center justify-center gap-2 group active:scale-95"
                    >
                      <span>{slide.primaryBtn}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={slide.secondaryAction}
                      className="hidden sm:inline-flex px-6 sm:px-7 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase border border-neutral-700 hover:border-purple-500 transition-colors items-center justify-center"
                    >
                      {slide.secondaryBtn}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators / Dots */}
        <div className="absolute z-20 bottom-4 sm:bottom-6 inset-x-0 flex items-center justify-center gap-2 sm:gap-3 pointer-events-auto">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                currentSlide === i
                  ? 'w-8 sm:w-10 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.9)]'
                  : 'w-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Marquee Trust Ticker Strip Under Hero */}
      <div className="bg-purple-950 text-purple-200 border-y border-purple-900/50 py-3 overflow-hidden select-none shadow-sm">
        <div className="nautilus-marquee-track flex items-center gap-8 whitespace-nowrap text-xs font-semibold tracking-wider uppercase">
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400 shrink-0" /> 100% Authentic Seals & Tamper-Evident Packaging</span>
          <span className="text-purple-600">·</span>
          <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-purple-400 shrink-0" /> Fast Nationwide Delivery Across All Pakistan Cities</span>
          <span className="text-purple-600">·</span>
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" /> Cash on Delivery (COD) Available</span>
          <span className="text-purple-600">·</span>
          <span className="flex items-center gap-2"><Award className="w-4 h-4 text-purple-400 shrink-0" /> 100% Original Clinical Sports Nutrition</span>
          <span className="text-purple-600">·</span>
          <span className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-purple-400 shrink-0" /> Dedicated WhatsApp Athlete Support (+92 325 2571589)</span>
          <span className="text-purple-600">·</span>
          {/* Loop duplicates for seamless continuous loop */}
          <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-purple-400 shrink-0" /> 100% Authentic Seals & Tamper-Evident Packaging</span>
          <span className="text-purple-600">·</span>
          <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-purple-400 shrink-0" /> Fast Nationwide Delivery Across All Pakistan Cities</span>
          <span className="text-purple-600">·</span>
          <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" /> Cash on Delivery (COD) Available</span>
        </div>
      </div>

      {/* 2. CATEGORY QUICK ACCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Targeted Supplement Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-slate-500 hover:text-purple-700 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateTo('category', { category: cat.slug })}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 shadow-sm hover:shadow-md cursor-pointer text-center transition-all duration-200 group hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/30 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-110 group-hover:bg-purple-100 group-hover:border-purple-400 transition-all">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors uppercase tracking-wider">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                {products.filter(p => p.category === cat.slug).length || cat.itemCount || 0} Products
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 mb-2">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>Pakistan Athlete Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-slate-500 hover:text-purple-700 uppercase tracking-wider flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {bestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. SLIDING PROMOTIONAL BANNER */}
      <section
        onMouseEnter={() => setIsPromoPaused(true)}
        onMouseLeave={() => setIsPromoPaused(false)}
        onTouchStart={handlePromoTouchStart}
        onTouchMove={handlePromoTouchMove}
        onTouchEnd={handlePromoTouchEnd}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
      >
        <div className="relative rounded-3xl overflow-hidden border border-purple-900/50 bg-gradient-to-r from-[#0d0a17] via-neutral-950 to-[#120a21]">
          {/* Track */}
          <div
            className="flex transition-transform duration-700 ease-out will-change-transform"
            style={{ transform: `translate3d(-${currentPromo * 100}%, 0, 0)` }}
          >
            {promoSlides.map((p, idx) => (
              <div
                key={idx}
                className="min-w-full w-full shrink-0 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8"
              >
                <div className="space-y-4 max-w-xl text-center md:text-left">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800">
                    <span>{p.tag}</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-heading leading-tight">
                    {p.headline}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <button
                      onClick={p.action}
                      className="px-6 py-3.5 bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950/60 hover:scale-[1.02] flex items-center gap-2 group"
                    >
                      <span>{p.cta}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col items-center justify-center p-8 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-center shrink-0 w-72">
                  <Truck className="w-10 h-10 text-purple-600 mb-3" />
                  <p className="text-white font-heading uppercase font-bold text-lg">Nationwide Shipping</p>
                  <p className="text-xs text-slate-500 mt-1">Free delivery across Pakistan on orders over PKR 5,000</p>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Slider Dots & Controls */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-10">
            {promoSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPromo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPromo === i ? 'w-6 bg-purple-500' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to promo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. SHOP BY GOAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Targeted Performance
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading mt-1">
            Shop by Goal
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Select your primary fitness objective to view precision supplement protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {goals.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                onClick={g.action}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/30"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 group-hover:border-purple-400 transition-colors mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {g.tagline}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-600">
                  <span>Explore Products</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Fresh Production Batches
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading mt-1">
                New Arrivals
              </h2>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-slate-500 hover:text-purple-700 uppercase tracking-wider flex items-center gap-1.5 transition-colors self-start md:self-auto"
            >
              <span>View Collection</span>
              <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE NAUTILUS PROTEIN (NATIONWIDE PAKISTAN DISPATCH) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
              The Nautilus Standard
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading mt-1">
              Why Athletes Trust Nautilus
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Sports nutrition in Pakistan is frequently clouded by counterfeit packaging and unverified fillers. We established Nautilus with three non-negotiable promises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Genuine Tamper-Evident Seals</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every container features direct security neckband heat-seals and inner induction foil liners so you know your supplement hasn&apos;t been tampered with.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Fast Nationwide Dispatch</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rapid express courier shipping across Karachi, Lahore, Islamabad, Faisalabad, Multan, Peshawar, Quetta, and every destination across Pakistan with live tracking.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Dedicated WhatsApp Athlete Desk</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Reach human support instantly at +92 325 2571589 for dosing advice, flavor reviews, stack recommendations, and real-time shipment updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BRAND SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Curated Roster</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
              Available Brands
            </h2>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-slate-500 hover:text-purple-700 uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-purple-600" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth">
          {brands.concat(brands).map((b, idx) => (
            <div
              key={`${b.id}-${idx}`}
              onClick={() => navigateTo('shop', { brand: b.name })}
              className="min-w-[180px] sm:min-w-[210px] p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 shadow-sm cursor-pointer text-center transition-all group hover:-translate-y-1 hover:shadow-md shrink-0 flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 font-extrabold text-xs mb-3 group-hover:scale-110 group-hover:bg-purple-100 transition-all">
                {b.name.substring(0, 2).toUpperCase()}
              </div>
              <p className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors uppercase tracking-wider">
                {b.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{b.country} · Authentic Partner</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. VERIFIED CUSTOMER REVIEWS - INTERACTIVE DRAGGABLE SLIDING CAROUSEL (WITH CURSOR SLIDE / TOUCH SWIPE) */}
      <section
        onMouseEnter={() => setIsTestimonialPaused(true)}
        onMouseLeave={() => {
          setIsTestimonialPaused(false);
          setIsDraggingReview(false);
        }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 select-none"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 mb-2">
              <Star className="w-3.5 h-3.5 fill-current text-purple-600" />
              <span>Real Athlete Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
              Verified Customer Reviews
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Feedback from lifters, athletes, and coaches across Pakistan. Slide or drag with cursor to view.
            </p>
          </div>

          {/* Slider Prev / Next Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="p-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 shadow-sm transition-all hover:scale-105 active:scale-95"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
              className="p-2.5 rounded-xl bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-300 shadow-sm transition-all hover:scale-105 active:scale-95"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Draggable Sliding Carousel Viewport */}
        <div
          onMouseDown={handleReviewMouseDown}
          onMouseUp={handleReviewMouseUp}
          onTouchStart={handleReviewTouchStart}
          onTouchEnd={handleReviewTouchEnd}
          className={`overflow-hidden relative py-2 ${
            isDraggingReview ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          title="Drag horizontally with cursor to slide reviews"
        >
          {/* Sliding Cards Track */}
          <div
            className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6 will-change-transform"
            style={{
              transform: `translate3d(calc(-${testimonialIndex * 100}% - ${testimonialIndex * 16}px), 0, 0)`
            }}
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 shadow-sm transition-all duration-300 flex flex-col justify-between hover:shadow-md relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-purple-600">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current text-purple-600" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-mono">
                      {t.city}
                    </span>
                  </div>

                  <p className="text-xs text-purple-600 font-semibold font-mono mb-2">
                    {t.product}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-slate-900 font-bold">{t.author}</p>
                    <p className="text-purple-600 text-[11px]">{t.badge}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Verified Order</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Indicators / Interactive Dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setTestimonialIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                testimonialIndex === i ? 'w-8 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 10. NEWSLETTER SUBSCRIPTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-purple-50 via-white to-slate-50 border border-purple-200 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading">
            Join the Nautilus Athlete Circle
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
            Subscribe for exclusive restock alerts, flash stack savings, and verified nutrition protocols. Zero spam, unsubscribe at any time.
          </p>

          <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              required
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-lg shadow-purple-950/50"
            >
              {isSubscribing ? 'Saving...' : 'Subscribe'}
            </button>
          </form>
          <p className="text-[11px] text-slate-400 mt-3">
            By subscribing, you agree to our Privacy Policy. Data stored securely on our servers.
          </p>
        </div>
      </section>

    </div>
  );
};
