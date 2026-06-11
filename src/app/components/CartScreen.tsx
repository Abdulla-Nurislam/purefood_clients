import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { paymentMethods } from '../data/mock-data';
import { Minus, Plus, Trash2, Truck, ShieldCheck, CheckCircle, CreditCard, Tag, Sparkles, Lock, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useToast } from './SimpleToast';

export function CartScreen() {
  const { cart, updateQuantity, removeFromCart, cartTotal, navigate, clearCart, addOrder, addLoyaltyPoints, userId, allProducts, isLoadingData } = useApp();
  const toast = useToast();
  const [step, setStep] = useState<'cart' | 'checkout' | 'kaspi_payment' | 'done'>('cart');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState('kaspi');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Sync cart with active products: remove products that were deleted by the seller
  useEffect(() => {
    if (isLoadingData) return;
    cart.forEach(item => {
      // If the product no longer exists in the loaded allProducts array, it was deleted/deactivated
      if (!allProducts.some(p => p.id === item.product.id)) {
        removeFromCart(item.product.id);
        toast.error(`Товар «${item.product.name}» был удален продавцом и убран из корзины`);
      }
    });
  }, [cart, allProducts, isLoadingData, removeFromCart, toast]);

  // Card payment modal
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardProcessing, setCardProcessing] = useState(false);
  const [cardDone, setCardDone] = useState(false);

  const deliveryCost = deliveryType === 'express' ? 1500 : cart.length > 0 ? 500 : 0;
  const discount = promoApplied ? Math.round(cartTotal * 0.1) : 0;
  const total = cartTotal - discount + deliveryCost;
  const earnedPoints = Math.round(total / 100);

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'smart10') {
      setPromoApplied(true);
      toast.success('Промокод применён! Скидка 10%');
    } else {
      toast.info('Промокод не найден');
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'kaspi') {
      setStep('kaspi_payment');
      return;
    }
    if (paymentMethod === 'card') {
      setShowCardModal(true);
      return;
    }
    await finalizeOrder();
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleCardPay = () => {
    setCardProcessing(true);
    setTimeout(async () => {
      setCardProcessing(false);
      setCardDone(true);
      setTimeout(async () => {
        setShowCardModal(false);
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
        setCardDone(false);
        await finalizeOrder();
      }, 600);
    }, 2000);
  };

  const finalizeOrder = async () => {
    const pm = paymentMethods.find(m => m.id === paymentMethod);

    // 1. Send to Supabase
    const { createOrder } = await import('../../lib/api');
    const newOrders = await createOrder(
      cart,
      total,
      'Алматы, Абая 100', // mock delivery address
      pm?.label || 'Онлайн оплата',
      userId || undefined
    );

    // 2. Local state update for immediate UI
    const orderId = newOrders?.[0]?.id || `ST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;

    addOrder({
      id: orderId,
      items: [...cart],
      status: 'processing',
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      total,
      deliveryType: deliveryType === 'express' ? 'Экспресс' : 'Стандартная',
      paymentMethod: pm?.label || '',
      trackingSteps: [
        { label: 'Заказ принят', done: true, time: new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0') },
        { label: 'Собран на складе', done: false },
        { label: 'Передан курьеру', done: false },
        { label: 'В пути к вам', done: false },
        { label: 'Доставлен', done: false },
      ],
    });
    addLoyaltyPoints(earnedPoints);
    clearCart();
    setStep('done');
  };

  // ── CloudPayments Sandbox Modal ──────────────────────────────────────────
  const cardModalJsx = showCardModal ? (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget && !cardProcessing) { setShowCardModal(false); } }}
    >
      <div className="relative bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full max-w-sm px-6 pt-7 pb-8 shadow-2xl animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
        {/* Handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-border rounded-full sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-[10px] font-medium text-primary uppercase tracking-widest mb-0.5">Тестовый режим</p>
            <h3 className="text-base font-semibold leading-tight">Симуляция CloudPayments</h3>
          </div>
          {!cardProcessing && (
            <button
              onClick={() => setShowCardModal(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-border transition-colors -mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Amount chip */}
        <div className="mt-4 mb-5 bg-secondary rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Сумма к оплате</span>
          <span className="text-lg font-bold text-primary">{total.toLocaleString()} ₸</span>
        </div>

        {/* Card number */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Номер карты</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                disabled={cardProcessing || cardDone}
                className="w-full pl-9 pr-3 py-3 bg-secondary border border-border rounded-xl text-sm tracking-widest placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          {/* Expiry + CVC row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Срок действия</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="ММ/ГГ"
                value={cardExpiry}
                onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                disabled={cardProcessing || cardDone}
                className="w-full px-3 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5 font-medium">CVC</label>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="•••"
                  maxLength={4}
                  value={cardCvc}
                  onChange={e => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  disabled={cardProcessing || cardDone}
                  className="w-full pl-3 pr-8 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Hint */}
        <p className="mt-3 text-[11px] text-muted-foreground text-center">
          💡 Для теста введите любые цифры
        </p>

        {/* Pay button */}
        <button
          onClick={handleCardPay}
          disabled={cardProcessing || cardDone}
          className="mt-5 w-full bg-primary text-primary-foreground py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-75"
        >
          {cardDone ? (
            <><CheckCircle className="w-5 h-5" /> Оплачено!</>
          ) : cardProcessing ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Обработка транзакции…
            </>
          ) : (
            <>Оплатить · {total.toLocaleString()} ₸</>
          )}
        </button>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>Защищено</span>
        </div>
      </div>
    </div>
  ) : null;
  // ──────────────────────────────────────────────────────────────────────────

  if (step === 'kaspi_payment') {
    return (
      <div className="px-4 pt-6 pb-4 space-y-4 animate-[fadeIn_0.3s_ease-out]">
        <div className="flex items-center gap-3">
          <button onClick={() => setStep('checkout')} className="text-primary text-sm">← Назад</button>
          <h2>Оплата Kaspi Gold</h2>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-[#F14635]/10 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl">🏦</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Сумма к оплате</p>
            <p className="text-3xl font-bold">{total.toLocaleString()} ₸</p>
          </div>

          <div className="bg-secondary rounded-xl p-4 text-left">
            <p className="text-xs text-muted-foreground mb-1">Перевод по номеру телефона</p>
            <p className="text-lg font-medium">+7 777 000 00 00</p>
            <p className="text-sm mt-1">Получатель: Nurislam A.</p>
          </div>

          <p className="text-sm text-muted-foreground">После совершения перевода в приложении Kaspi.kz, нажмите кнопку ниже для подтверждения.</p>
        </div>

        <button onClick={finalizeOrder} className="w-full bg-[#F14635] text-white py-4 rounded-2xl font-medium mt-4 shadow-sm hover:bg-[#D93F2F] active:scale-95 transition-all">
          Я оплатил
        </button>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-4 animate-[fadeIn_0.4s_ease-out]">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h2>Заказ оформлен!</h2>
        <p className="text-muted-foreground text-sm">Вы заработали <span className="text-primary">+{earnedPoints} баллов</span></p>
        <p className="text-muted-foreground text-sm">Отслеживайте статус в разделе «Заказы»</p>
        <button onClick={() => navigate('/orders')} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl mt-4">
          Отследить заказ
        </button>
        <button onClick={() => navigate('/home')} className="text-primary text-sm">
          На главную
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center gap-4">
        <div className="text-6xl">🛒</div>
        <h2>Корзина пуста</h2>
        <p className="text-muted-foreground text-sm">Добавьте проверенные продукты для здорового питания</p>
        <button onClick={() => navigate('/search')} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl">
          Перейти к каталогу
        </button>
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <>
        <div className="px-4 pt-6 pb-4 space-y-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-3">
            <button onClick={() => setStep('cart')} className="text-primary text-sm">← Корзина</button>
            <h2>Оформление</h2>
          </div>

          {/* Delivery */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <h4 className="flex items-center gap-2"><Truck className="w-4 h-4" /> Доставка</h4>
            <button
              onClick={() => setDeliveryType('standard')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border ${deliveryType === 'standard' ? 'border-primary bg-secondary' : 'border-border'}`}
            >
              <div>
                <p className="text-sm">Стандартная</p>
                <p className="text-xs text-muted-foreground">1-2 дня</p>
              </div>
              <span className="text-sm">500 ₸</span>
            </button>
            <button
              onClick={() => setDeliveryType('express')}
              className={`w-full flex items-center justify-between p-3 rounded-xl border ${deliveryType === 'express' ? 'border-primary bg-secondary' : 'border-border'}`}
            >
              <div>
                <p className="text-sm">Экспресс</p>
                <p className="text-xs text-muted-foreground">2-4 часа</p>
              </div>
              <span className="text-sm">1 500 ₸</span>
            </button>
          </div>

          {/* Payment */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <h4 className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Способ оплаты</h4>
            {paymentMethods.map(pm => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border ${paymentMethod === pm.id ? 'border-primary bg-secondary' : 'border-border'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{pm.icon}</span>
                  <div>
                    <p className="text-sm">{pm.label}</p>
                    <p className="text-xs text-muted-foreground">{pm.detail}</p>
                  </div>
                </div>
                {paymentMethod === pm.id && <CheckCircle className="w-5 h-5 text-primary" />}
              </button>
            ))}
          </div>

          {/* Promo */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <h4 className="flex items-center gap-2"><Tag className="w-4 h-4" /> Промокод</h4>
            <div className="flex gap-2">
              <input
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                placeholder="Введите промокод"
                className="flex-1 bg-input-background border border-border rounded-xl px-3 py-2 text-sm"
                disabled={promoApplied}
              />
              <button
                onClick={handleApplyPromo}
                disabled={promoApplied || !promoCode}
                className={`px-4 py-2 rounded-xl text-sm ${promoApplied ? 'bg-secondary text-primary' : 'bg-primary text-primary-foreground'}`}
              >
                {promoApplied ? '✓' : 'Ок'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Попробуйте SMART10</p>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Товары ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>{cartTotal.toLocaleString()} ₸</span>
            </div>
            {promoApplied && (
              <div className="flex justify-between text-sm">
                <span className="text-primary">Скидка 10%</span>
                <span className="text-primary">-{discount.toLocaleString()} ₸</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Доставка</span>
              <span>{deliveryCost.toLocaleString()} ₸</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span>Итого</span>
              <span className="text-primary">{total.toLocaleString()} ₸</span>
            </div>
            <p className="text-xs text-muted-foreground">Вы заработаете +{earnedPoints} баллов лояльности</p>
          </div>

          <button onClick={handlePlaceOrder} className="w-full bg-primary text-primary-foreground py-4 rounded-2xl">
            Оплатить · {total.toLocaleString()} ₸
          </button>
        </div>
        {cardModalJsx}
      </>
    );
  }

  return (
    <>
      <div className="px-4 pt-6 pb-4 space-y-4">
        <h2>Корзина</h2>

        {/* Items */}
        <div className="space-y-3">
          {cart.map(item => (
            <div key={item.product.id} className="flex gap-3 bg-card border border-border rounded-2xl p-3">
              <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                <ImageWithFallback src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {item.product.supplierVerified && <ShieldCheck className="w-3 h-3 text-primary" />}
                  {item.product.supplier}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-primary">{(item.product.price * item.quantity).toLocaleString()} ₸</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeFromCart(item.product.id)} className="w-7 h-7 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loyalty bonus notification */}
        {cartTotal < 5000 ? (
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-amber-100 rounded-full opacity-40" />
            <div className="relative flex items-start gap-3">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-900">Почти у цели!</p>
                <p className="text-xs text-amber-700 leading-snug">
                  Добавьте еды ещё на <span className="font-bold text-amber-900">{(5000 - cartTotal).toLocaleString()} ₸</span>, чтобы получить повышенный бонус <span className="font-bold text-amber-900">10%</span>
                </p>
                <div className="w-full bg-amber-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-amber-500 rounded-full h-1.5"
                    style={{ width: `${Math.min((cartTotal / 5000) * 100, 100)}%`, transition: 'width 0.3s ease-out' }}
                  />
                </div>
                <p className="text-[10px] text-amber-500 mt-0.5">{cartTotal.toLocaleString()} / 5 000 ₸</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-4">
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-emerald-100 rounded-full opacity-40" />
            <div className="relative flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-900">Повышенный бонус активен! 🎉</p>
                <p className="text-xs text-emerald-700">Вы получите повышенный бонус 10% с этого заказа</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick summary */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Товары ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            <span>{cartTotal.toLocaleString()} ₸</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Доставка</span>
            <span>от 500 ₸</span>
          </div>
        </div>

        <button onClick={() => setStep('checkout')} className="w-full bg-primary text-primary-foreground py-4 rounded-2xl">
          К оформлению · {cartTotal.toLocaleString()} ₸
        </button>
      </div>
      {cardModalJsx}
    </>
  );
}
