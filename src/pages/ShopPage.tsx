import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

export const ShopPage: React.FC = () => {
  const { products, categories, brands, selectedCategorySlug, selectedBrandSlug } = useStore();

  const [categoryFilter, setCategoryFilter] = useState<string>(selectedCategorySlug || 'all');
  const [brandFilter, setBrandFilter] = useState<string>(selectedBrandSlug || 'all');
  const [sortOption, setSortOption] = useState<string>('popular');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Sync if selectedCategorySlug changes
  React.useEffect(() => {
    if (selectedCategorySlug) {
      setCategoryFilter(selectedCategorySlug);
    }
  }, [selectedCategorySlug]);

  React.useEffect(() => {
    if (selectedBrandSlug) {
      setBrandFilter(selectedBrandSlug);
    }
  }, [selectedBrandSlug]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter !== 'all') {
      result = result.filter(p => {
        if (p.category === categoryFilter) return true;
        if (categoryFilter === 'health-essentials' && p.category === 'vitamins') return true;
        if (categoryFilter === 'vitamins' && (p.category as string) === 'health-essentials') return true;
        return false;
      });
    }

    if (brandFilter !== 'all') {
      result = result.filter(p => p.brand.toLowerCase() === brandFilter.toLowerCase());
    }

    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    result = result.filter(p => (p.salePrice || p.price) <= maxPrice);

    // Sorting
    if (sortOption === 'price-low') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortOption === 'price-high') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortOption === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.rating - a.rating);
    }

    return result;
  }, [products, categoryFilter, brandFilter, inStockOnly, maxPrice, sortOption]);

  const resetFilters = () => {
    setCategoryFilter('all');
    setBrandFilter('all');
    setInStockOnly(false);
    setMaxPrice(25000);
    setSortOption('popular');
  };

  const hasActiveFilters = categoryFilter !== 'all' || brandFilter !== 'all' || inStockOnly || maxPrice < 25000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-600">
              Complete Supplement Catalog
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase font-heading mt-1">
              Shop All Products
            </h1>
            <p className="text-xs text-slate-500 mt-1.5">
              100% Authentic whey proteins, mass gainers, creatine, and fitness supplements in Pakistan.
            </p>
          </div>

          {/* Quick Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="lg:hidden px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-red-600" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-slate-200 text-slate-900 rounded-xl text-xs py-2 px-3 focus:outline-none focus:border-red-600 font-medium cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters Desktop & Mobile Drawer */}
        <aside className={`lg:block ${isMobileFiltersOpen ? 'block' : 'hidden'} space-y-6 bg-white p-6 rounded-2xl border border-slate-200 lg:bg-transparent lg:p-0 lg:border-0`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-600" />
              <span>Filter Catalog</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-red-600 hover:text-slate-900 flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-red-700'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories
                .filter(c => {
                  const count = products.filter(p => p.category === c.slug || ((p.category as string) === 'vitamins' && (c.slug === 'health-essentials' || c.slug === 'vitamins'))).length;
                  return count > 0;
                })
                .map((c) => {
                  const count = products.filter(p => p.category === c.slug || ((p.category as string) === 'vitamins' && (c.slug === 'health-essentials' || c.slug === 'vitamins'))).length;
                  const isSelected = categoryFilter === c.slug || (categoryFilter === 'vitamins' && c.slug === 'health-essentials') || (categoryFilter === 'health-essentials' && c.slug === 'vitamins');
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCategoryFilter(c.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-red-700'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[11px] tabular-nums opacity-80">
                        {count}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Brands */}
          <div className="pt-4 border-t border-slate-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Brand
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setBrandFilter('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  brandFilter === 'all'
                    ? 'bg-red-100 text-red-800 font-bold border border-red-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-red-700'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBrandFilter(b.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    brandFilter.toLowerCase() === b.name.toLowerCase()
                      ? 'bg-red-100 text-red-800 font-bold border border-red-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-red-700'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Max Price</span>
              <span className="text-slate-900 tabular-nums">PKR {maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="25000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-red-600 bg-slate-200 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>PKR 2,000</span>
              <span>PKR 25,000</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-4 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-white border-slate-300 text-red-600 focus:ring-red-500"
              />
              <span>In Stock Only</span>
            </label>
          </div>

        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <span>Showing <span className="font-bold text-slate-900 tabular-nums">{filteredProducts.length}</span> supplements</span>
            {hasActiveFilters && (
              <span className="text-red-600 font-semibold">Filtered view</span>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl py-16 px-6 text-center space-y-4 shadow-sm">
              <p className="text-base text-slate-700 font-semibold">No supplements match your criteria.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price filter or selecting a different category.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-red-600/20"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
