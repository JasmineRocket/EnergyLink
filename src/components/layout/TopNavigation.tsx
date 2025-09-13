import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { EnergyLinkLogo } from '../branding/Logo';
import { Home, Users, Settings, LogOut, User, Menu, X } from 'lucide-react';
import { AutoTradeToggle } from '../stock/AutoTradeToggle';

interface TopNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userRole?: 'seller' | 'buyer' | null;
  onSignOut?: () => void;
  autoTradeEnabled?: boolean;
  onAutoTradeToggle?: () => void;
}

export function TopNavigation({ 
  currentScreen, 
  onNavigate, 
  userRole, 
  onSignOut,
  autoTradeEnabled = true,
  onAutoTradeToggle
}: TopNavigationProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isDarkMode = ['dashboard', 'community', 'components'].includes(currentScreen);

  return (
    <>
    <nav className={`border-b px-4 md:px-6 py-4 ${
      isDarkMode 
        ? 'bg-[#111113] border-[#262626]' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <EnergyLinkLogo 
          size="md" 
          color={isDarkMode ? 'white' : 'default'} 
          showSubtitle={true}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? isDarkMode 
                      ? 'bg-[#00ff88] text-[#0a0a0b]' 
                      : 'bg-[#2E7D32] text-white'
                    : isDarkMode
                      ? 'text-[#64748b] hover:text-[#f8fafc] hover:bg-[#1a1a1d]'
                      : 'text-gray-600 hover:text-[#2E7D32] hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode 
                ? 'hover:bg-[#1a1a1d] text-[#f8fafc]'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <AutoTradeToggle 
            isEnabled={autoTradeEnabled}
            onToggle={onAutoTradeToggle}
            variant="pill"
          />
          {userRole && (
            <div className="text-right">
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-[#f8fafc]' : 'text-gray-900'
              }`}>
                {userRole === 'seller' ? 'Solar Seller' : 'Energy Buyer'}
              </p>
              <p className={`text-xs ${
                isDarkMode ? 'text-[#64748b]' : 'text-gray-500'
              }`}>Verified Neighbor</p>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`flex items-center space-x-2 rounded-lg p-1 ${
                isDarkMode ? 'hover:bg-[#1a1a1d]' : 'hover:bg-gray-50'
              }`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback className={`${
                    isDarkMode ? 'bg-[#00ff88] text-[#0a0a0b]' : 'bg-[#2E7D32] text-white'
                  }`}>
                    {userRole === 'seller' ? 'S' : 'B'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">Demo User</p>
                <p className="text-xs text-gray-500">demo@energylink.app</p>
              </div>
              
              <DropdownMenuItem 
                onClick={() => onNavigate('settings')}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-3" />
                Profile & Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={onSignOut}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    {showMobileMenu && (
      <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}>
        <div 
          className={`absolute top-16 left-0 right-0 shadow-lg ${
            isDarkMode 
              ? 'bg-[#111113] border-b border-[#262626]' 
              : 'bg-white border-b border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? isDarkMode 
                        ? 'bg-[#00ff88] text-[#0a0a0b]' 
                        : 'bg-[#2E7D32] text-white'
                      : isDarkMode
                        ? 'text-[#64748b] hover:text-[#f8fafc] hover:bg-[#1a1a1d]'
                        : 'text-gray-600 hover:text-[#2E7D32] hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
            
            {/* Mobile User Info */}
            <div className={`pt-4 border-t ${
              isDarkMode ? 'border-[#262626]' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3 px-4 py-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback className={`${
                    isDarkMode ? 'bg-[#00ff88] text-[#0a0a0b]' : 'bg-[#2E7D32] text-white'
                  }`}>
                    {userRole === 'seller' ? 'S' : 'B'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-[#f8fafc]' : 'text-gray-900'
                  }`}>Demo User</p>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-[#64748b]' : 'text-gray-500'
                  }`}>demo@energylink.app</p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  onSignOut?.();
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 mt-2 rounded-lg text-red-600 ${
                  isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}