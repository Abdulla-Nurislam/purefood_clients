import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { paymentMethods } from '../data/mock-data';
import { Minus, Plus, Trash2, Truck, ShieldCheck, CheckCircle, CreditCard, Tag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useToast } from './SimpleToast';

export function CartScreen() {
  const { cart, updateQuantity, removeFromCart, cartTotal, navigate, clearCart, addOrder, addLoyaltyPoints } = useApp();
  const toast = useToast();
  const [step, setStep] = useState<'cart' | 'checkout' | 'done'>('cart');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState('kaspi');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

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

  const handlePlaceOrder = () => {
    const orderId = `ST-20260330-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`;
    const pm = paymentMethods.find(m => m.id === paymentMethod);
    addOrder({
      id: orderId,
      items: [...cart],
      status: 'processing',
      date: '30 марта 2026',
      total,
      deliveryType: deliveryType === 'express' ? 'Экспресс' : 'Стандартная',
      paymentMethod: pm?.label || '',
      trackingSteps: [
        { label: 'Заказ принят', done: true, time: '30 мар, ' + new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0') },
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
    );
  }

  return (
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
  );
}
