import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface ToastMessage {
  id: number;
  text: string;
  description?: string;
  type: 'success' | 'info';
}

interface ToastContextType {
  success: (text: string) => void;
  info: (text: string, opts?: { description?: string }) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let globalId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((text: string, type: 'success' | 'info', description?: string) => {
    const id = ++globalId;
    setToasts(prev => [...prev, { id, text, type, description }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const success = useCallback((text: string) => addToast(text, 'success'), [addToast]);
  const info = useCallback((text: string, opts?: { description?: string }) => addToast(text, 'info', opts?.description), [addToast]);

  return (
    <ToastContext.Provider value={{ success, info }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 w-[90%] max-w-[380px]">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-start gap-2 p-3 rounded-xl shadow-lg border text-sm animate-[slideDown_0.3s_ease] ${
              t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {t.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <Info className="w-4 h-4 mt-0.5 shrink-0" />}
            <div className="flex-1">
              <p>{t.text}</p>
              {t.description && <p className="text-xs opacity-70 mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
