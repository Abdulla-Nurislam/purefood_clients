import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { allergenOptions } from '../data/mock-data';
import { ArrowLeft, MapPin, Bell, Shield, AlertTriangle, Globe, Moon, Trash2 } from 'lucide-react';
import { useToast } from './SimpleToast';

const cities = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск'];

export function SettingsScreen() {
  const { goBack, city, setCity, excludedAllergens, setExcludedAllergens } = useApp();
  const toast = useToast();
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifPromos, setNotifPromos] = useState(true);
  const [notifDelivery, setNotifDelivery] = useState(true);
  const [showCity, setShowCity] = useState(false);
  const [showAllergens, setShowAllergens] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleAllergen = (a: string) => {
    setExcludedAllergens(
      excludedAllergens.includes(a) ? excludedAllergens.filter(x => x !== a) : [...excludedAllergens, a]
    );
  };

  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2>Настройки</h2>
      </div>

      {/* City */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <button onClick={() => setShowCity(!showCity)} className="w-full flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-primary" /> Город доставки</span>
          <span className="text-sm text-primary">{city}</span>
        </button>
        {showCity && (
          <div className="space-y-1 animate-[fadeIn_0.2s_ease-out]">
            {cities.map(c => (
              <button
                key={c}
                onClick={() => { setCity(c); setShowCity(false); toast.success(`Город изменён на ${c}`); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm ${city === c ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Allergens */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <button onClick={() => setShowAllergens(!showAllergens)} className="w-full flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-amber-500" /> Мои аллергены</span>
          <span className="text-xs text-muted-foreground">{excludedAllergens.length} выбрано</span>
        </button>
        {showAllergens && (
          <div className="flex flex-wrap gap-2 animate-[fadeIn_0.2s_ease-out]">
            {allergenOptions.map(a => (
              <button
                key={a}
                onClick={() => toggleAllergen(a)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  excludedAllergens.includes(a) ? 'bg-destructive text-destructive-foreground border-destructive' : 'border-border'
                }`}
              >
                {excludedAllergens.includes(a) ? '✕ ' : ''}{a}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h4 className="flex items-center gap-2"><Bell className="w-4 h-4 text-primary" /> Уведомления</h4>
        {[
          { label: 'Статус заказов', value: notifOrders, toggle: () => setNotifOrders(!notifOrders) },
          { label: 'Акции и скидки', value: notifPromos, toggle: () => setNotifPromos(!notifPromos) },
          { label: 'Статус доставки', value: notifDelivery, toggle: () => setNotifDelivery(!notifDelivery) },
        ].map(item => (
          <button key={item.label} onClick={item.toggle} className="w-full flex items-center justify-between">
            <span className="text-sm">{item.label}</span>
            <div className={`w-10 h-6 rounded-full relative transition-colors ${item.value ? 'bg-primary' : 'bg-switch-background'}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${item.value ? 'right-1' : 'left-1'}`} />
            </div>
          </button>
        ))}
      </div>

      {/* Other */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <button onClick={() => toast.info('Смена языка в разработке')} className="w-full flex items-center gap-2 text-sm text-left">
          <Globe className="w-4 h-4 text-muted-foreground" /> Язык: Русский
        </button>
        <button onClick={() => toast.info('Политика конфиденциальности в разработке')} className="w-full flex items-center gap-2 text-sm text-left">
          <Shield className="w-4 h-4 text-muted-foreground" /> Политика конфиденциальности
        </button>
        <button onClick={() => toast.info('PureFood v1.0.0')} className="w-full flex items-center gap-2 text-sm text-left">
          <Moon className="w-4 h-4 text-muted-foreground" /> О приложении v1.0.0
        </button>
      </div>

      {/* Delete account */}
      {!showDeleteConfirm ? (
        <button onClick={() => setShowDeleteConfirm(true)} className="w-full flex items-center justify-center gap-2 text-destructive py-3 text-sm">
          <Trash2 className="w-4 h-4" /> Удалить аккаунт
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3 animate-[fadeIn_0.3s_ease-out]">
          <p className="text-sm text-red-700">Вы уверены? Все данные будут удалены безвозвратно.</p>
          <div className="flex gap-2">
            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 rounded-xl border border-border text-sm">Отмена</button>
            <button onClick={() => { setShowDeleteConfirm(false); toast.info('Функция недоступна в демо-версии'); }} className="flex-1 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm">Удалить</button>
          </div>
        </div>
      )}
    </div>
  );
}
