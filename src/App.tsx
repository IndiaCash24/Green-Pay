/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Splash from './screens/Splash';
import Login from './screens/Login';
import MainLayout from './layouts/MainLayout';
import Home from './screens/Home';
import Profile from './screens/Profile';
import AdminLogin from './screens/AdminLogin';
import AdminDashboard from './screens/AdminDashboard';
import Notifications from './screens/Notifications';
import { AppProvider, useAppContext } from './context/AppContext';

import Repayment from './screens/Repayment';
import PaymentGateway from './screens/PaymentGateway';
import PaymentHistory from './screens/PaymentHistory';

import MyLoanDetails from './screens/MyLoanDetails';

export type Screen = 'splash' | 'login' | 'home' | 'profile' | 'admin-login' | 'admin' | 'notifications' | 'repayment' | 'payment-gateway' | 'payment-history' | 'my-loan-details';

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [paymentData, setPaymentData] = useState<{loanId: string, emiIds: string[], amount: number} | null>(null);
  const { currentUser } = useAppContext();

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        let nextScreen: Screen = 'login';
        if (currentUser && currentUser.id !== 'anonymous' && currentUser.id) {
          nextScreen = 'home';
        }
        window.history.replaceState({ screen: nextScreen }, "", `?screen=${nextScreen}`);
        setCurrentScreen(nextScreen);
      }, 2500); // 2.5 seconds splash screen
      return () => clearTimeout(timer);
    }
  }, [currentScreen, currentUser]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setCurrentScreen(event.state.screen);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const onNavigate = (screen: Screen) => {
    if (screen !== currentScreen) {
      window.history.pushState({ screen }, "", `?screen=${screen}`);
      setCurrentScreen(screen);
    }
  };

  return (
    <div className="mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-gray-50 bg-green-light/30 relative shadow-2xl ring-1 ring-gray-200 sm:rounded-[40px] sm:h-[800px] sm:my-auto sm:border-[8px] sm:border-gray-900">
      {currentScreen === 'splash' && <Splash />}
      {currentScreen === 'login' && <Login onLogin={() => onNavigate('home')} />}
      {currentScreen === 'admin-login' && <AdminLogin onBack={() => onNavigate('profile')} onLogin={() => onNavigate('admin')} />}
      {currentScreen === 'admin' && <AdminDashboard onLogout={() => onNavigate('profile')} />}
      
      {(currentScreen === 'home' || currentScreen === 'profile' || currentScreen === 'notifications' || currentScreen === 'repayment' || currentScreen === 'payment-gateway' || currentScreen === 'payment-history' || currentScreen === 'my-loan-details') && (
        <MainLayout currentScreen={currentScreen} onNavigate={onNavigate}>
          {currentScreen === 'home' && <Home onNotificationClick={() => onNavigate('notifications')} onNavigate={onNavigate} />}
          {currentScreen === 'profile' && <Profile onLogout={() => onNavigate('login')} onNavigate={onNavigate} />}
          {currentScreen === 'notifications' && <Notifications onBack={() => window.history.back()} />}
          {currentScreen === 'repayment' && <Repayment onBack={() => window.history.back()} onNavigate={onNavigate} onSetPaymentData={setPaymentData} />}
          {currentScreen === 'payment-gateway' && paymentData && <PaymentGateway paymentData={paymentData} onBack={() => window.history.back()} onNavigate={onNavigate} />}
          {currentScreen === 'payment-history' && <PaymentHistory onBack={() => window.history.back()} />}
          {currentScreen === 'my-loan-details' && <MyLoanDetails onBack={() => window.history.back()} />}
        </MainLayout>
      )}
    </div>
  );
}

