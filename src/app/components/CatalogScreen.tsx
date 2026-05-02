import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { catalogCategories, smartFilters } from '../data/mock-data';
import { Search, ShieldCheck, Star, Heart, ChevronLeft, SlidersHorizontal, X } from 'lucide-react';
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

export function CatalogScreen() {
  const { navigate, isFavorite, toggleFavorite, allProducts } = useApp();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeSmartFilters, setActiveSmartFilters] = useState<string[]>([]);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);

  const toggleSmartFilter = (tag: string) => {
    setActiveSmartFilters(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const activeCatData = selectedCat ? catalogCategories.find(c => c.id === selectedCat) : null;

  const filteredProducts = allProducts.filter(p => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.supplier.toLowerCase().includes(query.toLowerCase())) return false;
    if (activeCatData) {
      const tagMatch = activeCatData.tagFilter ? p.tags.includes(activeCatData.tagFilter) : true;
      const catMatch = activeCatData.catFilter ? p.category === activeCatData.catFilter : true;
      if (!tagMatch && !catMatch) return false;
    }
    if (activeSmartFilters.length > 0 && !activeSmartFilters.some(t => p.tags.includes(t))) return false;
    if (onlyVerified && !p.supplierVerified) return false;
    return true;
  });

  const hasActiveFilters = activeSmartFilters.length > 0 || onlyVerified;

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background">
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-3">
            {selectedCat ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setSelectedCat(null); setQuery(''); setActiveSmartFilters([]); }}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2>{activeCatData?.name}</h2>
              </div>
            ) : (
              <h2>Каталог</h2>
            )}
            <button
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center relative ${showFilterBar || hasActiveFilters ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">
                  {activeSmartFilters.length + (onlyVerified ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-input-background border border-border rounded-2xl px-3 py-2.5">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={selectedCat ? `Поиск в «${activeCatData?.name}»...` : 'Поиск товаров...'}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Smart filter bar */}
        {showFilterBar && (
          <div className="px-4 pb-3 space-y-3 border-b border-border animate-[slideDown_0.2s_ease-out]">
            {/* Verified toggle */}
            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all ${
                onlyVerified ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Только верифицированные
            </button>

            {/* Smart filters */}
            <div>
              <p className="text-xs text-muted-foreground mb-2">Умные фильтры</p>
              <div className="flex flex-wrap gap-2">
                {smartFilters.map(f => (
                  <button
                    key={f.id}
                    onClick={() => toggleSmartFilter(f.tag)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${
                      activeSmartFilters.includes(f.tag) ? 'bg-primary text-white border-primary' : 'border-border text-foreground'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => { setActiveSmartFilters([]); setOnlyVerified(false); }}
                className="text-xs text-destructive"
              >
                Сбросить фильтры
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-6">
        {/* Category grid - show when no category selected and no query */}
        {!selectedCat && !query ? (
          <>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {catalogCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className="flex items-center gap-3 p-4 rounded-2xl border active:scale-95 transition-transform text-left"
                  style={{ backgroundColor: cat.color, borderColor: cat.borderColor }}
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {allProducts.filter(p => cat.tagFilter ? p.tags.includes(cat.tagFilter) : cat.catFilter ? p.category === cat.catFilter : true).length} товаров
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* All products section */}
            <div className="mt-6">
              <h3 className="mb-3">Все товары</h3>
              <div className="grid grid-cols-2 gap-3">
                {allProducts.map(product => (
                  <ProductCardCatalog
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                    onFavorite={() => toggleFavorite(product.id)}
                    isFav={isFavorite(product.id)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Filtered product list */
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                Найдено: <span className="text-foreground">{filteredProducts.length}</span> товаров
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">Товары не найдены</p>
                <button
                  onClick={() => { setQuery(''); setActiveSmartFilters([]); setOnlyVerified(false); }}
                  className="text-primary text-sm mt-2"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map(product => (
                  <ProductCardCatalog
                    key={product.id}
                    product={product}
                    onClick={() => navigate(`/product/${product.id}`)}
                    onFavorite={() => toggleFavorite(product.id)}
                    isFav={isFavorite(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCardCatalog({ product, onClick, onFavorite, isFav }: {
  product: any;
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
          <p className="text-xs line-clamp-2 mb-1">{product.name}</p>
          {/* Seller + rating */}
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-muted-foreground">{product.supplierRating} · {product.supplier}</span>
          </div>
          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-1.5">
              {product.badges.slice(0, 2).map((badge: string) => (
                <BadgeChip key={badge} badge={badge} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-primary text-sm">{product.price.toLocaleString()} ₸</span>
            {product.oldPrice && (
              <span className="text-[10px] text-muted-foreground line-through">{product.oldPrice.toLocaleString()} ₸</span>
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
