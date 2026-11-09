import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, CartItem, Order, CustomerReview, WebsiteSettings } from '../types';
import {
  getProductsFromFirestore,
  getCategoriesFromFirestore,
  getBrandsFromFirestore,
  getSettingsFromFirestore,
  seedInitialFirestoreData,
  deleteProductFromFirestore,
  subscribeToProducts
} from '../services/firestoreService';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  settings: WebsiteSettings | null;
  cart: CartItem[];
  wishlist: string[];
  activePage: string;
  selectedProductSlug: string | null;
  selectedCategorySlug: string | null;
  selectedBrandSlug: string | null;
  searchQuery: string;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  quickViewProduct: Product | null;
  lastConfirmedOrder: Order | null;
  toasts: Toast[];
  isLoading: boolean;
  // Methods
  navigateTo: (page: string, params?: { slug?: string; category?: string; brand?: string; order?: Order }) => void;
  addToCart: (product: Product, quantity?: number, flavor?: string, weight?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setLastConfirmedOrder: (order: Order | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  refreshProducts: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('np_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('np_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Parse current URL path for distinct product links and deep navigation
  const parseCurrentUrl = () => {
    if (typeof window === 'undefined') return { page: 'home', params: {} as any };
    const pathname = window.location.pathname;
    if (pathname.startsWith('/product/')) {
      const slug = decodeURIComponent(pathname.replace('/product/', '').split('/')[0]);
      if (slug) return { page: 'product', params: { slug } };
    }
    if (pathname.startsWith('/category/')) {
      const category = decodeURIComponent(pathname.replace('/category/', '').split('/')[0]);
      if (category) return { page: 'category', params: { category } };
    }
    if (pathname.startsWith('/brand/')) {
      const brand = decodeURIComponent(pathname.replace('/brand/', '').split('/')[0]);
      if (brand) return { page: 'brand', params: { brand } };
    }
    const cleanPath = pathname.replace('/', '');
    if (['shop', 'cart', 'checkout', 'about', 'contact', 'faqs', 'admin', 'wishlist', 'track-order', 'refund', 'terms', 'privacy'].includes(cleanPath)) {
      return { page: cleanPath, params: {} };
    }
    return { page: 'home', params: {} };
  };

  const initialRoute = parseCurrentUrl();
  const [activePage, setActivePage] = useState<string>(initialRoute.page);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(initialRoute.params?.slug || null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(initialRoute.params?.category || null);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(initialRoute.params?.brand || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Popstate listener to handle browser back / forward navigation seamlessly
  useEffect(() => {
    const handlePopState = () => {
      const route = parseCurrentUrl();
      setActivePage(route.page);
      if (route.params?.slug) setSelectedProductSlug(route.params.slug);
      if (route.params?.category) setSelectedCategorySlug(route.params.category);
      if (route.params?.brand) setSelectedBrandSlug(route.params.brand);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync cart and wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('np_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('np_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Load initial store data from Firestore with server fallback
  const refreshProducts = async () => {
    try {
      const fsProducts = await getProductsFromFirestore();
      if (fsProducts && fsProducts.length > 0) {
        setProducts(fsProducts);
        return;
      }
      // If Firestore is empty, fetch from backend API
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      try {
        const res = await fetch('/api/products');
        if (res.ok) setProducts(await res.json());
      } catch (fallbackErr) {
        console.error('API fallback also failed', fallbackErr);
      }
    }
  };

  const refreshSettings = async () => {
    try {
      const fsSettings = await getSettingsFromFirestore();
      if (fsSettings) {
        setSettings(fsSettings);
        return;
      }
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;

    async function initData() {
      setIsLoading(true);
      try {
        // 1. First fetch products and categories from Firestore
        const [fsProducts, fsCategories, fsBrands, fsSettings] = await Promise.all([
          getProductsFromFirestore().catch(() => []),
          getCategoriesFromFirestore().catch(() => []),
          getBrandsFromFirestore().catch(() => []),
          getSettingsFromFirestore().catch(() => null)
        ]);

        let loadedProducts = fsProducts;
        let loadedCategories = fsCategories;
        let loadedBrands = fsBrands;
        let loadedSettings = fsSettings;

        // If Firestore is empty OR has legacy placeholder products, sync with the clean catalog
        const hasLegacyProducts = loadedProducts.some(p => p.id === 'prod-1' || p.id === 'prod-2' || p.id === 'prod-3');
        if (loadedProducts.length === 0 || hasLegacyProducts) {
          try {
            const [pRes, cRes, bRes, sRes] = await Promise.all([
              fetch('/api/products').then(r => r.ok ? r.json() : []).catch(() => []),
              fetch('/api/categories').then(r => r.ok ? r.json() : []).catch(() => []),
              fetch('/api/brands').then(r => r.ok ? r.json() : []).catch(() => []),
              fetch('/api/settings').then(r => r.ok ? r.json() : null).catch(() => null)
            ]);

            if (pRes && pRes.length > 0) {
              loadedProducts = pRes;
              loadedCategories = cRes || [];
              loadedBrands = bRes || [];
              loadedSettings = sRes;

              // Clean legacy dummy products from Firestore
              if (hasLegacyProducts) {
                for (const oldProd of fsProducts) {
                  if (oldProd.id.startsWith('prod-')) {
                    deleteProductFromFirestore(oldProd.id).catch(() => {});
                  }
                }
              }

              // Seed the clean new product and categories into Firestore permanently
              seedInitialFirestoreData({
                products: pRes,
                categories: cRes || [],
                brands: bRes || [],
                settings: sRes || {}
              }).catch(e => console.warn('Background seed note:', e));
            }
          } catch (seedErr) {
            console.warn('Fallback fetch error:', seedErr);
          }
        }

        setProducts(loadedProducts);
        if (loadedCategories.length > 0) setCategories(loadedCategories);
        if (loadedBrands.length > 0) setBrands(loadedBrands);
        if (loadedSettings) setSettings(loadedSettings);

        // 2. Set up real-time listener for products in Firestore
        unsubscribeProducts = subscribeToProducts((updated) => {
          if (updated && updated.length > 0) {
            setProducts(updated);
          }
        });
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initData();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const navigateTo = (page: string, params?: { slug?: string; category?: string; brand?: string; order?: Order }) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePage(page);
    setIsMobileMenuOpen(false);
    if (params?.slug) setSelectedProductSlug(params.slug);
    if (params?.category) setSelectedCategorySlug(params.category);
    if (params?.brand) setSelectedBrandSlug(params.brand);
    if (params?.order) setLastConfirmedOrder(params.order);

    // Update real browser address bar so each product and category has its own unique link
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (page === 'product' && params?.slug) {
        targetPath = `/product/${encodeURIComponent(params.slug)}`;
      } else if (page === 'category' && params?.category) {
        targetPath = `/category/${encodeURIComponent(params.category)}`;
      } else if (page === 'brand' && params?.brand) {
        targetPath = `/brand/${encodeURIComponent(params.brand)}`;
      } else if (page === 'home') {
        targetPath = '/';
      } else {
        targetPath = `/${page}`;
      }

      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page, params }, '', targetPath);
      }
    }
  };

  const addToCart = (product: Product, quantity = 1, flavor?: string, weight?: string) => {
    if (!product.inStock || product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    const selectedFlavor = flavor || (product.flavors && product.flavors[0]) || '';
    const selectedWeight = weight || product.weight;
    const cartItemId = `${product.id}_${selectedFlavor}_${selectedWeight}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        showToast(`Updated quantity for ${product.name} in cart (${newQty} total)`);
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      } else {
        const itemPrice = product.salePrice || product.price;
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: itemPrice,
          originalPrice: product.salePrice ? product.price : undefined,
          flavor: selectedFlavor,
          weight: selectedWeight,
          quantity: Math.min(quantity, product.stock),
          maxStock: product.stock
        };
        showToast(`Added ${product.name} to your cart`);
        return [...prev, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const clamped = Math.min(quantity, item.maxStock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        brands,
        settings,
        cart,
        wishlist,
        activePage,
        selectedProductSlug,
        selectedCategorySlug,
        selectedBrandSlug,
        searchQuery,
        isSearchOpen,
        isCartOpen,
        isMobileMenuOpen,
        quickViewProduct,
        lastConfirmedOrder,
        toasts,
        isLoading,
        navigateTo,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        setSearchQuery,
        setIsSearchOpen,
        setIsCartOpen,
        setIsMobileMenuOpen,
        setQuickViewProduct,
        setLastConfirmedOrder,
        showToast,
        refreshProducts,
        refreshSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
