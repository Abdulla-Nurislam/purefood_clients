import { useApp } from '../context/AppContext';
import { Package, CheckCircle, Truck, XCircle, Clock, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: typeof Package }> = {
  processing: { label: 'Обработка', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: Clock },
  shipped: { label: 'Отправлен', color: 'text-indigo-700', bgColor: 'bg-indigo-100', icon: Package },
  in_transit: { label: 'В пути', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: Truck },
  delivered: { label: 'Доставлен', color: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Отменён', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
  failed: { label: 'Ошибка доставки', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
};

export function OrdersScreen() {
  const { orders, navigate, goBack, addToCart } = useApp();

  const activeOrders = orders.filter(o => ['processing', 'shipped', 'in_transit'].includes(o.status));
  const completedOrders = orders.filter(o => ['delivered', 'cancelled', 'failed'].includes(o.status));

  const handleRepeatOrder = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.items.forEach(item => addToCart(item.product));
      navigate('/cart');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border flex items-center px-4 py-3 gap-3">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="flex-1">Мои заказы</h2>
        <span className="text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
          {orders.length} заказов
        </span>
      </div>

      <div className="px-4 pt-4 pb-6 space-y-5">
        {orders.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">У вас пока нет заказов</p>
            <button
              onClick={() => navigate('/catalog')}
              className="bg-primary text-white text-sm px-5 py-2.5 rounded-full"
            >
              Перейти к каталогу
            </button>
          </div>
        )}

        {/* Active orders */}
        {activeOrders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <h4 className="text-muted-foreground text-sm">Активные заказы</h4>
            </div>
            {activeOrders.map(order => {
              const cfg = statusConfig[order.status];
              const Icon = cfg.icon;
              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="w-full bg-card border border-border rounded-2xl overflow-hidden text-left active:scale-[0.99] transition-transform cursor-pointer"
                >
                  {/* Status bar accent */}
                  <div className="h-1 bg-orange-400 w-full" />
                  <div className="p-4 space-y-3">
                    {/* Order header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Заказ</p>
                        <p className="text-sm">#{order.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                      </div>
                      <span className={`text-xs ${cfg.bgColor} ${cfg.color} px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap flex-shrink-0`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>

                    {/* Product thumbnails */}
                    <div className="flex gap-2 items-center">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border">
                            <ImageWithFallback
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {item.quantity > 1 && (
                            <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
                              {item.quantity}
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                        </div>
                      )}
                      <div className="flex-1" />
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-border pt-2">
                      <span className="text-xs text-muted-foreground">{order.items.length} товар(ов)</span>
                      <span className="text-sm text-primary">{order.total.toLocaleString()} ₸</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed orders */}
        {completedOrders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <h4 className="text-muted-foreground text-sm">История заказов</h4>
            </div>
            {completedOrders.map(order => {
              const cfg = statusConfig[order.status];
              const Icon = cfg.icon;
              const isDelivered = order.status === 'delivered';
              const isCancelled = order.status === 'cancelled';
              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="w-full bg-card border border-border rounded-2xl overflow-hidden text-left active:scale-[0.99] transition-transform cursor-pointer"
                >
                  {/* Status bar accent */}
                  <div className={`h-1 w-full ${isDelivered ? 'bg-green-400' : 'bg-red-300'}`} />
                  <div className="p-4 space-y-3">
                    {/* Order header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Заказ</p>
                        <p className="text-sm">#{order.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-xs ${cfg.bgColor} ${cfg.color} px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                        {order.rated && (
                          <span className="text-[10px] text-amber-600">★ {order.rating}/5</span>
                        )}
                      </div>
                    </div>

                    {/* Product thumbnails */}
                    <div className="flex gap-2 items-center">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="relative">
                          <div className={`w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border ${isCancelled ? 'opacity-50 grayscale' : ''}`}>
                            <ImageWithFallback
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {item.quantity > 1 && (
                            <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center">
                              {item.quantity}
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>

                    {/* Total + actions */}
                    <div className="flex items-center justify-between border-t border-border pt-2 gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">{order.items.length} товар(ов) · </span>
                        <span className="text-sm text-primary">{order.total.toLocaleString()} ₸</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!order.rated && isDelivered && (
                          <span className="text-xs text-amber-600 border border-amber-300 rounded-full px-2 py-0.5">
                            Оценить
                          </span>
                        )}
                        {/* Repeat order button */}
                        <button
                          onClick={(e) => handleRepeatOrder(e, order.id)}
                          className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full active:bg-primary active:text-white transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Повторить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
