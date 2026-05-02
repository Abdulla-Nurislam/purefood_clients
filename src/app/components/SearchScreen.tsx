import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categories, preferences } from '../data/mock-data';
import { Search, SlidersHorizontal, X, ShieldCheck, Star, ChevronLeft, Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const allergensList = ['Глютен', 'Лактоза', 'Орехи', 'Соя', 'Яйца'];
const origins = ['Алматинская область', 'Восточный Казахстан', 'Южный Казахстан', 'Туркестанская область', 'Алматы', 'Жамбылская область'];

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

export function SearchScreen() {
  const { navigate, goBack, isFavorite, toggleFavorite, allProducts } = useApp();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [excludeAllergens, setExcludeAllergens] = useState<string[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [onlyVerified, setOnlyVerified] = useState(false);

  const filtered = allProducts.filter(p => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.supplier.toLowerCase().includes(query.toLowerCase())) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedTags.length && !selectedTags.some(t => p.tags.includes(t))) return false;
    if (excludeAllergens.length && excludeAllergens.some(a => p.allergens.includes(a))) return false;
    if (selectedOrigin && p.origin !== selectedOrigin) return false;
    if (onlyVerified && !p.supplierVerified) return false;
    return true;
  });

  const activeFiltersCount = [selectedCategory, selectedTags.length, excludeAllergens.length, selectedOrigin, onlyVerified].filter(Boolean).length;

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-background">
        <div className="px-4 pt-4 pb-3">
          <div className="flex gap-2 items-center">
            <button onClick={goBack} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-input-background border border-border rounded-2xl px-3 py-2.5">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Поиск товаров и продавцов..."
                className="flex-1 bg-transparent outline-none text-sm"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0 ${showFilters ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mx-4 mb-3 bg-card border border-border rounded-2xl p-4 space-y-4 animate-[slideDown_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <h4>Фильтры</h4>
              <button onClick={() => { setSelectedCategory(''); setSelectedTags([]); setExcludeAllergens([]); setSelectedOrigin(''); setOnlyVerified(false); }} className="text-xs text-primary">Сбросить</button>
            </div>

            <button
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all ${onlyVerified ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Только верифицированные
            </button>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Категория</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(c => (
                  <button key={c.id} onClick={() => setSelectedCategory(selectedCategory === c.id ? '' : c.id)}
                    className={`px-3 py-1 rounded-full text-xs border ${selectedCategory === c.id ? 'bg-primary text-white border-primary' : 'border-border'}`}>
                    {c.icon} {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Свойства</p>
              <div className="flex flex-wrap gap-1.5">
                {preferences.slice(0, 8).map(p => (
                  <button key={p} onClick={() => setSelectedTags(selectedTags.includes(p) ? selectedTags.filter(x => x !== p) : [...selectedTags, p])}
                    className={`px-3 py-1 rounded-full text-xs border ${selectedTags.includes(p) ? 'bg-primary text-white border-primary' : 'border-border'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Исключить аллергены</p>
              <div className="flex flex-wrap gap-1.5">
                {allergensList.map(a => (
                  <button key={a} onClick={() => setExcludeAllergens(excludeAllergens.includes(a) ? excludeAllergens.filter(x => x !== a) : [...excludeAllergens, a])}
                    className={`px-3 py-1 rounded-full text-xs border ${excludeAllergens.includes(a) ? 'bg-destructive text-white border-destructive' : 'border-border'}`}>
                    <X className="w-2.5 h-2.5 inline mr-1" />{a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Происхождение</p>
              <select value={selectedOrigin} onChange={e => setSelectedOrigin(e.target.value)}
                className="w-full bg-input-background border border-border rounded-xl px-3 py-2 text-sm">
                <option value="">Все регионы</option>
                {origins.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 pb-6">
        <p className="text-sm text-muted-foreground mb-3">Найдено: {filtered.length} товаров</p>
        <div className="space-y-3">
          {filtered.map(product => (
            <div key={product.id} className="flex gap-3 bg-card border border-border rounded-2xl p-3 relative">
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex gap-3 flex-1 text-left min-w-0"
              >
                <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0 relative">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.supplierVerified && (
                    <div className="absolute top-1 left-1 bg-primary text-white rounded-full p-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-2 mb-1">{product.name}</p>
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.supplierRating}</span>
                    <span className="text-xs text-muted-foreground">· {product.supplier}</span>
                  </div>
                  {/* Badges */}
                  {product.badges.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-1.5">
                      {product.badges.slice(0, 2).map((badge: string) => {
                        const colors = badgeColors[badge] || { bg: '#E8F5E9', text: '#2d7a3a' };
                        return (
                          <span key={badge} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: colors.bg, color: colors.text }}>
                            {badge}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-sm">{product.price.toLocaleString()} ₸</span>
                    {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{product.oldPrice.toLocaleString()} ₸</span>}
                  </div>
                </div>
              </button>
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-3 right-3 w-7 h-7 bg-secondary rounded-full flex items-center justify-center"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
