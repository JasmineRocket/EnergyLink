import React, { useState } from 'react';
import { AppButton } from '../design-system/AppButton';
import { EnergyLinkLogo } from '../branding/Logo';
import { Menu, X } from 'lucide-react';

interface MainNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  showAuthSection?: boolean;
}

export function MainNavigation({ currentScreen, onNavigate, showAuthSection = true }: MainNavigationProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'impact', label: 'Impact' },
  ];




  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block glass-nav px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center">
            <EnergyLinkLogo size="md" color="default" />
          </button>

          {/* Center Navigation */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    isActive 
                      ? 'tab-energy active' 
                      : 'tab-energy'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Section */}
          {showAuthSection && (
            <div className="flex items-center">
              <AppButton
                variant="primary"
                onClick={() => onNavigate('signup')}
              >
                Join for Free
              </AppButton>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden glass-nav px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center">
            <EnergyLinkLogo size="sm" color="default" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 glass-nav shadow-lg">
            <div className="p-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg font-medium transition-all hover:bg-glass-surface"
                  style={{ color: 'var(--txt-primary)' }}
                >
                  {item.label}
                </button>
              ))}
              
              {showAuthSection && (
                <div className="border-t pt-3" style={{ borderColor: 'rgba(0, 245, 212, 0.2)' }}>
                  <AppButton
                    variant="primary"
                    onClick={() => {
                      onNavigate('signup');
                      setShowMobileMenu(false);
                    }}
                    className="w-full"
                  >
                    Join for Free
                  </AppButton>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>


    </>
  );
}