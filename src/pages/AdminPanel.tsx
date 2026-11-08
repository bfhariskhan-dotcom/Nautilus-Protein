import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  LogOut,
  Package,
  ShoppingBag,
  Tag,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Copy,
  CheckCircle,
  Truck,
  Layers,
  Save,
  RefreshCw,
  TrendingUp,
  Upload,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  FolderPlus
} from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, SUPERADMIN_UID } from '../firebase';
import { Order, Product, Category, Brand, Coupon, CustomerReview, OrderStatus, WebsiteSettings } from '../types';
import { useStore } from '../context/StoreContext';
import { uploadImageToImgBB, validateImageFile } from '../services/imageUpload';
import {
  saveProductToFirestore,
  deleteProductFromFirestore,
  getProductsFromFirestore,
  getOrdersFromFirestore,
  deleteOrderFromFirestore,
  getCategoriesFromFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  getCouponsFromFirestore,
  saveCouponToFirestore,
  deleteCouponFromFirestore,
  getReviewsFromFirestore,
  saveSettingsToFirestore,
  getSettingsFromFirestore
} from '../services/firestoreService';

export const AdminPanel: React.FC = () => {
  const { showToast, refreshProducts, refreshSettings } = useStore();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('np_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Tabs: 'overview' | 'orders' | 'products' | 'categories' | 'coupons' | 'reviews' | 'settings'
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'coupons' | 'reviews' | 'settings'>('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [storeSettings, setStoreSettings] = useState<WebsiteSettings | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    headline: '',
    ratio: '',
    brand: 'Nautilus Protein',
    category: 'amino-acids',
    categoryName: 'BCAA & Amino Acids',
    price: 6500,
    salePrice: 5500,
    weight: '450 GM',
    servings: 45,
    flavors: 'Lemon (Tangy Lemon)',
    stock: 50,
    image: 'https://i.postimg.cc/C54Q75KX/Nautilus-Protein-Black-Purple-Logo.png',
    gallery: '',
    shortDescription: '',
    description: '',
    directions: '',
    warnings: '',
    isBestSeller: false,
    isNew: false
  });

  // ImgBB Upload States for Product
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Modal state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: 'https://i.postimg.cc/C54Q75KX/Nautilus-Protein-Black-Purple-Logo.png'
  });
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);
  const [catUploadProgress, setCatUploadProgress] = useState(0);
  const catFileInputRef = useRef<HTMLInputElement>(null);

  // Coupon Modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'percentage', discountValue: 10, minSpend: 4000 });

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        if (!authToken) {
          const simulatedToken = `firebase-${user.uid}`;
          setAuthToken(simulatedToken);
          localStorage.setItem('np_admin_token', simulatedToken);
        }
      } else {
        // If neither Firebase user nor local token exists
        if (!localStorage.getItem('np_admin_token')) {
          setCurrentUser(null);
          setAuthToken(null);
        }
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    setIsLoadingData(true);
    try {
      // 1. Fetch from Firestore
      const [fsProducts, fsCategories, fsOrders, fsCoupons, fsReviews, fsSettings] = await Promise.all([
        getProductsFromFirestore().catch(() => []),
        getCategoriesFromFirestore().catch(() => []),
        getOrdersFromFirestore().catch(() => []),
        getCouponsFromFirestore().catch(() => []),
        getReviewsFromFirestore().catch(() => []),
        getSettingsFromFirestore().catch(() => null)
      ]);

      // 2. Fetch server data as fallback or complement
      const headers: Record<string, string> = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      const [oRes, pRes, cRes, bRes, coupRes, revRes, setRes] = await Promise.all([
        fetch('/api/orders', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/products').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/categories').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/brands').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/coupons', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/reviews?all=true').then(r => r.ok ? r.json() : []).catch(() => []),
        fetch('/api/settings').then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      setOrders(fsOrders.length > 0 ? fsOrders : oRes);
      setProducts(fsProducts.length > 0 ? fsProducts : pRes);
      setCategories(fsCategories.length > 0 ? fsCategories : cRes);
      setBrands(bRes && bRes.length > 0 ? bRes : []);
      setCoupons(fsCoupons.length > 0 ? fsCoupons : coupRes);
      setReviews(fsReviews.length > 0 ? fsReviews : revRes);
      setStoreSettings(fsSettings || setRes);
    } catch (err) {
      console.error(err);
      showToast('Error loading administrative data.', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (authToken || currentUser) {
      fetchAdminData();
    }
  }, [authToken, currentUser]);

  // Handle Login: Firebase Auth + Server Sync
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }
    setIsLoggingIn(true);
    try {
      // 1. Firebase Authentication with Email and Password
      let firebaseUser: User | null = null;
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        firebaseUser = cred.user;
        setCurrentUser(firebaseUser);
      } catch (fbErr: any) {
        console.warn('Firebase Auth notice:', fbErr?.message || fbErr);
      }

      // 2. Also authenticate with Server API
      let serverToken = '';
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email.trim(), password })
        });
        const data = await res.json();
        if (res.ok && data.token) {
          serverToken = data.token;
        }
      } catch {
        // server endpoint fallback
      }

      const activeToken = serverToken || (firebaseUser ? `firebase-${firebaseUser.uid}` : null);

      if (firebaseUser || activeToken) {
        const tokenToSave = activeToken || `admin-session-${Date.now()}`;
        setAuthToken(tokenToSave);
        localStorage.setItem('np_admin_token', tokenToSave);
        localStorage.setItem('np_admin_email', email.trim());
        showToast('Administrative session authenticated successfully.');
        await fetchAdminData();
      } else {
        showToast('Invalid email or password credentials.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('np_admin_token');
    localStorage.removeItem('np_admin_email');
    showToast('Admin session logged out.', 'info');
  };

  // Orders Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        showToast(`Order status updated to ${newStatus}`);
        fetchAdminData();
      } else {
        showToast('Failed to update status', 'error');
      }
    } catch {
      showToast('Error updating order', 'error');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order record? This cannot be undone.')) return;
    try {
      await deleteOrderFromFirestore(orderId).catch(() => {});
      try {
        await fetch(`/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch {}
      showToast('Order record removed');
      fetchAdminData();
    } catch {
      showToast('Error deleting order', 'error');
    }
  };

  // Product Actions: Add & Edit
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        headline: prod.headline || '',
        ratio: prod.ratio || '',
        brand: prod.brand,
        category: prod.category,
        categoryName: prod.categoryName,
        price: prod.price,
        salePrice: prod.salePrice || 0,
        weight: prod.weight,
        servings: Number(prod.servings) || 45,
        flavors: prod.flavors ? prod.flavors.join(', ') : '',
        stock: prod.stock,
        image: prod.image,
        gallery: prod.gallery ? prod.gallery.join(', ') : '',
        shortDescription: prod.shortDescription || '',
        description: prod.description || '',
        directions: prod.directions || '',
        warnings: prod.warnings || '',
        isBestSeller: prod.isBestSeller,
        isNew: prod.isNew
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        headline: '',
        ratio: '2:1:1',
        brand: 'Nautilus Protein',
        category: 'amino-acids',
        categoryName: 'BCAA & Amino Acids',
        price: 6500,
        salePrice: 5500,
        weight: '450 GM',
        servings: 45,
        flavors: 'Lemon (Tangy Lemon)',
        stock: 50,
        image: 'https://i.postimg.cc/C54Q75KX/Nautilus-Protein-Black-Purple-Logo.png',
        gallery: '',
        shortDescription: 'Recover Faster. Train Harder. No Muscle Loss.',
        description: 'Nautilus BCAA is essential for every gym boy. When you train hard, your muscles break. BCAA stops that breakage.',
        directions: 'Mix 1 scoop (10g) with 250-300ml cold water.',
        warnings: 'Food Supplement Only. Not a Medicine. Store in cool, dry place below 30°C.',
        isBestSeller: true,
        isNew: true
      });
    }
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);
    setIsProductModalOpen(true);
  };

  // Duplicate Product Action
  const handleDuplicateProduct = async (prod: Product) => {
    try {
      const newId = `prod-${Date.now()}`;
      const newName = `${prod.name} (Copy)`;
      const newSlug = `${prod.slug}-copy-${Math.floor(100 + Math.random() * 900)}`;

      const duplicatedProduct: Product = {
        ...prod,
        id: newId,
        name: newName,
        slug: newSlug,
        stock: prod.stock || 20,
        inStock: true
      };

      // 1. Direct Firestore save
      await saveProductToFirestore(duplicatedProduct);

      // 2. Sync to server catalog if available
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(duplicatedProduct)
        });
      } catch {}

      showToast(`Duplicated "${prod.name}" as new product`);
      await fetchAdminData();
      await refreshProducts();
    } catch (err: any) {
      console.error('Duplicate product error:', err);
      showToast('Error duplicating product: ' + (err.message || 'Check connection'), 'error');
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file format.');
      setUploadSuccess(null);
      return;
    }

    setIsUploadingImage(true);
    setUploadProgress(15);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const res = await uploadImageToImgBB(file, (progress) => {
        setUploadProgress(progress);
      });

      if (res.success && res.url) {
        setProductForm(prev => {
          // If image already set, also add to gallery
          const currentGallery = prev.gallery ? prev.gallery.split(',').map(s => s.trim()).filter(Boolean) : [];
          if (!currentGallery.includes(res.url)) {
            currentGallery.push(res.url);
          }
          return {
            ...prev,
            image: prev.image.includes('Logo') ? res.url : prev.image,
            gallery: currentGallery.join(', ')
          };
        });
        setUploadSuccess(`Uploaded to ImgBB successfully!`);
        showToast('Product image uploaded via ImgBB');
      } else {
        setUploadError(res.error || 'Failed to upload image to ImgBB.');
        showToast(res.error || 'ImgBB upload error', 'error');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Network exception during image upload.');
      showToast('Network error during ImgBB upload', 'error');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const prodId = editingProduct ? editingProduct.id : `prod-${Date.now()}`;
    const slug = (productForm.name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const galleryList = productForm.gallery
      ? productForm.gallery.split(',').map(s => s.trim()).filter(Boolean)
      : (editingProduct?.gallery || [productForm.image]);

    if (!galleryList.includes(productForm.image)) {
      galleryList.unshift(productForm.image);
    }

    const completeProduct: Product = {
      ...productForm,
      id: prodId,
      slug: editingProduct ? editingProduct.slug : slug,
      price: Number(productForm.price),
      salePrice: productForm.salePrice ? Number(productForm.salePrice) : undefined,
      stock: Number(productForm.stock),
      inStock: Number(productForm.stock) > 0,
      servings: Number(productForm.servings) || 45,
      flavors: productForm.flavors ? productForm.flavors.split(',').map(f => f.trim()).filter(Boolean) : ['Lemon (Tangy Lemon)'],
      goal: (editingProduct?.goal as any) || 'recovery',
      goalName: editingProduct?.goalName || 'Muscle Recovery & Anti-Catabolic',
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 14,
      nutritionFacts: editingProduct?.nutritionFacts || [],
      ingredients: editingProduct?.ingredients || [],
      category: productForm.category as any,
      categoryName: productForm.categoryName,
      isFeatured: productForm.isBestSeller || (editingProduct?.isFeatured ?? true),
      headline: productForm.headline || undefined,
      ratio: productForm.ratio || undefined,
      gallery: galleryList,
      highlights: editingProduct?.highlights || undefined,
      whoIsItFor: editingProduct?.whoIsItFor || undefined,
      faqs: editingProduct?.faqs || undefined,
      tags: editingProduct?.tags || ['2:1:1 Ratio', 'Zero Sugar', 'Halal', 'Lab Tested']
    };

    try {
      // 1. Direct Firestore Persistence
      await saveProductToFirestore(completeProduct);

      // 2. Also sync to backend API if server is alive
      try {
        const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
        const method = editingProduct ? 'PUT' : 'POST';
        await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(completeProduct)
        });
      } catch (apiErr) {
        console.warn('API sync notice (Firestore saved successfully):', apiErr);
      }

      showToast(editingProduct ? 'Product updated in Firebase catalog' : 'New supplement added to Firebase');
      setIsProductModalOpen(false);
      await fetchAdminData();
      await refreshProducts();
    } catch (err: any) {
      console.error('Failed to save product:', err);
      showToast('Error saving product: ' + (err.message || 'Check connection'), 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this supplement from the store catalog?')) return;
    try {
      await deleteProductFromFirestore(id);
      try {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch (apiErr) {
        console.warn('API delete notice:', apiErr);
      }
      showToast('Product removed from database');
      await fetchAdminData();
      await refreshProducts();
    } catch (err: any) {
      console.error('Error deleting product:', err);
      showToast('Error deleting product', 'error');
    }
  };

  // Category Actions
  const handleOpenCatModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCatForm({
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.image || 'https://i.postimg.cc/C54Q75KX/Nautilus-Protein-Black-Purple-Logo.png'
      });
    } else {
      setEditingCategory(null);
      setCatForm({
        name: '',
        slug: '',
        description: '',
        image: 'https://i.postimg.cc/C54Q75KX/Nautilus-Protein-Black-Purple-Logo.png'
      });
    }
    setIsCatModalOpen(true);
  };

  const handleCatImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showToast(validation.error || 'Invalid file format.', 'error');
      return;
    }
    setIsUploadingCatImage(true);
    setCatUploadProgress(20);
    try {
      const res = await uploadImageToImgBB(file, (p) => setCatUploadProgress(p));
      if (res.success && res.url) {
        setCatForm(prev => ({ ...prev, image: res.url }));
        showToast('Category icon uploaded via ImgBB');
      } else {
        showToast(res.error || 'Category image upload failed', 'error');
      }
    } catch {
      showToast('Upload error', 'error');
    } finally {
      setIsUploadingCatImage(false);
      if (catFileInputRef.current) catFileInputRef.current.value = '';
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const catId = editingCategory ? editingCategory.id : `cat-${Date.now()}`;
    const slug = catForm.slug || catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCat: Category = {
      id: catId,
      name: catForm.name,
      slug,
      description: catForm.description,
      image: catForm.image,
      itemCount: products.filter(p => p.category === slug).length
    };

    try {
      await saveCategoryToFirestore(newCat);
      try {
        const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
        const method = editingCategory ? 'PUT' : 'POST';
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
          body: JSON.stringify(newCat)
        });
      } catch {}

      showToast(editingCategory ? 'Category updated' : 'New category created');
      setIsCatModalOpen(false);
      await fetchAdminData();
    } catch (err: any) {
      showToast('Error saving category: ' + (err.message || ''), 'error');
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategoryFromFirestore(catId);
      try {
        await fetch(`/api/categories/${catId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch {}
      showToast('Category deleted');
      await fetchAdminData();
    } catch (err: any) {
      showToast('Error deleting category', 'error');
    }
  };

  // Coupons
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCoupon: Coupon = {
        id: `coup-${Date.now()}`,
        code: couponForm.code.toUpperCase(),
        discountType: couponForm.discountType as any,
        discountValue: Number(couponForm.discountValue),
        minSpend: Number(couponForm.minSpend),
        isActive: true,
        usageCount: 0
      };
      await saveCouponToFirestore(newCoupon);
      try {
        await fetch('/api/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(newCoupon)
        });
      } catch {}
      showToast(`Promo code ${newCoupon.code} created!`);
      setIsCouponModalOpen(false);
      setCouponForm({ code: '', discountType: 'percentage', discountValue: 10, minSpend: 4000 });
      fetchAdminData();
    } catch {
      showToast('Error creating coupon', 'error');
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await deleteCouponFromFirestore(id);
      try {
        await fetch(`/api/coupons/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch {}
      showToast('Coupon removed');
      fetchAdminData();
    } catch {
      showToast('Error deleting coupon', 'error');
    }
  };

  // Reviews Moderation
  const handleModerateReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/reviews/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      showToast(`Review marked as ${status}`);
      fetchAdminData();
    } catch {
      showToast('Error moderating review', 'error');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeSettings) return;
    try {
      await saveSettingsToFirestore(storeSettings);
      try {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(storeSettings)
        });
      } catch {}
      showToast('Store settings updated successfully');
      refreshSettings();
    } catch {
      showToast('Error saving settings', 'error');
    }
  };

  // If Checking initial auth
  if (authChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  // If Not Authenticated, show Clean Light Login View (No demo shortcuts)
  if (!authToken && !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <img
              src="https://i.postimg.cc/C54Q75KX/Nautilus-Protein-Black-Purple-Logo.png"
              alt="Nautilus Protein"
              className="h-16 w-auto object-contain mx-auto"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 uppercase font-heading">
                Store Administration
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Authorized management console for Nautilus Sports Nutrition.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@nautilusprotein.pk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-md shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In to Admin Console</span>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-400 text-center">
            Secured via Firebase Authentication &amp; Firestore Database.
          </p>
        </div>
      </div>
    );
  }

  // Calculate Overview Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending');
  const lowStockProducts = products.filter(p => p.stock < 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Administrative Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-heading mt-1">
            Nautilus Store Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Connected to Firebase Project: <strong className="text-purple-700">nautilus-protein</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2 text-slate-600 hover:text-purple-700 rounded-xl bg-white border border-slate-200 hover:border-purple-300 transition-colors shadow-sm"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories (${categories.length})`, icon: Layers },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { id: 'settings', label: 'Store Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 ${
                isActive
                  ? 'border-purple-600 text-purple-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 text-purple-600" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Revenue</span>
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                PKR {totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-purple-700 font-semibold">Active Pakistan Sales</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Orders</span>
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">{orders.length}</p>
              <p className="text-[11px] text-purple-700 font-semibold">{pendingOrders.length} Pending Action</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Supplements</span>
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">{products.length}</p>
              <p className="text-[11px] text-slate-500">Across {categories.length} Categories</p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Low Stock Alerts</span>
              <p className="text-2xl font-black text-purple-700 font-mono tabular-nums">{lowStockProducts.length}</p>
              <p className="text-[11px] text-slate-500">Items with &lt; 10 units</p>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
                Recent Orders
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold"
              >
                View All Orders →
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 font-mono text-sm">{ord.orderNumber}</span>
                    <p className="text-slate-500 mt-0.5">
                      {ord.customerName} ({ord.phone}) · {ord.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-900 tabular-nums">
                      PKR {ord.total.toLocaleString()}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading">
              Customer Orders ({orders.length})
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold">Order Ref</th>
                    <th className="py-3 px-4 font-bold">Customer</th>
                    <th className="py-3 px-4 font-bold">Location</th>
                    <th className="py-3 px-4 font-bold">Items</th>
                    <th className="py-3 px-4 font-bold">Payment</th>
                    <th className="py-3 px-4 font-bold">Total</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-purple-700 font-mono">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{ord.customerName}</p>
                        <p className="text-slate-500 text-[11px]">{ord.phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-900 font-medium">{ord.city}</p>
                        <p className="text-slate-500 text-[11px] truncate max-w-xs">{ord.address}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase font-semibold text-slate-700 text-[11px]">
                          {ord.paymentMethod.replace('_', ' ')}
                        </span>
                        {ord.paymentReference && (
                          <p className="text-[10px] text-purple-700 font-mono truncate">{ord.paymentReference}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                        PKR {ord.total.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-white border border-slate-300 text-slate-900 rounded-lg p-1.5 text-[11px] focus:outline-none focus:border-purple-600 cursor-pointer font-medium"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Delete order record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading">
              Supplement Catalog ({products.length})
            </h2>
            <button
              onClick={() => handleOpenProductModal()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-contain rounded-xl bg-slate-50 border border-slate-200 p-1 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      {p.brand} · {p.categoryName}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 truncate">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.weight}</p>
                    <p className="text-xs font-bold text-slate-900 mt-1 tabular-nums">
                      PKR {(p.salePrice || p.price).toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Stock: <strong className="text-slate-900 tabular-nums">{p.stock}</strong> units
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`text-[11px] font-semibold ${p.inStock ? 'text-purple-700' : 'text-rose-600'}`}>
                    {p.inStock ? 'Published / In Stock' : 'Out of Stock'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Duplicate Product Action */}
                    <button
                      onClick={() => handleDuplicateProduct(p)}
                      className="p-1.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
                      title="Duplicate Product (Clone with copy)"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit Product Action */}
                    <button
                      onClick={() => handleOpenProductModal(p)}
                      className="p-1.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Product Action */}
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 hover:border-rose-300 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Modal */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
                    {editingProduct ? 'Edit Supplement' : 'Add New Supplement'}
                  </h3>
                  <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Product Name</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Brand</label>
                      <input
                        type="text"
                        required
                        value={productForm.brand}
                        onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Headline / Punchy Slogan</label>
                      <input
                        type="text"
                        value={productForm.headline}
                        onChange={(e) => setProductForm({ ...productForm, headline: e.target.value })}
                        placeholder="e.g. Recover Faster. Train Harder. No Muscle Loss."
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Ratio / Spec (Optional)</label>
                      <input
                        type="text"
                        value={productForm.ratio}
                        onChange={(e) => setProductForm({ ...productForm, ratio: e.target.value })}
                        placeholder="e.g. 2:1:1 Ratio"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => {
                          const catName = categories.find(c => c.slug === e.target.value)?.name || 'Supplements';
                          setProductForm({ ...productForm, category: e.target.value as any, categoryName: catName });
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      >
                        {categories.map(c => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Price (PKR)</label>
                      <input
                        type="number"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Sale Price (PKR)</label>
                      <input
                        type="number"
                        value={productForm.salePrice}
                        onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Stock Count</label>
                      <input
                        type="number"
                        required
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Weight / Size</label>
                      <input
                        type="text"
                        value={productForm.weight}
                        onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Servings</label>
                      <input
                        type="text"
                        value={productForm.servings}
                        onChange={(e) => setProductForm({ ...productForm, servings: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  {/* ImgBB Image Upload & URL input */}
                  <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-700" />
                        <span>Product Image (ImgBB Cloud Host)</span>
                      </label>
                      <span className="text-[10px] text-purple-700 font-mono">API: api.imgbb.com</span>
                    </div>

                    {/* Image Preview & Upload Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      <div className="w-24 h-24 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden shrink-0 relative group shadow-sm">
                        {productForm.image ? (
                          <img
                            src={productForm.image}
                            alt="Preview"
                            className="w-full h-full object-contain p-1"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        )}
                        {productForm.image && productForm.image.startsWith('http') && (
                          <a
                            href={productForm.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View</span>
                          </a>
                        )}
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageFileChange}
                            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                            className="hidden"
                            id="imgbb-file-upload"
                            disabled={isUploadingImage}
                          />
                          <label
                            htmlFor="imgbb-file-upload"
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                              isUploadingImage
                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30'
                            }`}
                          >
                            {isUploadingImage ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading to ImgBB ({uploadProgress}%)...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Choose & Upload Image</span>
                              </>
                            )}
                          </label>
                          <span className="text-[11px] text-slate-500">
                            JPG, PNG, WEBP (Max 16MB)
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {isUploadingImage && (
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
                            <div
                              className="bg-purple-600 h-full transition-all duration-300 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}

                        {/* Upload Status Alerts */}
                        {uploadSuccess && (
                          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{uploadSuccess}</span>
                          </p>
                        )}
                        {uploadError && (
                          <p className="text-[11px] text-rose-600 font-semibold">
                            ✕ {uploadError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-1">
                      <label className="block text-slate-600 text-[10px] uppercase font-semibold mb-1">
                        Or Direct Image URL (Saved to Firebase)
                      </label>
                      <input
                        type="text"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                        placeholder="https://i.ibb.co/... or /images/..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div className="pt-1">
                      <label className="block text-slate-600 text-[10px] uppercase font-semibold mb-1">
                        Gallery Image URLs (Comma Separated for Multi-image Display)
                      </label>
                      <input
                        type="text"
                        value={productForm.gallery}
                        onChange={(e) => setProductForm({ ...productForm, gallery: e.target.value })}
                        placeholder="https://i.ibb.co/pic1.jpg, https://i.ibb.co/pic2.jpg"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-xs focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Flavors (Comma Separated)</label>
                    <input
                      type="text"
                      value={productForm.flavors}
                      onChange={(e) => setProductForm({ ...productForm, flavors: e.target.value })}
                      placeholder="e.g. Lemon (Tangy Lemon), Chocolate, Vanilla"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      placeholder="Punchy summary for catalog cards and quick preview..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Detailed Product Description & Facts</label>
                    <textarea
                      rows={4}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Complete product details, benefits, servings information, and overview..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">How to Use (Directions)</label>
                      <textarea
                        rows={2}
                        value={productForm.directions}
                        onChange={(e) => setProductForm({ ...productForm, directions: e.target.value })}
                        placeholder="e.g. Mix 1 scoop (10g) with 250-300ml cold water..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Warnings & Storage</label>
                      <textarea
                        rows={2}
                        value={productForm.warnings}
                        onChange={(e) => setProductForm({ ...productForm, warnings: e.target.value })}
                        placeholder="e.g. Food Supplement Only. Store below 30°C in cool dry place..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={productForm.isBestSeller}
                        onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                        className="accent-purple-600"
                      />
                      <span>Best Seller Tag</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={productForm.isNew}
                        onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                        className="accent-purple-600"
                      />
                      <span>New Arrival Tag</span>
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold uppercase tracking-wider shadow-sm transition-colors"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading">
                Store Categories ({categories.length})
              </h2>
              <p className="text-xs text-slate-500">Manage, create and update supplement departments.</p>
            </div>
            <button
              onClick={() => handleOpenCatModal()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0 overflow-hidden">
                    {c.image && c.image.startsWith('http') ? (
                      <img src={c.image} alt={c.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <Layers className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 font-mono">
                      slug: {c.slug}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{c.description || 'No description provided'}</p>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono">
                      {products.filter(p => p.category === c.slug).length} Products assigned
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => handleOpenCatModal(c)}
                    className="p-1.5 bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 hover:border-rose-300 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Category Modal */}
          {isCatModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h3>
                  <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pre-Workout Boosters"
                      value={catForm.name}
                      onChange={(e) => setCatForm({
                        ...catForm,
                        name: e.target.value,
                        slug: catForm.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Category Slug (URL Identifier)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. pre-workout"
                      value={catForm.slug}
                      onChange={(e) => setCatForm({ ...catForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary of supplements in this category"
                      value={catForm.description}
                      onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                  </div>

                  {/* Category Image upload */}
                  <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-2xl p-3">
                    <label className="block text-slate-700 font-semibold text-[11px]">
                      Category Icon / Image (ImgBB)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={catFileInputRef}
                        onChange={handleCatImageFileChange}
                        accept="image/*"
                        className="hidden"
                        id="cat-image-file"
                        disabled={isUploadingCatImage}
                      />
                      <label
                        htmlFor="cat-image-file"
                        className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        {isUploadingCatImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Upload ImgBB</span>
                      </label>
                      <input
                        type="text"
                        value={catForm.image}
                        onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                        placeholder="Image URL"
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCatModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold uppercase tracking-wider shadow-sm transition-colors"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading">
              Discount Promo Codes ({coupons.length})
            </h2>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-bold">Code</th>
                  <th className="py-3 px-4 font-bold">Discount</th>
                  <th className="py-3 px-4 font-bold">Min Spend</th>
                  <th className="py-3 px-4 font-bold">Usages</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 text-right font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 px-4 font-bold text-purple-700 font-mono text-sm">{c.code}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `PKR ${c.discountValue} OFF`}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-700">
                      PKR {c.minSpend.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-slate-500">{c.usageCount || 0} times</td>
                    <td className="py-3 px-4 text-purple-700 font-semibold">Active</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Coupon Modal */}
          {isCouponModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 text-base">Create Discount Coupon</h3>
                  <button onClick={() => setIsCouponModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                </div>
                <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SUMMER15"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 uppercase font-mono focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Type</label>
                      <select
                        value={couponForm.discountType}
                        onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (PKR)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Value</label>
                      <input
                        type="number"
                        required
                        value={couponForm.discountValue}
                        onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Minimum Order Spend (PKR)</label>
                    <input
                      type="number"
                      required
                      value={couponForm.minSpend}
                      onChange={(e) => setCouponForm({ ...couponForm, minSpend: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCouponModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold uppercase tracking-wider shadow-sm transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-heading">
            Review Moderation Desk ({reviews.length})
          </h2>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            {reviews.map((r) => (
              <div key={r.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.customerName}</span>
                    <span className="text-slate-400">on</span>
                    <span className="text-purple-700 font-semibold">{r.productName}</span>
                    <span className="text-purple-700 font-mono">({r.rating}★)</span>
                  </div>
                  <p className="font-semibold text-slate-800">{r.headline}</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed max-w-2xl">{r.comment}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    r.status === 'approved' ? 'bg-purple-50 text-purple-800 border border-purple-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    {r.status}
                  </span>
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleModerateReview(r.id, 'approved')}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleModerateReview(r.id, 'rejected')}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. STORE SETTINGS */}
      {activeTab === 'settings' && storeSettings && (
        <form onSubmit={handleSaveSettings} className="space-y-8 max-w-3xl">
          
          {/* Announcement Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
              Announcement Bar
            </h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold">
                <input
                  type="checkbox"
                  checked={storeSettings.announcementBar?.enabled}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    announcementBar: { ...storeSettings.announcementBar, enabled: e.target.checked }
                  })}
                  className="accent-purple-600"
                />
                <span>Enable Announcement Bar across all pages</span>
              </label>

              <div>
                <label className="block text-slate-600 mb-1">Promotional Text</label>
                <input
                  type="text"
                  value={storeSettings.announcementBar?.text || ''}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    announcementBar: { ...storeSettings.announcementBar, text: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Shipping Rates */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
              Delivery Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">Free Delivery Threshold (PKR)</label>
                <input
                  type="number"
                  value={storeSettings.shipping?.freeShippingThreshold || 5000}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    shipping: { ...storeSettings.shipping, freeShippingThreshold: Number(e.target.value) }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Standard Delivery Fee (PKR)</label>
                <input
                  type="number"
                  value={storeSettings.shipping?.standardRate || 350}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    shipping: { ...storeSettings.shipping, standardRate: Number(e.target.value) }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider font-heading">
              Business Contact Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 mb-1">WhatsApp / Phone</label>
                <input
                  type="text"
                  value={storeSettings.contact?.phone || ''}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    contact: { ...storeSettings.contact, phone: e.target.value, whatsapp: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Store Email</label>
                <input
                  type="email"
                  value={storeSettings.contact?.email || ''}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    contact: { ...storeSettings.contact, email: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1">Warehouse Physical Address</label>
                <input
                  type="text"
                  value={storeSettings.contact?.address || ''}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    contact: { ...storeSettings.contact, address: e.target.value }
                  })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md shadow-purple-600/30"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration Changes</span>
          </button>
        </form>
      )}

    </div>
  );
};
