import { useApp } from '../context/AppContext';
import { SplashScreen } from './SplashScreen';
import { OnboardingScreen } from './OnboardingScreen';
import { AuthScreen } from './AuthScreen';
import { MobileShell } from './MobileShell';

export function AppRouter() {
  const { showSplash, isOnboarded, isLoggedIn } = useApp();
  if (showSplash) return <SplashScreen />;
  if (!isOnboarded) return <OnboardingScreen />;
  if (!isLoggedIn) return <AuthScreen />;
  return <MobileShell />;
}
