import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, Product, Seller, Order, Review, Subscription, Notification, products as mockProducts, mockSellers as mockSellersData, mockOrders, mockReviews, mockSubscriptions, mockNotifications } from '../data/mock-data';
import { fetchProducts, fetchSellers } from '../../lib/api';

interface AppState {
  // Auth & onboarding
  isOnboarded: boolean;
  setOnboarded: (v: boolean) => void;
  showSplash: boolean;
  setShowSplash: (v: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  userName: string;
  setUserName: (v: string) => void;
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
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnboarded, setOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Алматы');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loyaltyPoints, setLoyaltyPoints] = useState(850);
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);
  const [allSellers, setAllSellers] = useState<Seller[]>(mockSellersData);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [routeHistory, setRouteHistory] = useState<string[]>(['/home']);

  // Load real data from Supabase on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [prods, sels] = await Promise.all([fetchProducts(), fetchSellers()]);
        if (mounted) {
          if (prods.length > 0) setAllProducts(prods);
          if (sels.length > 0) setAllSellers(sels);
        }
      } catch (err) {
        console.error('Failed to load data from Supabase, using mock data:', err);
      } finally {
        if (mounted) setIsLoadingData(false);
      }
    }
    loadData();
    return () => { mounted = false; };
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

  return (
    <AppContext.Provider value={{
      showSplash, setShowSplash,
      isOnboarded, setOnboarded,
      isLoggedIn, setIsLoggedIn,
      userName, setUserName,
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
