import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Leaf, Store } from 'lucide-react';

const slides = [
  {
    icon: ShieldCheck,
    iconBg: '#E8F5E9',
    iconColor: '#2d7a3a',
    badge: '✓ Лабораторный контроль',
    title: 'Проверяем составы',
    description: 'Каждый продукт проходит независимую лабораторную проверку. Мы изучаем состав, сертификаты и результаты тестов — прежде чем товар попадёт к вам.',
    points: ['Независимая лаборатория', 'Анализ состава и добавок', 'Публичные результаты тестов'],
    gradient: ['#f0fff4', '#e8f5e9'],
    accent: '#2d7a3a',
  },
  {
    icon: Leaf,
    iconBg: '#FFF8E1',
    iconColor: '#f59e0b',
    badge: '🌿 Без химии и Е-добавок',
    title: 'Только чистые продукты',
    description: 'Мы отбираем товары без искусственных красителей, консервантов и вредных Е-добавок. Только натуральные ингредиенты — для вашего здоровья и здоровья вашей семьи.',
    points: ['Без консервантов E2xx', 'Без синтетических красителей', 'Без усилителей вкуса'],
    gradient: ['#fffef0', '#fffbeb'],
    accent: '#d97706',
  },
  {
    icon: Store,
    iconBg: '#EFF6FF',
    iconColor: '#3b82f6',
    badge: '🏅 Верифицированные продавцы',
    title: 'Доверенные продавцы',
    description: 'Только проверенные фермеры и эко-производители. Мы лично посещаем хозяйства, проверяем условия производства и выдаём сертификат доверия PureFood.',
    points: ['Выезд на производство', 'Сертификат доверия', 'Регулярные повторные проверки'],
    gradient: ['#f0f7ff', '#eff6ff'],
    accent: '#2563eb',
  },
];

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const { setOnboarded } = useApp();

  const slide = slides[step];
  const IconComp = slide.icon;

  const next = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setOnboarded(true);
    }
  };

  return (
    <div className="flex justify-center bg-[#e8ede6] min-h-screen">
      <div className="w-full max-w-[430px] bg-background min-h-screen flex flex-col shadow-xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-12 pb-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === step ? '#2d7a3a' : '#c8e6c9',
              }}
            />
          ))}
        </div>

        {/* Skip */}
        {step < slides.length - 1 && (
          <div className="flex justify-end px-6 pt-2">
            <button
              onClick={() => setOnboarded(true)}
              className="text-muted-foreground text-sm px-3 py-1"
            >
              Пропустить
            </button>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center px-6 pt-4 pb-6 animate-[fadeIn_0.4s_ease-out]" key={step}>
          {/* Illustration card */}
          <div
            className="w-full rounded-3xl p-6 mb-6 flex flex-col items-center relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${slide.gradient[0]}, ${slide.gradient[1]})` }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" style={{ backgroundColor: slide.accent }} />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: slide.accent }} />

            {/* Badge */}
            <div
              className="px-4 py-1.5 rounded-full text-xs mb-5 relative z-10"
              style={{ backgroundColor: slide.iconBg, color: slide.accent }}
            >
              {slide.badge}
            </div>

            {/* Icon */}
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 shadow-lg relative z-10"
              style={{ backgroundColor: slide.iconBg }}
            >
              <IconComp style={{ width: 48, height: 48, color: slide.iconColor }} />
            </div>

            {/* Feature points */}
            <div className="w-full space-y-2 relative z-10 mt-2">
              {slide.points.map((point, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-white/60 backdrop-blur rounded-xl px-3 py-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: slide.accent }}
                  >
                    <span className="text-white text-[10px]">✓</span>
                  </div>
                  <span className="text-sm" style={{ color: slide.accent }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="text-center space-y-3">
            <h1 className="text-foreground">{slide.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{slide.description}</p>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="px-6 pb-10 space-y-3">
          <button
            onClick={next}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl flex items-center justify-center gap-2 transition-opacity active:opacity-80"
          >
            {step < slides.length - 1 ? 'Далее' : 'Начать'}
            <ArrowRight className="w-5 h-5" />
          </button>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full text-muted-foreground py-2 text-sm"
            >
              Назад
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
