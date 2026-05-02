import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Leaf, Heart } from 'lucide-react';

export function SplashScreen() {
  const { setShowSplash } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, [setShowSplash]);

  return (
    <div className="flex justify-center bg-[#e8ede6] min-h-screen">
      <div className="w-full max-w-[430px] bg-gradient-to-b from-primary to-emerald-700 min-h-screen flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full animate-[pulse_3s_ease-in-out_infinite_1s]" />
          <div className="absolute top-1/3 right-0 w-40 h-40 bg-white/3 rounded-full animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center gap-6 animate-[fadeIn_0.8s_ease-out]">
          <div className="w-24 h-24 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center animate-[bounceIn_0.6s_ease-out]">
            <ShieldCheck className="w-14 h-14 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-white text-3xl tracking-tight">PureFood</h1>
            <p className="text-white/70 text-sm mt-2">Чистые продукты Казахстана</p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 flex gap-8 mt-12 animate-[fadeIn_1s_ease-out_0.5s_both]">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white/80" />
            </div>
            <span className="text-[10px] text-white/60">Верификация</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white/80" />
            </div>
            <span className="text-[10px] text-white/60">Органик</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white/80" />
            </div>
            <span className="text-[10px] text-white/60">Здоровье</span>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="absolute bottom-16 flex gap-1.5 animate-[fadeIn_1s_ease-out_1s_both]">
          <div className="w-2 h-2 bg-white/40 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          <div className="w-2 h-2 bg-white/40 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.2s]" />
          <div className="w-2 h-2 bg-white/40 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.4s]" />
        </div>
      </div>
    </div>
  );
}