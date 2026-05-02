import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, Star, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle, Share2, Heart, Plus, Minus, Lock, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useToast } from './SimpleToast';

export function ProductScreen() {
  const { addToCart, cart, updateQuantity, routeParams, goBack, navigate, isFavorite, toggleFavorite, subscriptions, addSubscription, allProducts } = useApp();
  const id = routeParams.id;
  const toast = useToast();
  const product = allProducts.find(p => p.id === id);

  // Validation steps: composition → certificates → lab tests
  const [compositionViewed, setCompositionViewed] = useState(false);
  const [certsViewed, setCertsViewed] = useState(false);
  const [labsViewed, setLabsViewed] = useState(false);

  const [showComposition, setShowComposition] = useState(false);
  const [showCerts, setShowCerts] = useState(false);
  const [showLabs, setShowLabs] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-3">
      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">Товар не найден</p>
      <button onClick={goBack} className="text-primary text-sm">← Назад</button>
    </div>
  );

  const cartItem = cart.find(i => i.product.id === product.id);
  const hasCerts = product.certificates.length > 0;
  const hasLabs = product.labTests.length > 0;
  const allValidated = compositionViewed && (!hasCerts || certsViewed) && (!hasLabs || labsViewed);
  const isSubscribed = subscriptions.some(s => s.productId === product.id && s.active);

  const handleAddToCart = () => {
    if (!allValidated && (hasCerts || hasLabs)) {
      toast.info('Просмотрите все разделы безопасности', { description: 'Откройте состав, сертификаты и лаб. тесты' });
      return;
    }
    addToCart(product);
    toast.success('Добавлено в корзину');
  };

  const handleSubscribe = (freq: string) => {
    addSubscription({
      id: `s-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      frequency: freq,
      nextDelivery: '6 апреля 2026',
      active: true,
    });
    setShowSubscribe(false);
    toast.success('Подписка оформлена!');
  };

  const validationProgress = [
    compositionViewed,
    !hasCerts || certsViewed,
    !hasLabs || labsViewed,
  ].filter(Boolean).length;
  const validationTotal = [true, hasCerts, hasLabs].filter(Boolean).length;

  return (
    <div className="pb-32">
      {/* Header image */}
      <div className="relative aspect-[4/3] bg-muted">
        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <button onClick={goBack} className="absolute top-4 left-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button onClick={() => toggleFavorite(product.id)} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
            <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button onClick={() => toast.info('Ссылка скопирована!')} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        {product.supplierVerified && (
          <div className="absolute bottom-4 left-4 bg-primary text-white rounded-full px-3 py-1 flex items-center gap-1 text-xs">
            <ShieldCheck className="w-4 h-4" /> Верифицирован
          </div>
        )}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Basic info */}
        <div>
          <h2>{product.name}</h2>
          <p className="text-sm text-muted-foreground">{product.supplier} · {product.origin} · {product.weight}</p>
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount} отзывов)</span>
            <span className="text-xs text-muted-foreground">· продавец {product.supplierRating}★</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl text-primary">{product.price.toLocaleString()} ₸</span>
            {product.oldPrice && <span className="text-muted-foreground line-through">{product.oldPrice.toLocaleString()} ₸</span>}
          </div>
          {/* Product badges */}
          {product.badges.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mt-2">
              {product.badges.map(badge => {
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
                const colors = badgeColors[badge] || { bg: '#E8F5E9', text: '#2d7a3a' };
                return (
                  <span key={badge} className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {badge}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.tags.map(t => (
            <span key={t} className="text-xs bg-secondary text-primary px-2.5 py-1 rounded-full">{t}</span>
          ))}
          {product.allergens.length > 0 && product.allergens.map(a => (
            <span key={a} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />{a}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">{product.description}</p>

        {/* === VALIDATION SECTION === */}
        <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <h4>Проверка безопасности</h4>
            </div>
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {validationProgress}/{validationTotal}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-1.5">
            <div
              className="bg-primary rounded-full h-1.5 transition-all"
              style={{ width: `${(validationProgress / validationTotal) * 100}%` }}
            />
          </div>

          {/* 1. Composition */}
          <button
            onClick={() => { setShowComposition(!showComposition); setCompositionViewed(true); }}
            className="w-full flex items-center justify-between bg-card rounded-xl p-3 border border-border"
          >
            <span className="text-sm flex items-center gap-2">
              {compositionViewed ? <CheckCircle className="w-4 h-4 text-primary" /> : <span className="w-4 h-4 rounded-full border-2 border-muted-foreground inline-block" />}
              📋 Состав
            </span>
            {showComposition ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showComposition && (
            <div className="bg-card border border-border rounded-xl p-3">
              {product.composition.map((c, i) => (
                <p key={i} className="text-sm">• {c}</p>
              ))}
            </div>
          )}

          {/* 2. Certificates */}
          {hasCerts && (
            <>
              <button
                onClick={() => {
                  if (!compositionViewed) { toast.info('Сначала просмотрите состав'); return; }
                  setShowCerts(!showCerts); setCertsViewed(true);
                }}
                className={`w-full flex items-center justify-between bg-card rounded-xl p-3 border border-border ${!compositionViewed ? 'opacity-60' : ''}`}
              >
                <span className="text-sm flex items-center gap-2">
                  {certsViewed ? <CheckCircle className="w-4 h-4 text-primary" /> : compositionViewed ? <span className="w-4 h-4 rounded-full border-2 border-muted-foreground inline-block" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Сертификаты ({product.certificates.length})
                </span>
                {showCerts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showCerts && (
                <div className="space-y-2">
                  {product.certificates.map((cert, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{cert.name}</span>
                        {cert.valid ? <CheckCircle className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-destructive" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{cert.issuer} · {cert.date}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* 3. Lab tests */}
          {hasLabs && (
            <>
              <button
                onClick={() => {
                  if (!compositionViewed) { toast.info('Сначала просмотрите состав'); return; }
                  if (hasCerts && !certsViewed) { toast.info('Сначала просмотрите сертификаты'); return; }
                  setShowLabs(!showLabs); setLabsViewed(true);
                }}
                className={`w-full flex items-center justify-between bg-card rounded-xl p-3 border border-border ${(hasCerts && !certsViewed) || !compositionViewed ? 'opacity-60' : ''}`}
              >
                <span className="text-sm flex items-center gap-2">
                  {labsViewed ? <CheckCircle className="w-4 h-4 text-primary" /> : (compositionViewed && (!hasCerts || certsViewed)) ? <span className="w-4 h-4 rounded-full border-2 border-muted-foreground inline-block" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                  🧪 Лабораторные тесты ({product.labTests.length})
                </span>
                {showLabs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showLabs && (
                <div className="space-y-2">
                  {product.labTests.map((test, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{test.name}</span>
                        {test.passed ? <CheckCircle className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-destructive" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{test.lab} · {test.date}</p>
                      <p className="text-xs text-primary mt-1">Результат: {test.result}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {allValidated && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary">Все проверки пройдены. Можно добавить в корзину!</span>
            </div>
          )}
        </div>

        {/* Subscription option */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <button onClick={() => setShowSubscribe(!showSubscribe)} className="w-full flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <RefreshCw className="w-4 h-4 text-primary" />
              {isSubscribed ? 'Подписка активна' : 'Подписаться на регулярную доставку'}
            </span>
            {showSubscribe ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showSubscribe && !isSubscribed && (
            <div className="space-y-2">
              {['Каждую неделю', 'Каждые 2 недели', 'Раз в месяц'].map(freq => (
                <button
                  key={freq}
                  onClick={() => handleSubscribe(freq)}
                  className="w-full text-left px-3 py-2.5 bg-secondary rounded-xl text-sm"
                >
                  {freq}
                </button>
              ))}
            </div>
          )}
          {showSubscribe && isSubscribed && (
            <p className="text-xs text-muted-foreground">Управляйте подпиской в разделе «Подписки» профиля.</p>
          )}
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card border-t border-border p-4 flex items-center gap-3 z-50">
        {cartItem ? (
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => updateQuantity(product.id, cartItem.quantity - 1)} className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <Minus className="w-4 h-4" />
            </button>
            <span>{cartItem.quantity}</span>
            <button onClick={() => addToCart(product)} className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/cart')} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl">
              В корзину
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 ${
              allValidated || (!hasCerts && !hasLabs)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {!allValidated && (hasCerts || hasLabs) && <Lock className="w-4 h-4" />}
            Добавить · {product.price.toLocaleString()} ₸
          </button>
        )}
      </div>
    </div>
  );
}