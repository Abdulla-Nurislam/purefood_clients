import { useApp } from '../context/AppContext';
import { ArrowLeft, Gift, Star, ShoppingCart, MessageSquare, TrendingUp } from 'lucide-react';
import { useToast } from './SimpleToast';

const rewards = [
  { points: 100, label: 'Скидка 1 000 ₸', description: 'На любой заказ' },
  { points: 250, label: 'Бесплатная доставка', description: 'На 3 заказа' },
  { points: 500, label: 'Скидка 5 000 ₸', description: 'На заказ от 10 000 ₸' },
  { points: 1000, label: 'Подарочный набор', description: 'Эко-набор от партнёров' },
];

const history = [
  { action: 'Заказ ST-20260328-001', points: '+53', icon: ShoppingCart },
  { action: 'Отзыв на мёд', points: '+20', icon: MessageSquare },
  { action: 'Заказ ST-20260320-039', points: '+32', icon: ShoppingCart },
  { action: 'Бонус за регистрацию', points: '+100', icon: Star },
];

export function LoyaltyScreen() {
  const { goBack, loyaltyPoints } = useApp();
  const toast = useToast();

  const currentLevel = loyaltyPoints < 300 ? 'Новичок' : loyaltyPoints < 700 ? 'Знаток' : 'Эксперт';
  const nextLevel = loyaltyPoints < 300 ? 'Знаток' : loyaltyPoints < 700 ? 'Эксперт' : 'Мастер';
  const nextThreshold = loyaltyPoints < 300 ? 300 : loyaltyPoints < 700 ? 700 : 1500;
  const progress = Math.min((loyaltyPoints / nextThreshold) * 100, 100);

  return (
    <div className="px-4 pt-6 pb-6 space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2>Бонусы и лояльность</h2>
      </div>

      {/* Points card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80">Ваши баллы</p>
            <p className="text-3xl mt-1">{loyaltyPoints}</p>
          </div>
          <Gift className="w-12 h-12 opacity-30" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{currentLevel}</span>
            <span>{nextLevel} — {nextThreshold} баллов</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="text-xs opacity-70 mt-3">1 балл = 10 ₸ скидки</p>
      </div>

      {/* How to earn */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h4 className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /> Как заработать</h4>
        <div className="space-y-2">
          {[
            { label: 'Каждые 100 ₸ покупки', points: '+1 балл' },
            { label: 'Отзыв с фото', points: '+20 баллов' },
            { label: 'Отзыв с видео', points: '+50 баллов' },
            { label: 'Оформить подписку', points: '+30 баллов' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="text-primary text-xs">{item.points}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div className="space-y-2">
        <h4>Награды</h4>
        {rewards.map(reward => {
          const canRedeem = loyaltyPoints >= reward.points;
          return (
            <div key={reward.points} className={`bg-card border rounded-2xl p-4 flex items-center justify-between ${canRedeem ? 'border-amber-200' : 'border-border opacity-60'}`}>
              <div>
                <p className="text-sm">{reward.label}</p>
                <p className="text-xs text-muted-foreground">{reward.description}</p>
              </div>
              <button
                onClick={() => canRedeem ? toast.success(`"${reward.label}" активирована!`) : toast.info(`Нужно ещё ${reward.points - loyaltyPoints} баллов`)}
                className={`px-3 py-1.5 rounded-xl text-xs ${canRedeem ? 'bg-amber-500 text-white active:bg-amber-600' : 'bg-muted text-muted-foreground'}`}
              >
                {reward.points} б.
              </button>
            </div>
          );
        })}
      </div>

      {/* History */}
      <div className="space-y-2">
        <h4>История начислений</h4>
        {history.map((item, i) => (
          <div key={i} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
            <item.icon className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-sm">{item.action}</span>
            <span className="text-xs text-primary">{item.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
