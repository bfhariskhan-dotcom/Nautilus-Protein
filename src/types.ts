export interface ProductVariant {
  flavor?: string;
  weight?: string;
  priceModifier?: number;
}

export interface NutritionFact {
  label: string;
  amount: string;
  dailyValue?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: 'whey-protein' | 'mass-gainers' | 'creatine' | 'pre-workout' | 'amino-acids' | 'vitamins' | 'accessories';
  categoryName: string;
  price: number; // in PKR
  salePrice?: number; // in PKR
  weight: string;
  servings: number | string;
  flavors: string[];
  weights?: string[];
  stock: number;
  inStock: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  image: string;
  gallery?: string[];
  shortDescription: string;
  description: string;
  nutritionFacts: NutritionFact[];
  ingredients: string[];
  directions: string;
  warnings: string;
  goal: 'muscle-building' | 'strength' | 'recovery' | 'vitality' | 'weight-management';
  goalName: string;
  rating: number;
  reviewCount: number;
  tags?: string[];
  headline?: string;
  ratio?: string;
  servingSize?: string;
  highlights?: string[];
  whoIsItFor?: string[];
  faqs?: { question: string; answer: string }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  featured?: boolean;
}

export interface CartItem {
  id: string; // unique key combining productId + flavor + weight
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  originalPrice?: number;
  flavor?: string;
  weight?: string;
  quantity: number;
  maxStock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  flavor?: string;
  weight?: string;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'cod' | 'bank_transfer' | 'jazzcash' | 'easypaisa';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  headline: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  isActive: boolean;
  usageCount: number;
}

export interface WebsiteSettings {
  announcementBar: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  shipping: {
    freeShippingThreshold: number; // in PKR, e.g. 5000
    standardRate: number; // in PKR, e.g. 350
    estimatedDays: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  payments: {
    codEnabled: boolean;
    bankTransferEnabled: boolean;
    jazzcashEnabled: boolean;
    easypaisaEnabled: boolean;
    bankDetails: {
      bankName: string;
      accountTitle: string;
      accountNumber: string;
      iban: string;
    };
    jazzcashDetails: {
      accountTitle: string;
      accountNumber: string;
    };
    easypaisaDetails: {
      accountTitle: string;
      accountNumber: string;
    };
  };
}
