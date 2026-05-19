import { useApp } from '../context/AppContext';
import { ArrowLeft, Gift, TrendingUp, ShoppingCart, MessageSquare, Camera, Video, RefreshCw, Star, Award, Sparkles } from 'lucide-react';
import { useToast } from './SimpleToast';

const earnRules = [
  { icon: ShoppingCart, label: 'С каждой покупки', points: '1% кэшбэк', description: 'Каждые 100 ₸ покупки = 1 балл' },
  { icon: Camera, label: 'Отзыв с фото', points: '+20 баллов', description: 'За каждый отзыв с фотографией' },
  { icon: Video, label: 'Отзыв с видео', points: '+50 баллов', description: 'За каждый видео-отзыв' },
  { icon: RefreshCw, label: 'Подписка на товар', points: '+30 баллов', description: 'За оформление регулярной доставки' },
];

const rewards = [
  { points: 50, label: 'Скидка 500 ₸', description: 'На любой заказ', emoji: '🏷️' },
  { points: 100, label: 'Бесплатная доставка', description: 'На 1 заказ', emoji: '🚚' },
  { points: 200, label: 'Скидка 2 000 ₸', description: 'На заказ от 5 000 ₸', emoji: '💰' },
  { points: 500, label: 'Скидка 5 000 ₸', description: 'На заказ от 10 000 ₸', emoji: '🎁' },
];

const levels = [
  { name: 'Новичок', min: 0, max: 299, multiplier: '1%', color: '#94a3b8' },
  { name: 'Знаток', min: 300, max: 699, multiplier: '1.5%', color: '#3b82f6' },
  { name: 'Эксперт', min: 700, max: 1499, multiplier: '2%', color: '#8b5cf6' },
  { name: 'Мастер', min: 1500, max: Infinity, multiplier: '3%', color: '#f59e0b' },
];

export function LoyaltyScreen() {
  const { goBack, loyaltyPoints } = useApp();
  const toast = useToast();

  const currentLevel = levels.find(l => loyaltyPoints >= l.min && loyaltyPoints <= l.max) || levels[0];
  const currentLevelIndex = levels.indexOf(currentLevel);
  const nextLevel = currentLevelIndex < levels.length - 1 ? levels[currentLevelIndex + 1] : null;
  const nextThreshold = nextLevel ? nextLevel.min : currentLevel.max;
  const progressInLevel = nextLevel
    ? ((loyaltyPoints - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  return (
    <div className="px-4 pt-6 pb-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2>Бонусы PureFood</h2>
      </div>

      {/* Points card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-5 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">Ваши баллы</p>
              <p className="text-4xl mt-1">{loyaltyPoints}</p>
              <p className="text-xs opacity-70 mt-1">= {(loyaltyPoints * 10).toLocaleString()} ₸ скидки</p>
            </div>
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
          </div>

          {/* Level progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentLevel.color }} />
                {currentLevel.name} · кэшбэк {currentLevel.multiplier}
              </span>
              {nextLevel && (
                <span className="opacity-70">{nextLevel.name} — {nextLevel.min} баллов</span>
              )}
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${Math.min(progressInLevel, 100)}%` }}
              />
            </div>
            {nextLevel && (
              <p className="text-[10px] opacity-60">
                Ещё {nextLevel.min - loyaltyPoints} баллов до уровня «{nextLevel.name}» (кэшбэк {nextLevel.multiplier})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* How to earn */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h4 className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Как заработать баллы
        </h4>
        <div className="space-y-3">
          {earnRules.map(item => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <item.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{item.label}</span>
                  <span className="text-primary text-xs font-medium">{item.points}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Levels overview */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h4 className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" /> Уровни лояльности
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {levels.map(level => {
            const isActive = level.name === currentLevel.name;
            return (
              <div
                key={level.name}
                className={`rounded-xl p-3 border text-center transition-all ${
                  isActive
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border opacity-60'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center"
                  style={{ backgroundColor: level.color + '20' }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: level.color }} />
                </div>
                <p className="text-xs font-medium">{level.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">от {level.min} баллов</p>
                <p className="text-xs text-primary mt-1">кэшбэк {level.multiplier}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards */}
      <div className="space-y-2">
        <h4 className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-primary" /> Награды
        </h4>
        {rewards.map(reward => {
          const canRedeem = loyaltyPoints >= reward.points;
          return (
            <div
              key={reward.points}
              className={`bg-card border rounded-2xl p-4 flex items-center gap-3 transition-all ${
                canRedeem ? 'border-primary/30 shadow-sm' : 'border-border opacity-60'
              }`}
            >
              <span className="text-2xl">{reward.emoji}</span>
              <div className="flex-1">
                <p className="text-sm">{reward.label}</p>
                <p className="text-xs text-muted-foreground">{reward.description}</p>
              </div>
              <button
                onClick={() =>
                  canRedeem
                    ? toast.success(`«${reward.label}» активирована!`)
                    : toast.info(`Нужно ещё ${reward.points - loyaltyPoints} баллов`)
                }
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                  canRedeem
                    ? 'bg-primary text-white active:bg-primary/80'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {reward.points} б.
              </button>
            </div>
          );
        })}
      </div>

      {/* History — empty state for new users */}
      <div className="space-y-2">
        <h4>История начислений</h4>
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            <Star className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm">У вас пока нет начислений</p>
          <p className="text-xs text-muted-foreground">Совершите первую покупку и получите бонусы</p>
        </div>
      </div>

      {/* Rules footer */}
      <div className="bg-secondary/50 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Правила программы</p>
        <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>1 балл = 10 ₸ скидки на следующий заказ</li>
          <li>Баллы начисляются после подтверждения доставки</li>
          <li>Баллы действуют 12 месяцев с момента начисления</li>
          <li>Баллы нельзя обменять на наличные</li>
          <li>Можно использовать до 30% от суммы заказа баллами</li>
        </ul>
      </div>
    </div>
  );
}
