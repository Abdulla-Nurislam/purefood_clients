import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../data/mock-data';
import { ChevronLeft, Share2, ShieldCheck, Star, MapPin, Package, ShoppingCart, Heart, Check } from 'lucide-react';
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
  'Без сахара': { bg: '#FFF3E0', text: '#e65100' },
  'Высокий белок': { bg: '#FCE4EC', text: '#c62828' },
  'Без лактозы': { bg: '#E3F2FD', text: '#1565c0' },
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

function SellerProductCard({ product }: { product: Product }) {
  const { navigate, addToCart, isFavorite, toggleFavorite } = useApp();
  const [added, setAdded] = useState(false);
  const isFav = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden relative flex flex-col">
      <button onClick={() => navigate(`/product/${product.id}`)} className="text-left">
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
        <div className="p-2.5 pb-1">
          <p className="text-sm line-clamp-2 mb-1">{product.name}</p>
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-muted-foreground">{product.rating} · {product.reviewCount} отзывов</span>
          </div>
          {product.badges.length > 0 && (
            <div className="flex gap-1 flex-wrap mb-1.5">
              {product.badges.slice(0, 2).map(badge => (
                <BadgeChip key={badge} badge={badge} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm">{product.price.toLocaleString()} ₸</span>
            {product.oldPrice && (
              <span className="text-[10px] text-muted-foreground line-through">{product.oldPrice.toLocaleString()} ₸</span>
            )}
          </div>
        </div>
      </button>

      {/* Add to Cart button */}
      <div className="px-2.5 pb-2.5 pt-1 mt-auto">
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs transition-all ${
            added
              ? 'bg-green-100 text-green-700'
              : 'bg-primary/10 text-primary active:bg-primary active:text-white'
          }`}
        >
          {added ? (
            <><Check className="w-3.5 h-3.5" /> Добавлено</>
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5" /> В корзину</>
          )}
        </button>
      </div>

      {/* Favorite button */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
        className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur rounded-full flex items-center justify-center z-10"
      >
        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
      </button>
    </div>
  );
}

export function SellerProfileScreen() {
  const { goBack, routeParams, allSellers, allProducts } = useApp();
  const sellerId = routeParams.id;

  const seller = allSellers.find(s => s.id === sellerId);
  const sellerProducts = allProducts.filter(p => p.supplierId === sellerId);

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 px-4">
        <Package className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">Продавец не найден</p>
        <button onClick={goBack} className="text-primary text-sm">Назад</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border flex items-center justify-between px-4 py-3">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="text-sm line-clamp-1 flex-1 text-center mx-3">{seller.name}</p>
        <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
          <Share2 className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-44 overflow-hidden">
          <ImageWithFallback src={seller.image} alt={seller.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        </div>

        {/* Avatar circle */}
        <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-2xl border-4 border-background bg-primary/10 overflow-hidden shadow-lg flex items-center justify-center">
          <span className="text-2xl">🌿</span>
        </div>
      </div>

      {/* Profile info */}
      <div className="pt-11 px-4 pb-4 space-y-3">
        {/* Name + verified */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg">{seller.name}</h2>
              {seller.verified && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-2 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Верифицирован</span>
                </div>
              )}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-1">
              {[1,2,3,4,5].map(star => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${star <= Math.round(seller.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-sm text-muted-foreground">{seller.rating}</span>
              <span className="text-xs text-muted-foreground">({seller.reviewCount} отзывов)</span>
            </div>
          </div>
        </div>

        {/* Bio / description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{seller.description}</p>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-primary" />
            <span>{seller.location}</span>
          </div>
          <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
            <Package className="w-3 h-3 text-primary" />
            <span>{seller.productCount} товаров</span>
          </div>
          <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
            <span className="text-primary">🗓</span>
            <span>На платформе с {seller.since}</span>
          </div>
        </div>

        {/* Seller badges */}
        {seller.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {seller.badges.map(badge => {
              const colors = badgeColors[badge] || { bg: '#E8F5E9', text: '#2d7a3a' };
              return (
                <span
                  key={badge}
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {badge}
                </span>
              );
            })}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-secondary rounded-xl p-3 text-center">
            <p className="text-primary">{seller.rating}</p>
            <p className="text-[10px] text-muted-foreground">Рейтинг</p>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <p className="text-primary">{seller.reviewCount}</p>
            <p className="text-[10px] text-muted-foreground">Отзывов</p>
          </div>
          <div className="bg-secondary rounded-xl p-3 text-center">
            <p className="text-primary">{sellerProducts.length || seller.productCount}</p>
            <p className="text-[10px] text-muted-foreground">Товаров</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Products section */}
        <div>
          <h3 className="mb-3">Товары продавца</h3>
          {sellerProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <Package className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Товары этого продавца появятся скоро</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {sellerProducts.map(product => (
                <SellerProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
