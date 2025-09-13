import React, { useState } from 'react';
import { Toaster } from './components/ui/sonner';

// Import all screens
import { HomeScreen } from './components/screens/HomeScreen';
import { HowItWorksScreen } from './components/screens/HowItWorksScreen';
import { ImpactScreen } from './components/screens/ImpactScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { SignupScreen } from './components/screens/SignupScreen';
import { VerificationScreen } from './components/screens/VerificationScreen';
import { PriceBandScreenDesktop } from './components/screens/PriceBandScreenDesktop';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { TradeReceiptScreenDesktop } from './components/screens/TradeReceiptScreenDesktop';
import { CommunityScreenNew } from './components/screens/CommunityScreenNew';
import { SettingsScreenDesktop } from './components/screens/SettingsScreenDesktop';
import { ComponentsScreen } from './components/screens/ComponentsScreen';
import { StyleGuideScreen } from './components/screens/StyleGuideScreen';
import { MainNavigation } from './components/layout/MainNavigation';
import { TopNavigation } from './components/layout/TopNavigation';

type Screen = 'home' | 'how-it-works' | 'impact' | 'community' | 'login' | 'signup' | 'verification' | 'priceband' | 'dashboard' | 'receipt' | 'settings' | 'components';
type Role = 'seller' | 'buyer' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [userRole, setUserRole] = useState<Role>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(true);
  const [signupData, setSignupData] = useState<{
    role: 'seller' | 'buyer';
    email: string;
    phone: string;
    verifyBy: 'email' | 'sms';
  } | null>(null);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleJoinForFree = () => {
    navigate('signup');
  };

  const handleLoginSuccess = (role: 'seller' | 'buyer') => {
    setUserRole(role);
    setIsLoggedIn(true);
    navigate('dashboard');
  };

  const handleSignOut = () => {
    setUserRole(null);
    setIsLoggedIn(false);
    navigate('login');
  };

  const handleSignupComplete = (data: { role: 'seller' | 'buyer'; email: string; phone: string; verifyBy: 'email' | 'sms' }) => {
    setSignupData(data);
    setUserRole(data.role);
    navigate('verification');
  };

  const handleVerified = () => {
    navigate('priceband');
  };

  const handleTradeClick = (trade: any) => {
    setSelectedTrade(trade);
    navigate('receipt');
  };

  const showMainNav = !['verification', 'priceband'].includes(currentScreen) && !isLoggedIn;
  const showTopNav = ['dashboard', 'receipt', 'settings', 'community', 'components'].includes(currentScreen) && isLoggedIn;
  const showAuthSection = !['dashboard', 'receipt', 'settings', 'community'].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onJoinForFree={handleJoinForFree} />;
      
      case 'how-it-works':
        return <HowItWorksScreen onJoinForFree={handleJoinForFree} />;
      
      case 'impact':
        return <ImpactScreen onJoinForFree={handleJoinForFree} />;
      
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      
      case 'signup':
        return <SignupScreen onComplete={handleSignupComplete} />;
      
      case 'verification':
        return signupData ? (
          <VerificationScreen
            verifyBy={signupData.verifyBy}
            email={signupData.email}
            phone={signupData.phone}
            onVerified={handleVerified}
          />
        ) : null;
      
      case 'priceband':
        return (
          <PriceBandScreenDesktop
            role={userRole!}
            onComplete={() => {
              setIsLoggedIn(true);
              navigate('dashboard');
            }}
          />
        );
      
      case 'dashboard':
        if (!isLoggedIn) {
          navigate('login');
          return null;
        }
        return (
          <DashboardScreen
            role={userRole!}
          />
        );
      
      case 'receipt':
        if (!isLoggedIn) {
          navigate('login');
          return null;
        }
        return (
          <TradeReceiptScreenDesktop
            role={userRole!}
            trade={selectedTrade}
            onBack={() => navigate('dashboard')}
          />
        );
      
      case 'community':
        if (!isLoggedIn) {
          navigate('login');
          return null;
        }
        return <CommunityScreenNew />;
      
      case 'settings':
        if (!isLoggedIn) {
          navigate('login');
          return null;
        }
        return (
          <SettingsScreenDesktop 
            isDarkMode={isDarkMode}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          />
        );
      
      case 'components':
        return <ComponentsScreen />;
      
      default:
        return <HomeScreen onJoinForFree={handleJoinForFree} />;
    }
  };

  return (
    <div className="min-h-screen dark" 
         style={{ background: 'linear-gradient(180deg, #0B0F14 0%, #121820 100%)' }}>
      {showMainNav && (
        <MainNavigation 
          currentScreen={currentScreen}
          onNavigate={navigate}
          showAuthSection={showAuthSection}
        />
      )}
      {showTopNav && (
        <TopNavigation 
          currentScreen={currentScreen}
          onNavigate={navigate}
          userRole={userRole}
          onSignOut={handleSignOut}
          autoTradeEnabled={autoTradeEnabled}
          onAutoTradeToggle={() => setAutoTradeEnabled(!autoTradeEnabled)}
        />
      )}
      {renderScreen()}
      <Toaster />
    </div>
  );
}