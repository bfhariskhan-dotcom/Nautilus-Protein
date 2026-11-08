import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CursorGlow } from './components/CursorGlow';
import { ScrollProgress } from './components/ScrollProgress';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqsPage } from './pages/FaqsPage';
import { PolicyPages } from './pages/PolicyPages';
import { WishlistPage } from './pages/WishlistPage';
import { AdminPanel } from './pages/AdminPanel';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { activePage, toasts } = useStore();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
      case 'category':
      case 'brand':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'confirmation':
        return <OrderConfirmationPage />;
      case 'track':
        return <OrderTrackingPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faqs':
        return <FaqsPage />;
      case 'shipping':
        return <PolicyPages type="shipping" />;
      case 'refund':
        return <PolicyPages type="refund" />;
      case 'privacy':
        return <PolicyPages type="privacy" />;
      case 'terms':
        return <PolicyPages type="terms" />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-purple-600 selection:text-white pb-16 md:pb-0">
      
      {/* 1. Cursor & Mouse Interactive Effects */}
      <CursorGlow />

      {/* 2. Scroll Progress & Back-to-Top Effects */}
      <ScrollProgress />

      {/* 3. Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-md shadow-xl flex items-center gap-3 text-xs animate-in slide-in-from-right-4 duration-200 ${
              toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100'
                : toast.type === 'info'
                ? 'bg-white border-slate-200 text-slate-700 shadow-slate-100'
                : 'bg-white border-purple-200 text-purple-950 shadow-purple-100'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            )}
            <span className="flex-1 font-semibold">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* 4. Top Navigation Bar with Continuous Marquee */}
      <Header />

      {/* 5. Main Content View */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Floating & Modal Interactive Layers */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <WhatsAppButton />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainRouter />
    </StoreProvider>
  );
}
