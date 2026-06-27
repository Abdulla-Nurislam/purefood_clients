import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CheckCircle, Circle, Star, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from './SimpleToast';

export function OrderDetailScreen() {
  const { routeParams, goBack, orders, cancelOrder, rateOrder, navigate } = useApp();
  const toast = useToast();
  const order = orders.find(o => o.id === routeParams.id);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!order) return (
    <div className="p-6 text-center">
      <p>Заказ не найден</p>
      <button onClick={goBack} className="text-primary text-sm mt-2">Назад</button>
    </div>
  );

  const canCancel = ['processing', 'shipped'].includes(order.status);
  const canRate = order.status === 'delivered' && !order.rated;
  const isFailed = order.status === 'failed';

  const handleCancel = () => {
    cancelOrder(order.id);
    setShowCancelConfirm(false);
    toast.success('Заказ отменён');
  };



  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2>Заказ #{order.id}</h2>
          <p className="text-xs text-muted-foreground">{order.date}</p>
        </div>
      </div>

      {/* Status banner */}
      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-sm text-red-700">Заказ отменён</p>
            <p className="text-xs text-red-500">Средства будут возвращены в течение 3-5 дней</p>
          </div>
        </div>
      )}

      {isFailed && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <div>
            <p className="text-sm text-red-700">Ошибка доставки</p>
            <p className="text-xs text-red-500">Свяжитесь с поддержкой или повторите заказ</p>
          </div>
        </div>
      )}

      {order.status === 'delivered' && order.rated && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-primary" />
          <div>
            <p className="text-sm text-primary">Доставлено! Ваша оценка: {'★'.repeat(order.rating || 0)}</p>
          </div>
        </div>
      )}

      {/* Tracking */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-0">
        <h4 className="mb-3">Статус доставки</h4>
        {order.trackingSteps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              {step.done ? (
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              {i < order.trackingSteps.length - 1 && (
                <div className={`w-0.5 h-8 ${step.done ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
            <div className="pb-3">
              <p className={`text-sm ${step.done ? '' : 'text-muted-foreground'}`}>{step.label}</p>
              {step.time && <p className="text-xs text-muted-foreground">{step.time}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Order details */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h4>Детали заказа</h4>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.product.id} className="flex items-center justify-between text-sm">
              <span className="flex-1">{item.product.name} × {item.quantity}</span>
              <span>{(item.product.price * item.quantity).toLocaleString()} ₸</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-2 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Доставка: {order.deliveryType}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Оплата: {order.paymentMethod}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span>Итого</span>
            <span className="text-primary">{order.total.toLocaleString()} ₸</span>
          </div>
        </div>
      </div>

      {/* Rating section */}
      {canRate && (
        <button
          onClick={() => navigate(`/write-review/${order.id}`)}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold active:scale-[0.98] transition-transform"
        >
          <Star className="w-5 h-5" /> Оценить заказ
        </button>
      )}

      {/* Cancel order */}
      {canCancel && !showCancelConfirm && (
        <button onClick={() => setShowCancelConfirm(true)} className="w-full text-destructive py-3 border border-destructive/20 rounded-2xl text-sm">
          Отменить заказ
        </button>
      )}

      {showCancelConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3 animate-[fadeIn_0.3s_ease-out]">
          <p className="text-sm text-red-700">Вы уверены, что хотите отменить заказ?</p>
          <div className="flex gap-2">
            <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-2 rounded-xl border border-border text-sm">Нет</button>
            <button onClick={handleCancel} className="flex-1 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm">Да, отменить</button>
          </div>
        </div>
      )}

      {/* Reorder for failed/delivered */}
      {(isFailed || order.status === 'delivered') && (
        <button onClick={() => navigate('/search')} className="w-full flex items-center justify-center gap-2 py-3 bg-secondary text-primary rounded-2xl text-sm">
          <RefreshCw className="w-4 h-4" /> Повторить заказ
        </button>
      )}
    </div>
  );
}
