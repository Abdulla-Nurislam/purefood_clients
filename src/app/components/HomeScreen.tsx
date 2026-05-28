import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { catalogCategories, Product } from '../data/mock-data';
import { ShieldCheck, Star, MapPin, Bell, Gift, Heart, Search, ChevronRight, Award } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const badgeColors: Record<string, { bg: string; text: string }> = {
  'Проверенный состав': { bg: '#E8F5E9', text: '#2d7a3a' },
  'Без Е-добавок': { bg: '#FFF8E1', text: '#d97706' },
  '100% Натурально': { bg: '#E8F5E9', text: '#2d7a3a' },
  'Органик': { bg: '#E8F5E9', text: '#2d7a3a' },
  'Веган': { bg: '#F3E5F5', text: '#7b1fa2' },
  'Без сахара': { bg: '#FFF3E0', text: '#e65100' },
  'Без лактозы': { bg: '#E3F2FD', text: '#1565c0' },
  'Высокий белок': { bg: '#FCE4EC', text: '#c62828' },
  'Халяль': { bg: '#E0F2F1', text: '#00695c' },
  'Фермерское': { bg: '#FFFDE7', text: '#f57f17' },
};

const promobanners = [
  {
    id: 'b1',
    title: 'Скидка 20% на мёд',
    subtitle: 'Только до конца недели',
    image: 'https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    gradient: 'linear-gradient(135deg, #2d7a3a 0%, #43a057 100%)',
    tag: '/catalog',
  },
  {
    id: 'b2',
    title: 'Суперфуды от НатурНат',
    subtitle: 'Органика с доставкой',
    image: 'https://images.unsplash.com/photo-1717002997856-8f68e644fbd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    gradient: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
    tag: '/catalog',
  },
  {
    id: 'b3',
    title: 'Фермерское мясо',
    subtitle: 'Без гормонов и антибиотиков',
    image: 'https://images.unsplash.com/photo-1641893638805-5942e0afbec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    gradient: 'linear-gradient(135deg, #bf360c 0%, #e64a19 100%)',
    tag: '/catalog',
  },
];

function BadgeChip({ badge }: { badge: string }) {
  const colors = badgeColors[badge] || { bg: '#E8F5E9', text: '#2d7a3a' };
  return (
    <span
      className="text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {badge}
    </span>
  );
}

function ProductCard({ product, onClick, onFavorite, isFav }: {
  product: Product;
  onClick: () => void;
  onFavorite: () => void;
  isFav: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden relative">
      <button onClick={onClick} className="w-full text-left">
        <div className="relative aspect-square bg-muted">
          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {product.supplierVerified && (
            <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-1">
              <ShieldCheck className="w-3 h-3" />
            </div>
          )}
          {product.oldPrice && (
            <div className="absolute top-2 right-8 bg-red-500 text-white rounded-full px-2 py-0.5 text-[10px]">
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="text-sm line-clamp-2 mb-1">{product.name}</p>
          {/* Seller rating */}
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">{product.supplierRating}</span>
            <span className="text-xs text-muted-foreground">· {product.supplier}</span>
          </div>
          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-1.5">
              {product.badges.slice(0, 2).map((badge: string) => (
                <BadgeChip key={badge} badge={badge} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm">{product.price.toLocaleString()} ₸</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">{product.oldPrice.toLocaleString()} ₸</span>
            )}
          </div>
        </div>
      </button>
      <button
        onClick={onFavorite}
        className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center z-10"
      >
        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
      </button>
    </div>
  );
}

export function HomeScreen() {
  const { userName, city, navigate, unreadCount, loyaltyPoints, isFavorite, toggleFavorite, selectedPreferences, allProducts, allSellers } = useApp();

  const recommended = allProducts.filter(p =>
    selectedPreferences.length === 0 || p.tags.some(t => selectedPreferences.includes(t))
  ).slice(0, 6);

  const [recentlyViewed, setRecentlyViewed] = useState<Array<{ id: string; name: string; price: number; image: string; supplier: string }>>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem('purefood_recently_viewed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentlyViewed(parsed);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="flex flex-col">
      {/* Sticky top area */}
      <div className="sticky top-0 z-40 bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3">
          <div>
            <p className="text-muted-foreground text-xs">Добро пожаловать{userName ? `, ${userName}` : ''} 👋</p>
            <div className="flex items-center gap-1 text-sm text-primary mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{city}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/loyalty')} className="h-9 bg-amber-50 border border-amber-200 rounded-full px-3 flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-700">{loyaltyPoints} баллов</span>
            </button>
            <button onClick={() => navigate('/notifications')} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center relative">
              <Bell className="w-4.5 h-4.5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-2.5 bg-input-background border border-border rounded-2xl px-4 py-3 text-left"
          >
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground text-sm">Поиск товаров и продавцов...</span>
          </button>
        </div>
      </div>

      <div className="px-4 pb-6 space-y-5">
        {/* Promo banners */}
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {promobanners.map(banner => (
            <button
              key={banner.id}
              onClick={() => navigate(banner.tag)}
              className="min-w-[280px] h-36 rounded-2xl overflow-hidden relative flex-shrink-0 text-left"
              style={{ background: banner.gradient }}
            >
              <div className="absolute inset-0 opacity-30">
                <img src={banner.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                <p className="text-white text-xs opacity-80">{banner.subtitle}</p>
                <p className="text-white mt-0.5">{banner.title}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-white/80 text-xs">Смотреть</span>
                  <ChevronRight className="w-3 h-3 text-white/80" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Trust banner */}
        <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm">Гарантия безопасности</p>
            <p className="text-xs opacity-80 mt-0.5">Все товары проходят лабораторную проверку</p>
          </div>
        </div>

        {/* Catalog categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>Категории</h3>
            <button onClick={() => navigate('/catalog')} className="text-sm text-primary flex items-center gap-1">
              Все <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {catalogCategories.slice(0, 8).map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate('/catalog')}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all active:scale-95"
                style={{ backgroundColor: cat.color, borderColor: cat.borderColor }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[10px] text-center leading-tight text-muted-foreground line-clamp-2">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured sellers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>Топ продавцов</h3>
            <button onClick={() => navigate('/sellers')} className="text-sm text-primary flex items-center gap-1">
              Все <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4">
            {allSellers.filter(s => s.verified).slice(0, 4).map(seller => (
              <button
                key={seller.id}
                onClick={() => navigate(`/seller/${seller.id}`)}
                className="flex-shrink-0 w-36 bg-card rounded-2xl border border-border overflow-hidden text-left"
              >
                <div className="h-20 relative overflow-hidden">
                  <ImageWithFallback src={seller.image} alt={seller.name} className="w-full h-full object-cover" />
                  {seller.verified && (
                    <div className="absolute top-1.5 right-1.5 bg-primary text-white rounded-full p-0.5">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs line-clamp-1">{seller.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recently viewed */}
        {recentlyViewed.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3>Вы недавно смотрели</h3>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {recentlyViewed.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="flex-shrink-0 w-32 bg-card rounded-2xl border border-border overflow-hidden text-left"
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs line-clamp-2 leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.supplier}</p>
                    <p className="text-xs text-primary mt-1">{item.price.toLocaleString()} ₸</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recommended products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>Рекомендуем для вас</h3>
            <button onClick={() => navigate('/catalog')} className="text-sm text-primary flex items-center gap-1">
              Все <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommended.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.id}`)}
                onFavorite={() => toggleFavorite(product.id)}
                isFav={isFavorite(product.id)}
              />
            ))}
          </div>
        </div>

        {/* Badges legend */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-primary" />
            <p className="text-sm">Что означают бейджи</p>
          </div>
          <div className="space-y-2">
            {[
              { badge: 'Проверенный состав', desc: 'Прошёл лабораторные тесты' },
              { badge: 'Без Е-добавок', desc: 'Нет синтетических добавок' },
              { badge: '100% Натурально', desc: 'Только природные ингредиенты' },
            ].map(item => (
              <div key={item.badge} className="flex items-center gap-2">
                <BadgeChip badge={item.badge} />
                <span className="text-xs text-muted-foreground">— {item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}