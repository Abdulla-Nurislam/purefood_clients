import { useApp } from '../context/AppContext';
import { ArrowLeft, Heart, Star, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function FavoritesScreen() {
  const { goBack, favorites, toggleFavorite, navigate, allProducts } = useApp();
  const favoriteProducts = allProducts.filter(p => favorites.includes(p.id));

  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2>Избранное</h2>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3">
          <Heart className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">Нет избранных товаров</p>
          <button onClick={() => navigate('/catalog')} className="text-primary text-sm">Перейти к каталогу</button>
        </div>
      ) : (
        <div className="space-y-3">
          {favoriteProducts.map(product => (
            <div key={product.id} className="flex gap-3 bg-card border border-border rounded-2xl p-3 relative">
              <button onClick={() => navigate(`/product/${product.id}`)} className="flex gap-3 flex-1 text-left">
                <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex-shrink-0 relative">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.supplierVerified && (
                    <div className="absolute top-1 left-1 bg-primary text-white rounded-full p-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.supplier}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.supplierRating}</span>
                    <span className="text-xs text-muted-foreground">· {product.supplier}</span>
                  </div>
                  {product.badges.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-1 mb-1">
                      {product.badges.slice(0, 2).map((badge: string) => (
                        <span key={badge} className="text-[9px] bg-secondary text-primary px-1.5 py-0.5 rounded-full">{badge}</span>
                      ))}
                    </div>
                  )}
                  <span className="text-primary text-sm">{product.price.toLocaleString()} ₸</span>
                </div>
              </button>
              <button onClick={() => toggleFavorite(product.id)} className="absolute top-3 right-3">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}