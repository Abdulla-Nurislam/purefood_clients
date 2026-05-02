import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShieldCheck, Star, MapPin, Package, ChevronRight, Filter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const badgeColors: Record<string, { bg: string; text: string }> = {
  'Проверенный состав': { bg: '#E8F5E9', text: '#2d7a3a' },
  'Без Е-добавок': { bg: '#FFF8E1', text: '#d97706' },
  '100% Натурально': { bg: '#E8F5E9', text: '#2d7a3a' },
  'Органик': { bg: '#E8F5E9', text: '#2d7a3a' },
  'Веган': { bg: '#F3E5F5', text: '#7b1fa2' },
  'Фермерское': { bg: '#FFFDE7', text: '#f57f17' },
  'Без ГМО': { bg: '#E0F7FA', text: '#006064' },
  'Без консервантов': { bg: '#FFF3E0', text: '#e65100' },
  'Халяль': { bg: '#E0F2F1', text: '#00695c' },
};

export function SellersScreen() {
  const { navigate, allSellers } = useApp();
  const [query, setQuery] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'products'>('rating');

  const filtered = allSellers
    .filter(s => {
      if (onlyVerified && !s.verified) return false;
      if (query && !s.name.toLowerCase().includes(query.toLowerCase()) && !s.location.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.productCount - a.productCount;
    });

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background">
        <div className="px-4 pt-5 pb-3">
          <h2 className="mb-3">Продавцы</h2>

          {/* Search */}
          <div className="flex items-center gap-2 bg-input-background border border-border rounded-2xl px-3 py-2.5 mb-3">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск продавцов..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          {/* Filter row */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs whitespace-nowrap flex-shrink-0 transition-all ${
                onlyVerified ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              Верифицированные
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-3 py-1.5 rounded-full border text-xs whitespace-nowrap flex-shrink-0 transition-all ${
                sortBy === 'rating' ? 'bg-secondary text-foreground border-primary/30' : 'border-border text-muted-foreground'
              }`}
            >
              По рейтингу
            </button>
            <button
              onClick={() => setSortBy('products')}
              className={`px-3 py-1.5 rounded-full border text-xs whitespace-nowrap flex-shrink-0 transition-all ${
                sortBy === 'products' ? 'bg-secondary text-foreground border-primary/30' : 'border-border text-muted-foreground'
              }`}
            >
              По товарам
            </button>
          </div>
        </div>
      </div>

      {/* Sellers list */}
      <div className="px-4 pb-6 space-y-4">
        {/* Stats row */}
        <div className="flex gap-2">
          <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
            <p className="text-lg text-primary">{allSellers.filter(s => s.verified).length}</p>
            <p className="text-xs text-muted-foreground">Верифицировано</p>
          </div>
          <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
            <p className="text-lg text-primary">{allSellers.length}</p>
            <p className="text-xs text-muted-foreground">Всего продавцов</p>
          </div>
          <div className="flex-1 bg-secondary rounded-xl p-3 text-center">
            <p className="text-lg text-primary">{allSellers.reduce((s, sel) => s + sel.productCount, 0)}</p>
            <p className="text-xs text-muted-foreground">Товаров</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Найдено: {filtered.length} продавцов</p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
              <Search className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">Продавцы не найдены</p>
          </div>
        ) : (
          filtered.map(seller => (
            <button
              key={seller.id}
              onClick={() => navigate(`/seller/${seller.id}`)}
              className="w-full bg-card border border-border rounded-2xl overflow-hidden text-left active:scale-[0.99] transition-transform"
            >
              {/* Cover image */}
              <div className="h-28 relative overflow-hidden">
                <ImageWithFallback src={seller.image} alt={seller.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Verified badge */}
                {seller.verified && (
                  <div className="absolute top-2 left-2 bg-primary text-white rounded-full px-2 py-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[10px]">Верифицирован</span>
                  </div>
                )}

                {/* Rating overlay */}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-0.5 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{seller.rating}</span>
                  <span className="text-[10px] text-muted-foreground">({seller.reviewCount})</span>
                </div>

                {/* Name overlay */}
                <div className="absolute bottom-2 left-3">
                  <p className="text-white text-sm">{seller.name}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{seller.description}</p>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{seller.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span>{seller.productCount} товаров</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    С {seller.since}
                  </div>
                </div>

                {/* Category tags */}
                <div className="flex gap-1.5 flex-wrap">
                  {seller.categories.map(cat => (
                    <span key={cat} className="text-[10px] bg-secondary text-primary px-2 py-0.5 rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Product badges */}
                {seller.badges.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {seller.badges.slice(0, 3).map(badge => {
                      const colors = badgeColors[badge] || { bg: '#E8F5E9', text: '#2d7a3a' };
                      return (
                        <span
                          key={badge}
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {badge}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-xs text-primary">Смотреть товары</span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}