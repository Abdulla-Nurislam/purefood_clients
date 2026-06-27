import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, Product, Seller, Order, Review, Subscription, Notification } from '../data/mock-data';
import { fetchProducts, fetchSellers, fetchClientOrders } from '../../lib/api';
import { supabase } from '../../lib/supabase';

interface AppState {
  // Auth & onboarding
  isOnboarded: boolean;
  setOnboarded: (v: boolean) => void;
  showSplash: boolean;
  setShowSplash: (v: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  userId: string | null;
  setUserId: (v: string | null) => void;
  userName: string;
  setUserName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  avatarUrl: string;
  setAvatarUrl: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  selectedPreferences: string[];
  setSelectedPreferences: (v: string[]) => void;
  excludedAllergens: string[];
  setExcludedAllergens: (v: string[]) => void;

  // Cart
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  cancelOrder: (id: string) => void;
  rateOrder: (id: string, rating: number) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Reviews
  reviews: Review[];
  addReview: (review: Review) => void;

  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (sub: Subscription) => void;
  toggleSubscription: (id: string) => void;
  removeSubscription: (id: string) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  // Loyalty
  loyaltyPoints: number;
  addLoyaltyPoints: (pts: number) => void;

  // Live data from Supabase
  allProducts: Product[];
  allSellers: Seller[];
  isLoadingData: boolean;

  // Navigation
  currentRoute: string;
  routeParams: Record<string, string>;
  navigate: (path: string) => void;
  goBack: () => void;

  // Account deletion
  deleteAccount: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarded, setOnboardedState] = useState(() => {
    try {
      return localStorage.getItem('purefood_onboarded') === 'true';
    } catch {
      return false;
    }
  });

