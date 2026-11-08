import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigateTo } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filtered = query.trim()
    ? products.filter(p => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
        );
      })
    : [];

  const handleSelect = (slug: string) => {
    setIsSearchOpen(false);
    navigateTo('product', { slug });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-white/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-500 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search whey protein, mass gainer, creatine, pre-workout..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-slate-900 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs uppercase tracking-wider text-slate-500 hover:text-slate-900 px-2 py-1 bg-neutral-800 rounded-md ml-2"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="py-6 text-center text-xs text-slate-400 space-y-3">
              <p className="text-slate-500 font-medium">Quick suggestions:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Fast Protein', 'Mass Gainer', 'Creatine Omega-3', 'Volt Pre-Workout', 'Whey Isolate'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-800 transition-colors border border-slate-200 text-xs font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              <p>No supplements found matching &quot;{query}&quot;.</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &quot;Whey&quot;, &quot;Gainer&quot;, or &quot;Creatine&quot;.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Matching Supplements ({filtered.length})
              </p>
              {filtered.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product.slug)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer transition-colors group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-purple-400 font-medium">{product.brand}</p>
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-purple-300 truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span className="text-slate-900 font-bold tabular-nums">
                        PKR {(product.salePrice || product.price).toLocaleString()}
                      </span>
                      <span>·</span>
                      <span>{product.weight}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
