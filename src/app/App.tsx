import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/SimpleToast';
import { AppRouter } from './components/AppRouter';

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AppProvider>
  );
}