  const setOnboarded = (v: boolean) => {
    setOnboardedState(v);
    localStorage.setItem('purefood_onboarded', v ? 'true' : 'false');
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Алматы');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('purefood_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('purefood_cart', JSON.stringify(cart));
  }, [cart]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allSellers, setAllSellers] = useState<Seller[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [routeHistory, setRouteHistory] = useState<string[]>(['/home']);

  // Load real data from Supabase on mount and listen to changes
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [prods, sels] = await Promise.all([fetchProducts(), fetchSellers()]);
        console.log('[AppContext] Loaded products:', prods.length, 'sellers:', sels.length);
        if (mounted) {
          // Always update — even empty array means "no active products"
          setAllProducts(prods);
          const updatedSellers = sels.map(s => ({
            ...s,
            productCount: prods.filter(p => p.supplierId === s.id).length
          }));
          setAllSellers(updatedSellers);
        }
      } catch (err) {
        console.error('[AppContext] Failed to load data from Supabase:', err);
      } finally {
        if (mounted) setIsLoadingData(false);
      }
    }
    loadData();

    // Subscribe to realtime changes in products and sellers
    const channel = supabase.channel('public-data-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        if (mounted) loadData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sellers' }, () => {
        if (mounted) loadData();
      })
      .subscribe();

    return () => { 
      mounted = false; 
      supabase.removeChannel(channel);
    };
  }, []);

  // Load real orders when user is authenticated
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    fetchClientOrders(userId).then(realOrders => {
      if (mounted && realOrders.length > 0) {
        setOrders(realOrders);
      }
    }).catch(err => {
      console.error('Failed to load orders from Supabase:', err);
    });
    return () => { mounted = false; };
  }, [userId]);

  // Listen to Supabase Auth state changes (for Google Login)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        if (session.user.app_metadata.provider === 'google') {
          const email = session.user.email || '';
          const name = session.user.user_metadata?.full_name || email.split('@')[0] || "Пользователь Google";
          const avatar = session.user.user_metadata?.avatar_url || '';
          setUserId(session.user.id);
          setUserName(name);
          setEmail(email);
          setAvatarUrl(avatar);
          setIsLoggedIn(true);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const currentFullRoute = routeHistory[routeHistory.length - 1] || '/home';

  let currentRoute = currentFullRoute;
  let routeParams: Record<string, string> = {};
  if (currentFullRoute.startsWith('/product/')) {
    currentRoute = '/product';
    routeParams = { id: currentFullRoute.replace('/product/', '') };
  } else if (currentFullRoute.startsWith('/order/')) {
    currentRoute = '/order-detail';
    routeParams = { id: currentFullRoute.replace('/order/', '') };
  } else if (currentFullRoute.startsWith('/seller/')) {
    currentRoute = '/seller-detail';
    routeParams = { id: currentFullRoute.replace('/seller/', '') };
  } else if (currentFullRoute.startsWith('/write-review/')) {
    currentRoute = '/write-review';
    routeParams = { orderId: currentFullRoute.replace('/write-review/', '') };
  }

  const navigate = useCallback((path: string) => {
    setRouteHistory(prev => [...prev, path]);
  }, []);

  const goBack = useCallback(() => {
    setRouteHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }, []);

  // Cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Orders
  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);
  const cancelOrder = (id: string) => setOrders(prev => prev.map(o =>
    o.id === id ? { ...o, status: 'cancelled' as const, trackingSteps: [...o.trackingSteps.filter(s => s.done), { label: 'Отменён покупателем', done: true, time: '30 мар, ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0') }] } : o
  ));
  const rateOrder = (id: string, rating: number) => setOrders(prev => prev.map(o =>
    o.id === id ? { ...o, rated: true, rating } : o
  ));

  // Favorites
  const toggleFavorite = (id: string) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  const isFavorite = (id: string) => favorites.includes(id);

  // Reviews
  const addReview = (review: Review) => setReviews(prev => [review, ...prev]);

  // Subscriptions
  const addSubscription = (sub: Subscription) => setSubscriptions(prev => [...prev, sub]);
  const toggleSubscription = (id: string) => setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const removeSubscription = (id: string) => setSubscriptions(prev => prev.filter(s => s.id !== id));

  // Notifications
  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  // Loyalty
  const addLoyaltyPoints = (pts: number) => setLoyaltyPoints(prev => prev + pts);

  // Account deletion — full session cleanup
  const deleteAccount = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('signOut error (ignored):', err);
    }
    // Clear all purefood_ keys from localStorage
    try {
      const keysToRemove = Object.keys(localStorage).filter(k => k.startsWith('purefood_'));
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
    // Reset all auth and user state
    setIsLoggedIn(false);
    setUserId(null);
    setUserName('');
    setEmail('');
    setAvatarUrl('');
    setPhone('');
    setCity('Алматы');
    setSelectedPreferences([]);
    setExcludedAllergens([]);
    setCart([]);
    setOrders([]);
    setFavorites([]);
    setReviews([]);
    setSubscriptions([]);
    setNotifications([]);
    setLoyaltyPoints(0);
    setRouteHistory(['/home']);
    // Reset onboarding so the next open prompts fresh registration
    setOnboardedState(false);
  };

  return (
    <AppContext.Provider value={{
      showSplash, setShowSplash,
      isOnboarded, setOnboarded,
      isLoggedIn, setIsLoggedIn,
      userId, setUserId,
      userName, setUserName,
      email, setEmail,
      avatarUrl, setAvatarUrl,
      phone, setPhone,
      city, setCity,
      selectedPreferences, setSelectedPreferences,
      excludedAllergens, setExcludedAllergens,
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal,
      orders, addOrder, cancelOrder, rateOrder,
      favorites, toggleFavorite, isFavorite,
      reviews, addReview,
      subscriptions, addSubscription, toggleSubscription, removeSubscription,
      notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
      loyaltyPoints, addLoyaltyPoints,
      allProducts, allSellers, isLoadingData,
      currentRoute, routeParams, navigate, goBack,
      deleteAccount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
