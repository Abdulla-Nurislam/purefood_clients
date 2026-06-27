import { Home, Grid3X3, Store, ShoppingCart, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HomeScreen } from './HomeScreen';
import { CatalogScreen } from './CatalogScreen';
import { SellersScreen } from './SellersScreen';
import { SearchScreen } from './SearchScreen';
import { ProductScreen } from './ProductScreen';
import { CartScreen } from './CartScreen';
import { OrdersScreen } from './OrdersScreen';
import { OrderDetailScreen } from './OrderDetailScreen';
import { ProfileScreen } from './ProfileScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { SettingsScreen } from './SettingsScreen';
import { FavoritesScreen } from './FavoritesScreen';
import { MyReviewsScreen } from './MyReviewsScreen';
import { SubscriptionsScreen } from './SubscriptionsScreen';
import { LoyaltyScreen } from './LoyaltyScreen';
import { SellerProfileScreen } from './SellerProfileScreen';
import { WriteReviewScreen } from './WriteReviewScreen';

const tabs = [
  { path: '/home', icon: Home, label: 'Главная' },
  { path: '/catalog', icon: Grid3X3, label: 'Каталог' },
  { path: '/sellers', icon: Store, label: 'Продавцы' },
  { path: '/cart', icon: ShoppingCart, label: 'Корзина' },
  { path: '/profile', icon: User, label: 'Профиль' },
];

const hiddenNavRoutes = [
  '/product', '/order-detail', '/notifications', '/settings',
  '/favorites', '/my-reviews', '/subscriptions', '/loyalty',
  '/search', '/seller-detail', '/orders', '/write-review',
];

function CurrentScreen() {
  const { currentRoute } = useApp();
  switch (currentRoute) {
    case '/home': return <HomeScreen />;
    case '/catalog': return <CatalogScreen />;
    case '/sellers': return <SellersScreen />;
    case '/search': return <SearchScreen />;
    case '/product': return <ProductScreen />;
    case '/cart': return <CartScreen />;
    case '/orders': return <OrdersScreen />;
    case '/order-detail': return <OrderDetailScreen />;
    case '/profile': return <ProfileScreen />;
    case '/notifications': return <NotificationsScreen />;
    case '/settings': return <SettingsScreen />;
    case '/favorites': return <FavoritesScreen />;
    case '/my-reviews': return <MyReviewsScreen />;
    case '/subscriptions': return <SubscriptionsScreen />;
    case '/loyalty': return <LoyaltyScreen />;
    case '/seller-detail': return <SellerProfileScreen />;
    case '/write-review': return <WriteReviewScreen />;
    default: return <HomeScreen />;
  }
}

export function MobileShell() {
  const { navigate, currentRoute, cart } = useApp();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const showNav = !hiddenNavRoutes.includes(currentRoute);

  // Determine active tab - map sub-routes back to their parent tab
  const getActiveTab = () => {
    if (currentRoute === '/home') return '/home';
    if (currentRoute === '/catalog') return '/catalog';
    if (currentRoute === '/sellers') return '/sellers';
    if (currentRoute === '/cart') return '/cart';
    if (currentRoute === '/profile') return '/profile';
    return '';
  };
  const activeTab = getActiveTab();

  return (
    <div className="flex justify-center bg-[#e8ede6] min-h-screen">
      <div className="w-full max-w-[430px] bg-background min-h-screen flex flex-col relative shadow-xl">
        <div className={`flex-1 overflow-y-auto ${showNav ? 'pb-20' : ''}`}>
          <CurrentScreen />
        </div>
        {showNav && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border flex justify-around py-2 z-50">
            {tabs.map(tab => {
              const active = activeTab === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 relative min-w-[56px] ${active ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-primary/10' : ''}`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px]">{tab.label}</span>
                  {tab.path === '/cart' && cartCount > 0 && (
                    <span className="absolute top-0 right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}