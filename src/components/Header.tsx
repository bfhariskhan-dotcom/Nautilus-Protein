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
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-md shadow-purple-950/5'
        : 'bg-white/90 backdrop-blur-sm border-b border-slate-200'
    }`}>
      
      {/* Top Banner Bar with Purple Gradient & Continuous Marquee */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-white border-b border-purple-800/40 overflow-hidden py-2 select-none relative w-full">
        {/* Left and right gradient fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-purple-950 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-indigo-950 to-transparent z-10" />

        <div className="nautilus-marquee-track flex items-center gap-8 sm:gap-12 whitespace-nowrap text-[11px] font-bold tracking-wider uppercase text-purple-100">
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m1-${idx}`} className="flex items-center gap-2 shrink-0">
                <Icon className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span>{item.text}</span>
                <span className="text-purple-400/80 ml-4 font-mono">◆</span>
              </div>
            );
          })}
          {marqueeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m2-${idx}`} className="flex items-center gap-2 shrink-0">
                <Icon className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                <span>{item.text}</span>
                <span className="text-purple-400/80 ml-4 font-mono">◆</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-3">
          
          {/* Official Logo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded p-1 transition-transform hover:scale-[1.03]"
              aria-label="Nautilus Protein Home"
            >
              <img
                src="https://i.postimg.cc/C54Q75KX/Nautilus-Protein-Black-Purple-Logo.png"
                alt="Nautilus Protein"
                className="h-12 sm:h-16 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          {/* Desktop Navigation Menu (Compact with Categories Dropdown) */}
          <nav className="hidden lg:flex items-center gap-6 2xl:gap-8 text-sm font-semibold tracking-wide">
            {/* 1. Home */}
            <button
              onClick={() => navigateTo('home')}
              className={`relative py-1 transition-colors ${
                activePage === 'home' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <span>Home</span>
              {activePage === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-600 rounded-full" />
              )}
            </button>

            {/* 2. Categories Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setIsCatDropdownOpen(true)}
              onMouseLeave={() => setIsCatDropdownOpen(false)}
            >
              <button
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                className={`flex items-center gap-1.5 py-1 transition-colors ${
                  activePage === 'category' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180 text-purple-600' : 'text-slate-400'}`} />
              </button>

              {/* Floating Dropdown Menu */}
              {isCatDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 space-y-1">
                    <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-purple-600">
                      <span>Browse Categories</span>
                      <button
                        onClick={() => {
                          navigateTo('shop');
                          setIsCatDropdownOpen(false);
                        }}
                        className="hover:underline text-slate-500 hover:text-purple-700 normal-case"
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
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-between group"
                      >
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-purple-700">
                          {cat.name}
                        </span>
                        <span className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Shop All */}
            <button
              onClick={() => navigateTo('shop')}
              className={`relative py-1 transition-colors ${
                activePage === 'shop' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <span>Shop All</span>
              {activePage === 'shop' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-600 rounded-full" />
              )}
            </button>

            {/* 4. About Us */}
            <button
              onClick={() => navigateTo('about')}
              className={`relative py-1 transition-colors ${
                activePage === 'about' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <span>About Us</span>
              {activePage === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-600 rounded-full" />
              )}
            </button>

            {/* 5. Contact */}
            <button
              onClick={() => navigateTo('contact')}
              className={`relative py-1 transition-colors ${
                activePage === 'contact' ? 'text-purple-700 font-bold' : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <span>Contact</span>
              {activePage === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-purple-600 rounded-full" />
              )}
            </button>
          </nav>

          {/* Action Icons Zone */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 text-slate-600 hover:text-purple-700 rounded-xl hover:bg-purple-50 border border-slate-200 hover:border-purple-200 transition-colors"
              aria-label="Search supplements"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 sm:p-2.5 text-slate-600 hover:text-purple-700 rounded-xl hover:bg-purple-50 border border-slate-200 hover:border-purple-200 transition-colors"
              aria-label="Wishlist"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 sm:p-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl border border-purple-200 transition-all duration-150 flex items-center gap-2 hover:border-purple-400 hover:shadow-md"
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-purple-700" />
              <span className="hidden md:inline text-xs font-bold tabular-nums text-purple-950">
                Cart
              </span>
              {totalCartCount > 0 && (
                <span className="bg-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center tabular-nums shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Track Order Direct Button (Desktop) */}
            <button
              onClick={() => navigateTo('track')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 border border-purple-200 hover:border-purple-400 rounded-xl transition-colors bg-white hover:bg-purple-50 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Track Order</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-purple-700 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-purple-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/98 border-b border-purple-200 px-4 pt-3 pb-6 animate-in slide-in-from-top-3 duration-200 shadow-xl">
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
                      ? 'bg-purple-100 text-purple-900 border border-purple-300 font-bold'
                      : 'text-slate-700 hover:text-purple-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-purple-600 text-xs">→</span>
                </button>
              );
            })}
            
            <div className="pt-4 mt-2 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigateTo('track');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Track Your Order Status</span>
                </div>
                <span>📦</span>
              </button>
              <button
                onClick={() => {
                  navigateTo('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-xs font-medium text-slate-500 hover:text-purple-700"
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
