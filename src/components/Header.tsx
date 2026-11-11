import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, ShieldCheck, Flame, Zap, Truck, Phone, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    activePage,
    categories,
    products,
    navigateTo,
    setIsSearchOpen,
    setIsCartOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Strictly filter out any categories that have 0 products attached
  const activeCategories = (categories && categories.length > 0 ? categories : [
    { slug: 'amino-acids', name: 'BCAA & Amino Acids' },
    { slug: 'whey-protein', name: '100% Whey Protein' },
    { slug: 'mass-gainers', name: 'High-Calorie Mass Gainers' },
    { slug: 'creatine', name: 'Creatine & Performance' },
    { slug: 'vitamins', name: 'Vitamins & Health' },
    { slug: 'accessories', name: 'Shakers & Gym Gear' }
  ]).filter(cat => {
    if (!products || products.length === 0) return true;
    return products.some(p => p.category === cat.slug || ((p.category as string) === 'vitamins' && (cat.slug === 'health-essentials' || cat.slug === 'vitamins')));
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const marqueeItems = [
    { icon: Truck, text: 'FREE NATIONWIDE DELIVERY ON ORDERS OVER PKR 5,000' },
    { icon: ShieldCheck, text: '100% AUTHENTIC SPORTS NUTRITION WITH TAMPER-EVIDENT SEALS' },
    { icon: Zap, text: 'EXPRESS DISPATCH ACROSS ALL CITIES IN PAKISTAN' },
    { icon: Phone, text: 'WHATSAPP ATHLETE DESK & INQUIRIES: +92 325 2571589' },
    { icon: Flame, text: 'USE PROMO CODE "POWER500" FOR INSTANT PKR 500 DISCOUNT' },
    { icon: ShieldCheck, text: 'CASH ON DELIVERY & INSTANT JAZZCASH / EASYPAISA SUPPORTED' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 shadow-md">
      
      {/* Top Banner Bar - Clean High-Contrast Sports Ticker (Jet Black with White Text & Red Accents) */}
      <div className="bg-black text-white border-b border-black/40 overflow-hidden py-1.5 select-none relative w-full">
        {/* Left and right gradient fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-black to-transparent z-10" />

        <div className="nautilus-marquee-track flex items-center gap-8 sm:gap-12 whitespace-nowrap text-[11px] font-bold tracking-wider uppercase text-white/90">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m1-${idx}`} className="flex items-center gap-2 shrink-0">
                <Icon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{item.text}</span>
                <span className="text-red-500 ml-4 font-mono">◆</span>
              </div>
            );
          })}
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m2-${idx}`} className="flex items-center gap-2 shrink-0">
                <Icon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{item.text}</span>
                <span className="text-red-500 ml-4 font-mono">◆</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Red Header Row */}
      <div className="bg-[#ba0202] text-white border-b border-red-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* MOBILE VIEW (< lg): Matches User Attached Screenshot Exactly (Left: Menu + Search, Center: Logo, Right: Cart) */}
          <div className="flex lg:hidden items-center justify-between h-16 sm:h-20 gap-2">
            {/* Left: Hamburger Menu & Search */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center"
                aria-label="Toggle navigation menu"
                title="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-white stroke-[2.3]" />
                ) : (
                  <Menu className="w-6 h-6 text-white stroke-[2.3]" />
                )}
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-center"
                aria-label="Search supplements"
                title="Search products"
              >
                <Search className="w-6 h-6 text-white stroke-[2.3]" />
              </button>
            </div>

            {/* Center: Official White Logo */}
            <div className="flex items-center justify-center shrink-0">
              <button
                onClick={() => navigateTo('home')}
                className="group focus:outline-none p-1"
                aria-label="Nautilus Protein Home"
              >
                <img
                  src="https://i.postimg.cc/RF5f3JYx/Nautilus-Logo-Edited-(1).png"
                  alt="Nautilus Protein"
                  className="h-7 sm:h-8 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>

            {/* Right: Wishlist & Shopping Bag */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => navigateTo('wishlist')}
                className="relative p-2 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Wishlist"
                title="Saved items"
              >
                <Heart className="w-5 h-5 text-white stroke-[2.2]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-all flex items-center gap-1"
                aria-label="Shopping Cart"
                title="View Cart"
              >
                <ShoppingBag className="w-6 h-6 text-white stroke-[2.3]" />
                {totalCartCount > 0 && (
                  <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center tabular-nums shadow-sm border border-white/30">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP / LAPTOP VIEW (lg+): Logo on Left, Navigation in Center, Search/Wishlist/Cart on Right */}
          <div className="hidden lg:flex items-center justify-between h-20 gap-8">
            
            {/* Left: Official Pure White Nautilus Protein Logo */}
            <div className="shrink-0 flex items-center">
              <button
                onClick={() => navigateTo('home')}
                className="group focus:outline-none rounded p-1 transition-transform hover:scale-[1.02]"
                aria-label="Nautilus Protein Home"
              >
                <img
                  src="https://i.postimg.cc/RF5f3JYx/Nautilus-Logo-Edited-(1).png"
                  alt="Nautilus Protein"
                  className="h-10 xl:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </button>
            </div>

            {/* Center: Desktop Navigation Menu with Categories Dropdown */}
            <nav className="flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-bold tracking-wider uppercase font-heading">
              <button
                onClick={() => navigateTo('home')}
                className={`py-1.5 transition-colors ${
                  activePage === 'home' ? 'text-white border-b-2 border-white' : 'text-white/85 hover:text-white'
                }`}
              >
                Home
              </button>

              {/* Categories Dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setIsCatDropdownOpen(true)}
                onMouseLeave={() => setIsCatDropdownOpen(false)}
              >
                <button
                  onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                  className={`flex items-center gap-1.5 py-1.5 transition-colors ${
                    activePage === 'category' ? 'text-white border-b-2 border-white' : 'text-white/85 hover:text-white'
                  }`}
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Categories Dropdown Menu */}
                {isCatDropdownOpen && (
                  <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl p-2.5 space-y-1">
                      <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#ba0202]">
                        <span>Browse Categories</span>
                        <button
                          onClick={() => {
                            navigateTo('shop');
                            setIsCatDropdownOpen(false);
                          }}
                          className="hover:underline text-slate-500 hover:text-red-700 normal-case"
                        >
                          All Products →
                        </button>
                      </div>

                      {activeCategories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => {
                            navigateTo('category', { category: cat.slug });
                            setIsCatDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-50 text-slate-700 hover:text-red-700 transition-colors flex items-center justify-between group font-sans"
                        >
                          <span className="text-xs font-semibold">
                            {cat.name}
                          </span>
                          <span className="text-[#ba0202] opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                            →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigateTo('shop')}
                className={`py-1.5 transition-colors ${
                  activePage === 'shop' ? 'text-white border-b-2 border-white' : 'text-white/85 hover:text-white'
                }`}
              >
                Shop All
              </button>

              <button
                onClick={() => navigateTo('about')}
                className={`py-1.5 transition-colors ${
                  activePage === 'about' ? 'text-white border-b-2 border-white' : 'text-white/85 hover:text-white'
                }`}
              >
                About Us
              </button>

              <button
                onClick={() => navigateTo('contact')}
                className={`py-1.5 transition-colors ${
                  activePage === 'contact' ? 'text-white border-b-2 border-white' : 'text-white/85 hover:text-white'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Right: Search, Track Order, Wishlist, Cart */}
            <div className="flex items-center gap-2.5 xl:gap-3.5 shrink-0">
              
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl text-white text-xs font-medium transition-colors"
                title="Search supplements"
              >
                <Search className="w-4 h-4 text-white stroke-[2.2]" />
                <span className="hidden xl:inline text-white/80 font-sans">Search...</span>
              </button>

              {/* Track Order Direct Button */}
              <button
                onClick={() => navigateTo('track')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white hover:bg-white/15 border border-white/30 rounded-xl transition-colors shadow-sm font-heading uppercase"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span className="hidden xl:inline">Track Order</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => navigateTo('wishlist')}
                className="relative p-2.5 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Wishlist"
                title="Saved supplements"
              >
                <Heart className="w-5 h-5 text-white stroke-[2.2]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md border border-white/25 font-heading"
                aria-label="Shopping Cart"
                title="View Cart"
              >
                <ShoppingBag className="w-4 h-4 text-white stroke-[2.3]" />
                <span className="hidden xl:inline">Cart</span>
                {totalCartCount > 0 && (
                  <span className="bg-[#ba0202] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center tabular-nums shadow-sm border border-white/30">
                    {totalCartCount}
                  </span>
                )}
              </button>

            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation (Styled in clean Red & White) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#9e0202] text-white border-b border-red-900 px-4 pt-3 pb-6 animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {[
              { label: 'Home', page: 'home' },
              { label: 'Shop All Products', page: 'shop' },
              ...activeCategories.map(c => ({ label: c.name, page: 'category', param: { category: c.slug } })),
              { label: 'About Us', page: 'about' },
              { label: 'Contact', page: 'contact' },
            ].map((link: any) => {
              const isActive = activePage === link.page;
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    navigateTo(link.page, link.param);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-white text-red-700 font-extrabold shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-white/70 text-xs">→</span>
                </button>
              );
            })}
            
            <div className="pt-4 mt-2 border-t border-white/20 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigateTo('track');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-black/40 border border-white/20 rounded-xl flex items-center justify-between hover:bg-black/60"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Track Your Order Status</span>
                </div>
                <span>📦</span>
              </button>
              <button
                onClick={() => {
                  navigateTo('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-white/70 hover:text-white"
              >
                Store Administration Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
