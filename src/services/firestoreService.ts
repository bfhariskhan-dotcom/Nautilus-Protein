import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, Category, Brand, Order, CustomerReview, Coupon, WebsiteSettings, OrderStatus } from '../types';

const PRODUCTS_COL = 'products';
const CATEGORIES_COL = 'categories';
const BRANDS_COL = 'brands';
const ORDERS_COL = 'orders';
const REVIEWS_COL = 'reviews';
const COUPONS_COL = 'coupons';
const SETTINGS_COL = 'settings';
const SUBSCRIBERS_COL = 'subscribers';

// Helper to sanitize Firestore data (remove undefined fields which Firestore rejects)
function sanitizeForFirestore<T extends Record<string, any>>(data: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        clean[key] = value.map(item =>
          typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        clean[key] = sanitizeForFirestore(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean;
}

// ---------------- PRODUCTS ----------------

export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const colRef = collection(db, PRODUCTS_COL);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return [];
    }
    const list: Product[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...(docSnap.data() as Product), id: docSnap.id });
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, PRODUCTS_COL);
    return [];
  }
}

export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (error: Error) => void
) {
  const colRef = collection(db, PRODUCTS_COL);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Product[] = [];
      snapshot.forEach(docSnap => {
        list.push({ ...(docSnap.data() as Product), id: docSnap.id });
      });
      onUpdate(list);
    },
    (err) => {
      try {
        handleFirestoreError(err, OperationType.GET, PRODUCTS_COL);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

export async function saveProductToFirestore(product: Product): Promise<Product> {
  const productId = product.id || `prod-${Date.now()}`;
  const path = `${PRODUCTS_COL}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COL, productId);
    const now = new Date().toISOString();
    const payload = sanitizeForFirestore({
      ...product,
      id: productId,
      updatedAt: now,
      createdAt: (product as any).createdAt || now
    });
    await setDoc(docRef, payload, { merge: true });
    return { ...product, id: productId } as Product;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `${PRODUCTS_COL}/${productId}`;
  try {
    const docRef = doc(db, PRODUCTS_COL, productId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ---------------- CATEGORIES ----------------

export async function getCategoriesFromFirestore(): Promise<Category[]> {
  try {
    const colRef = collection(db, CATEGORIES_COL);
    const snapshot = await getDocs(colRef);
    const list: Category[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...(docSnap.data() as Category), id: docSnap.id });
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, CATEGORIES_COL);
    return [];
  }
}

export async function saveCategoryToFirestore(category: Category): Promise<Category> {
  const catId = category.id || `cat-${Date.now()}`;
  const path = `${CATEGORIES_COL}/${catId}`;
  try {
    const docRef = doc(db, CATEGORIES_COL, catId);
    const payload = sanitizeForFirestore({ ...category, id: catId });
    await setDoc(docRef, payload, { merge: true });
    return { ...category, id: catId };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteCategoryFromFirestore(catId: string): Promise<void> {
  const path = `${CATEGORIES_COL}/${catId}`;
  try {
    const docRef = doc(db, CATEGORIES_COL, catId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ---------------- BRANDS ----------------

export async function getBrandsFromFirestore(): Promise<Brand[]> {
  try {
    const colRef = collection(db, BRANDS_COL);
    const snapshot = await getDocs(colRef);
    const list: Brand[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...(docSnap.data() as Brand), id: docSnap.id });
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, BRANDS_COL);
    return [];
  }
}

export async function saveBrandToFirestore(brand: Brand): Promise<Brand> {
  const brandId = brand.id || `brand-${Date.now()}`;
  const path = `${BRANDS_COL}/${brandId}`;
  try {
    const docRef = doc(db, BRANDS_COL, brandId);
    const payload = sanitizeForFirestore({ ...brand, id: brandId });
    await setDoc(docRef, payload, { merge: true });
    return { ...brand, id: brandId };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteBrandFromFirestore(brandId: string): Promise<void> {
  const path = `${BRANDS_COL}/${brandId}`;
  try {
    const docRef = doc(db, BRANDS_COL, brandId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ---------------- ORDERS ----------------

export async function getOrdersFromFirestore(): Promise<Order[]> {
  try {
    const colRef = collection(db, ORDERS_COL);
    const snapshot = await getDocs(colRef);
    const list: Order[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...(docSnap.data() as Order), id: docSnap.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, ORDERS_COL);
    return [];
  }
}

export async function saveOrderToFirestore(order: Order): Promise<Order> {
  const orderId = order.id || `ord-${Date.now()}`;
  const path = `${ORDERS_COL}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    const payload = sanitizeForFirestore({ ...order, id: orderId });
    await setDoc(docRef, payload);
    return { ...order, id: orderId };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  orderStatus: OrderStatus,
  paymentStatus?: string
): Promise<void> {
  const path = `${ORDERS_COL}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    const updates: any = { orderStatus, updatedAt: new Date().toISOString() };
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const path = `${ORDERS_COL}/${orderId}`;
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ---------------- REVIEWS ----------------

export async function getReviewsFromFirestore(productId?: string): Promise<CustomerReview[]> {
  try {
    const colRef = collection(db, REVIEWS_COL);
    const snapshot = await getDocs(colRef);
    let list: CustomerReview[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...(docSnap.data() as CustomerReview), id: docSnap.id });
    });
    if (productId) {
      list = list.filter(r => r.productId === productId);
    }
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, REVIEWS_COL);
    return [];
  }
}

export async function saveReviewToFirestore(review: CustomerReview): Promise<CustomerReview> {
  const revId = review.id || `rev-${Date.now()}`;
  const path = `${REVIEWS_COL}/${revId}`;
  try {
    const docRef = doc(db, REVIEWS_COL, revId);
    const payload = sanitizeForFirestore({ ...review, id: revId });
    await setDoc(docRef, payload);
    return { ...review, id: revId };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
    throw err;
  }
}

export async function updateReviewStatusInFirestore(reviewId: string, status: string): Promise<void> {
  const path = `${REVIEWS_COL}/${reviewId}`;
  try {
    const docRef = doc(db, REVIEWS_COL, reviewId);
    await updateDoc(docRef, { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
    throw err;
  }
}

export async function deleteReviewFromFirestore(reviewId: string): Promise<void> {
  const path = `${REVIEWS_COL}/${reviewId}`;
  try {
    const docRef = doc(db, REVIEWS_COL, reviewId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ---------------- COUPONS ----------------

export async function getCouponsFromFirestore(): Promise<Coupon[]> {
  try {
    const colRef = collection(db, COUPONS_COL);
    const snapshot = await getDocs(colRef);
    const list: Coupon[] = [];
    snapshot.forEach(docSnap => {
      list.push({ ...(docSnap.data() as Coupon), id: docSnap.id });
    });
    return list;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, COUPONS_COL);
    return [];
  }
}

export async function saveCouponToFirestore(coupon: Coupon): Promise<Coupon> {
  const couponId = coupon.id || `coup-${Date.now()}`;
  const path = `${COUPONS_COL}/${couponId}`;
  try {
    const docRef = doc(db, COUPONS_COL, couponId);
    const payload = sanitizeForFirestore({ ...coupon, id: couponId });
    await setDoc(docRef, payload);
    return { ...coupon, id: couponId };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

export async function deleteCouponFromFirestore(couponId: string): Promise<void> {
  const path = `${COUPONS_COL}/${couponId}`;
  try {
    const docRef = doc(db, COUPONS_COL, couponId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
    throw err;
  }
}

// ---------------- SETTINGS ----------------

export async function getSettingsFromFirestore(): Promise<WebsiteSettings | null> {
  const path = `${SETTINGS_COL}/general`;
  try {
    const docRef = doc(db, SETTINGS_COL, 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as WebsiteSettings;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveSettingsToFirestore(settings: WebsiteSettings): Promise<WebsiteSettings> {
  const path = `${SETTINGS_COL}/general`;
  try {
    const docRef = doc(db, SETTINGS_COL, 'general');
    const payload = sanitizeForFirestore(settings);
    await setDoc(docRef, payload, { merge: true });
    return settings;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
    throw err;
  }
}

// ---------------- SEED INITIAL DATA IF EMPTY ----------------

export async function seedInitialFirestoreData(initialData: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  settings: WebsiteSettings;
  coupons?: Coupon[];
  reviews?: CustomerReview[];
}): Promise<void> {
  try {
    const existingProducts = await getDocs(collection(db, PRODUCTS_COL));
    if (existingProducts.empty && initialData.products && initialData.products.length > 0) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of initialData.products) {
        await setDoc(doc(db, PRODUCTS_COL, prod.id), sanitizeForFirestore(prod));
      }
    }

    const existingCategories = await getDocs(collection(db, CATEGORIES_COL));
    if (existingCategories.empty && initialData.categories && initialData.categories.length > 0) {
      console.log('Seeding initial categories into Firestore...');
      for (const cat of initialData.categories) {
        await setDoc(doc(db, CATEGORIES_COL, cat.id), sanitizeForFirestore(cat));
      }
    }

    const existingBrands = await getDocs(collection(db, BRANDS_COL));
    if (existingBrands.empty && initialData.brands && initialData.brands.length > 0) {
      console.log('Seeding initial brands into Firestore...');
      for (const brand of initialData.brands) {
        await setDoc(doc(db, BRANDS_COL, brand.id), sanitizeForFirestore(brand));
      }
    }

    const settingsDoc = await getDoc(doc(db, SETTINGS_COL, 'general'));
    if (!settingsDoc.exists() && initialData.settings) {
      console.log('Seeding initial website settings into Firestore...');
      await setDoc(doc(db, SETTINGS_COL, 'general'), sanitizeForFirestore(initialData.settings));
    }
  } catch (err) {
    console.warn('Note on Firestore seeding:', err);
  }
}
