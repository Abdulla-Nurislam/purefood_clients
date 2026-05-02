import { useApp } from '../context/AppContext';
import { ArrowLeft, RefreshCw, Pause, Play, Trash2 } from 'lucide-react';
import { useToast } from './SimpleToast';

export function SubscriptionsScreen() {
  const { goBack, subscriptions, toggleSubscription, removeSubscription } = useApp();
  const toast = useToast();

  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2>Подписки</h2>
      </div>

      <p className="text-sm text-muted-foreground">Автоматическая доставка ваших любимых продуктов</p>

      {subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3">
          <RefreshCw className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">Нет активных подписок</p>
          <p className="text-xs text-muted-foreground">Подпишитесь на товар из карточки продукта</p>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map(sub => (
            <div key={sub.id} className={`bg-card border rounded-2xl p-4 space-y-2 ${sub.active ? 'border-primary/20' : 'border-border opacity-60'}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm">{sub.productName}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${sub.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {sub.active ? 'Активна' : 'Пауза'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{sub.frequency}</p>
              {sub.active && (
                <p className="text-xs text-primary">Следующая доставка: {sub.nextDelivery}</p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { toggleSubscription(sub.id); toast.success(sub.active ? 'Подписка приостановлена' : 'Подписка возобновлена'); }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-lg text-xs text-primary"
                >
                  {sub.active ? <><Pause className="w-3 h-3" /> Пауза</> : <><Play className="w-3 h-3" /> Возобновить</>}
                </button>
                <button
                  onClick={() => { removeSubscription(sub.id); toast.success('Подписка удалена'); }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 rounded-lg text-xs text-red-600"
                >
                  <Trash2 className="w-3 h-3" /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
