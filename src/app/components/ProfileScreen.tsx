import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, MapPin, Settings, Star, Heart, MessageSquare, LogOut, ChevronRight, ShieldCheck, Gift, RefreshCw, Package, Leaf } from 'lucide-react';

function EcoStatusWidget() {
  const [ecoPoints, setEcoPoints] = useState(() => {
    try {
      const stored = localStorage.getItem('purefood_eco_points');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const bonus = Math.floor(Math.random() * 5) + 1;
    setEcoPoints(prev => {
      const newVal = Math.min(prev + bonus, 100);
      try {
        localStorage.setItem('purefood_eco_points', String(newVal));
      } catch {
        // ignore
      }
      return newVal;
    });
  }, []);

  const getEcoLevel = (pts: number) => {
    if (pts >= 91) return { label: 'Эко-легенда', emoji: '🏆', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', barColor: 'bg-amber-500' };
    if (pts >= 61) return { label: 'Эко-герой', emoji: '🌍', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', barColor: 'bg-emerald-500' };
    if (pts >= 31) return { label: 'Защитник', emoji: '🌿', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', barColor: 'bg-green-500' };
    return { label: 'Новичок', emoji: '🌱', color: 'text-lime-600', bg: 'bg-lime-50', border: 'border-lime-200', barColor: 'bg-lime-500' };
  };

  const level = getEcoLevel(ecoPoints);

  const nextLevel = ecoPoints < 31 ? 'Защитник 🌿 (31)' : ecoPoints < 61 ? 'Эко-герой 🌍 (61)' : ecoPoints < 91 ? 'Эко-легенда 🏆 (91)' : 'Максимум!';

  return (
    <div className={`${level.bg} border ${level.border} rounded-2xl p-4 space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className={`w-5 h-5 ${level.color}`} />
          <div>
            <p className="text-sm font-medium">Эко-статус</p>
            <p className={`text-xs ${level.color}`}>{level.emoji} {level.label}</p>
          </div>
        </div>
        <span className={`text-lg font-bold ${level.color}`}>{ecoPoints}/100</span>
      </div>
      <div className="w-full bg-white/60 rounded-full h-2.5 overflow-hidden">
        <div
          className={`${level.barColor} rounded-full h-2.5`}
          style={{ width: `${ecoPoints}%`, transition: 'width 1s ease-out' }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground">Покупайте эко-продукты и повышайте свой эко-уровень. Следующий уровень: {nextLevel}</p>
    </div>
  );
}

export function ProfileScreen() {
  const { userName, email, avatarUrl, city, selectedPreferences, setOnboarded, setIsLoggedIn, navigate, loyaltyPoints, reviews, favorites, subscriptions, orders } = useApp();

  const menuItems = [
    { icon: Package, label: 'Мои заказы', count: orders.length, path: '/orders' },
    { icon: Heart, label: 'Избранное', count: favorites.length, path: '/favorites' },
    { icon: MessageSquare, label: 'Мои отзывы', count: reviews.length, path: '/my-reviews' },
    { icon: RefreshCw, label: 'Подписки', count: subscriptions.filter(s => s.active).length, path: '/subscriptions' },
    { icon: Gift, label: 'Бонусы и лояльность', extra: `${loyaltyPoints} баллов`, path: '/loyalty' },
    { icon: Settings, label: 'Настройки', path: '/settings' },
  ];

  return (
    <div className="px-4 pt-6 pb-4 space-y-4">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover shadow-sm" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
        )}
        <div>
          <h2>{userName || 'Пользователь'}</h2>
          {email ? (
            <p className="text-sm text-muted-foreground">{email}</p>
          ) : null}
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {city}</p>
        </div>
      </div>

      {/* Trust score */}
      <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Уровень доверия</p>
            <p className="text-2xl mt-1">Эксперт</p>
          </div>
          <ShieldCheck className="w-12 h-12 opacity-30" />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 w-[85%]" />
          </div>
          <span className="text-xs">85/100</span>
        </div>
      </div>

      {/* Eco status */}
      <EcoStatusWidget />

      {/* Loyalty quick card */}
      <button onClick={() => navigate('/loyalty')} className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <Gift className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-left">
            <p className="text-sm">{loyaltyPoints} баллов</p>
            <p className="text-xs text-amber-600">= {(loyaltyPoints * 10).toLocaleString()} ₸ скидки</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-amber-400" />
      </button>

      {/* Preferences */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h4 className="mb-2">Мои предпочтения</h4>
        <div className="flex flex-wrap gap-1.5">
          {selectedPreferences.length > 0 ? selectedPreferences.map(p => (
            <span key={p} className="text-xs bg-secondary text-primary px-2.5 py-1 rounded-full">{p}</span>
          )) : (
            <p className="text-sm text-muted-foreground">Не выбраны</p>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center justify-between bg-card border border-border rounded-2xl p-4"
          >
            <span className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-primary" />
              <span className="text-sm">{item.label}</span>
            </span>
            <div className="flex items-center gap-2">
              {item.count !== undefined && item.count > 0 && (
                <span className="text-xs bg-secondary text-primary px-2 py-0.5 rounded-full">{item.count}</span>
              )}
              {item.extra && (
                <span className="text-xs text-amber-600">{item.extra}</span>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

      <button onClick={() => { setIsLoggedIn(false); setOnboarded(false); }} className="w-full flex items-center justify-center gap-2 text-destructive py-3 mt-2">
        <LogOut className="w-5 h-5" /> Выйти
      </button>
    </div>
  );
}