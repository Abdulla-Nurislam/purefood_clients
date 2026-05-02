import { useApp } from '../context/AppContext';
import { ArrowLeft, Bell, Package, Truck, Tag, Info, CheckCheck } from 'lucide-react';

const typeIcons = {
  order: Package,
  delivery: Truck,
  promo: Tag,
  system: Info,
};

export function NotificationsScreen() {
  const { goBack, notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();

  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2>Уведомления</h2>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead} className="text-xs text-primary flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5" /> Прочитать все
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-3">
          <Bell className="w-12 h-12 text-muted-foreground" />
          <p className="text-muted-foreground">Нет уведомлений</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => {
            const Icon = typeIcons[notif.type];
            return (
              <button
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`w-full text-left p-4 rounded-2xl border ${!notif.read ? 'bg-primary/5 border-primary/15' : 'bg-card border-border'}`}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!notif.read ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`w-5 h-5 ${!notif.read ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm line-clamp-1">{notif.title}</p>
                      {!notif.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
