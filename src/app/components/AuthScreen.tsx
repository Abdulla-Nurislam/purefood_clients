import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, ArrowRight, ChevronLeft, MapPin, User, ShieldCheck } from 'lucide-react';
import { cities } from '../data/mock-data';

type AuthStep = 'main' | 'phone' | 'sms' | 'profile';

// Google icon SVG
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export function AuthScreen() {
  const { setIsLoggedIn, setUserName, setPhone: setContextPhone, setCity, navigate } = useApp();
  const [step, setStep] = useState<AuthStep>('main');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState(['', '', '', '']);
  const [name, setName] = useState('');
  const [selectedCity, setSelectedCity] = useState('Алматы');
  const [isNewUser, setIsNewUser] = useState(true);
  const [smsError, setSmsError] = useState(false);
  const smsRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 1) return digits.startsWith('7') ? '+7' : digits ? '+7' : '';
    const local = digits.startsWith('7') ? digits.slice(1) : digits;
    let formatted = '+7';
    if (local.length > 0) formatted += ' (' + local.slice(0, 3);
    if (local.length >= 3) formatted += ') ' + local.slice(3, 6);
    if (local.length >= 6) formatted += '-' + local.slice(6, 8);
    if (local.length >= 8) formatted += '-' + local.slice(8, 10);
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setPhone(formatPhone(raw));
  };

  const handleSmsInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...smsCode];
    newCode[index] = value.slice(-1);
    setSmsCode(newCode);
    setSmsError(false);
    if (value && index < 3) {
      smsRefs[index + 1].current?.focus();
    }
  };

  const handleSmsKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !smsCode[index] && index > 0) {
      smsRefs[index - 1].current?.focus();
    }
  };

  const handleSendSms = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) return;
    setContextPhone(phone);
    setStep('sms');
  };

  const handleVerifySms = () => {
    const code = smsCode.join('');
    if (code === '1234') {
      if (isNewUser) {
        setStep('profile');
      } else {
        setIsLoggedIn(true);
        navigate('/home');
      }
    } else {
      setSmsError(true);
      setSmsCode(['', '', '', '']);
      smsRefs[0].current?.focus();
    }
  };

  const handleGoogleLogin = () => {
    setUserName('Google пользователь');
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleFinishProfile = () => {
    setUserName(name || 'Пользователь');
    setCity(selectedCity);
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleExistingUser = () => {
    setIsNewUser(false);
    setStep('phone');
  };

  // Main auth screen
  if (step === 'main') {
    return (
      <div className="flex justify-center bg-[#e8ede6] min-h-screen">
        <div className="w-full max-w-[430px] bg-background min-h-screen flex flex-col shadow-xl">
          {/* Header */}
          <div className="flex flex-col items-center pt-16 pb-8 px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-center mb-2">PureFood</h1>
            <p className="text-muted-foreground text-sm text-center">Маркетплейс чистых и проверенных продуктов</p>
          </div>

          <div className="flex-1 px-6 space-y-4">
            {/* Phone login */}
            <button
              onClick={() => { setIsNewUser(true); setStep('phone'); }}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl flex items-center justify-center gap-3"
            >
              <Phone className="w-5 h-5" />
              <span>Зарегистрироваться по телефону</span>
            </button>

            {/* Google login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-card border border-border py-4 rounded-2xl flex items-center justify-center gap-3 text-foreground"
            >
              <GoogleIcon />
              <span>Войти через Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-sm">или</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Existing user */}
            <button
              onClick={handleExistingUser}
              className="w-full border border-primary text-primary py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              <span>Уже есть аккаунт? Войти</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground px-8 pb-10 mt-6">
            Регистрируясь, вы соглашаетесь с{' '}
            <span className="text-primary">Условиями использования</span>{' '}
            и{' '}
            <span className="text-primary">Политикой конфиденциальности</span>
          </p>
        </div>
      </div>
    );
  }

  // Phone input
  if (step === 'phone') {
    const digits = phone.replace(/\D/g, '');
    const isValid = digits.length >= 11;
    return (
      <div className="flex justify-center bg-[#e8ede6] min-h-screen">
        <div className="w-full max-w-[430px] bg-background min-h-screen flex flex-col shadow-xl">
          <div className="px-4 pt-6">
            <button onClick={() => setStep('main')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 gap-6 animate-[fadeIn_0.3s_ease-out]">
            <div>
              <h2 className="mb-2">{isNewUser ? 'Регистрация' : 'Вход'}</h2>
              <p className="text-muted-foreground text-sm">Введите номер телефона. Мы отправим вам СМС-код для подтверждения.</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">Номер телефона</label>
              <div className="flex items-center gap-3 bg-input-background border border-border rounded-xl px-4 py-3">
                <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  type="tel"
                  className="flex-1 bg-transparent outline-none"
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div className="px-6 pb-10">
            <button
              onClick={handleSendSms}
              disabled={!isValid}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-opacity ${isValid ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              Получить СМС-код
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SMS code
  if (step === 'sms') {
    const isFilled = smsCode.every(d => d !== '');
    return (
      <div className="flex justify-center bg-[#e8ede6] min-h-screen">
        <div className="w-full max-w-[430px] bg-background min-h-screen flex flex-col shadow-xl">
          <div className="px-4 pt-6">
            <button onClick={() => setStep('phone')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 gap-6 animate-[fadeIn_0.3s_ease-out]">
            <div>
              <h2 className="mb-2">Введите код</h2>
              <p className="text-muted-foreground text-sm">СМС-код отправлен на номер</p>
              <p className="text-foreground text-sm mt-1">{phone}</p>
            </div>

            {/* 4-digit code input */}
            <div className="flex gap-3 justify-center">
              {smsCode.map((digit, i) => (
                <input
                  key={i}
                  ref={smsRefs[i]}
                  value={digit}
                  onChange={e => handleSmsInput(i, e.target.value)}
                  onKeyDown={e => handleSmsKeyDown(i, e)}
                  maxLength={1}
                  type="tel"
                  className={`w-14 h-14 text-center rounded-2xl border-2 bg-input-background outline-none transition-colors ${
                    smsError ? 'border-destructive' : digit ? 'border-primary' : 'border-border'
                  }`}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {smsError && (
              <p className="text-destructive text-sm text-center animate-[fadeIn_0.2s_ease-out]">
                Неверный код. Попробуйте снова. (Подсказка: 1234)
              </p>
            )}

            <button className="text-primary text-sm text-center">
              Отправить код повторно
            </button>
          </div>

          <div className="px-6 pb-10">
            <button
              onClick={handleVerifySms}
              disabled={!isFilled}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-opacity ${isFilled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              Подтвердить
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile setup (new users only)
  if (step === 'profile') {
    return (
      <div className="flex justify-center bg-[#e8ede6] min-h-screen">
        <div className="w-full max-w-[430px] bg-background min-h-screen flex flex-col shadow-xl">
          <div className="px-4 pt-6">
            <button onClick={() => setStep('sms')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col px-6 gap-5 pt-6 animate-[fadeIn_0.3s_ease-out]">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                <User className="w-7 h-7 text-primary" />
              </div>
              <h2 className="mb-1">Расскажите о себе</h2>
              <p className="text-muted-foreground text-sm">Заполните профиль, чтобы мы могли персонализировать рекомендации</p>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Ваше имя</label>
              <div className="flex items-center gap-3 bg-input-background border border-border rounded-xl px-4 py-3">
                <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Введите имя"
                  className="flex-1 bg-transparent outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Город доставки</label>
              <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
                {cities.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCity(c)}
                    className={`px-4 py-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedCity === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-card'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {c}
                    </span>
                    {selectedCity === c && <span className="text-sm">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 pb-10">
            <button
              onClick={handleFinishProfile}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              Начать покупки
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
