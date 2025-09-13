import React, { useState, useEffect } from 'react';
import { AppButton } from '../design-system/AppButton';
import { AppInput } from '../design-system/AppInput';
import { Card } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { EnergyLinkLogo } from '../branding/Logo';
import { Mail, Lock, Info } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginScreenProps {
  onLoginSuccess: (role: 'seller' | 'buyer') => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('demo@energylink.app');
  const [password, setPassword] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-reinsert demo email if deleted
  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmail('demo@energylink.app');
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulate brief loading for realistic feel
    setTimeout(() => {
      toast.success("Signed in to demo mode");
      // Default to seller role for demo - could randomize or let user choose
      onLoginSuccess('seller');
      setIsLoading(false);
    }, 800);
  };

  const handleDemoLogin = () => {
    toast.success("Signed in to demo mode");
    onLoginSuccess('buyer'); // Different role for demo button
  };


  return (
    <div className="min-h-screen content-clean flex items-center justify-center py-8 hero-energy-glow">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <EnergyLinkLogo size="lg" color="gradient" className="justify-center" />
          <h1 className="text-2xl md:text-3xl font-semibold mb-2" 
              style={{ color: 'var(--txt-heading)' }}>Log in</h1>
          <p style={{ color: 'var(--txt-primary)' }}>Access your energy trading dashboard</p>
        </div>

        <div className="dashboard-block space-y-6">
          {/* Demo Notice */}
          <div className="demo-notice">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 icon-energy-cyan flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--txt-heading)' }}>Demo Mode</p>
                <p className="text-xs" style={{ color: 'var(--txt-primary)' }}>
                  This is a demo. Any email/password will sign you in.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <AppInput
              type="email"
              label="Email"
              value={email}
              onChange={setEmail}
              onBlur={handleEmailBlur}
              placeholder="demo@energylink.app"
              icon={<Mail className="w-5 h-5" />}
              required
            />
            
            <AppInput
              type="password"
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button 
              className="text-sm font-medium hover:underline transition-all"
              style={{ color: 'var(--accent-energy-1)' }}
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Forgot password?
            </button>
          </div>

          {/* Login Buttons */}
          <div className="space-y-3">
            <AppButton
              variant="primary"
              size="lg"
              onClick={handleLogin}
              disabled={isLoading}
              className="btn-enhanced w-full"
              icon={isLoading ? undefined : <Zap className="w-5 h-5" />}
            >
              {isLoading ? 'Signing in...' : 'Log in'}
            </AppButton>
            
            <AppButton
              variant="secondary"
              size="lg"
              onClick={handleDemoLogin}
              className="btn-enhanced w-full"
            >
              Continue as demo
            </AppButton>
          </div>

          {/* Demo Entry Label */}
          <div className="text-center pt-4" style={{ borderTop: '1px solid rgba(0, 245, 212, 0.2)' }}>
            <span className="text-xs px-3 py-1 rounded-full"
                  style={{ 
                    color: 'var(--txt-muted)',
                    backgroundColor: 'rgba(18, 24, 32, 0.4)'
                  }}>
              Demo entry
            </span>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: 'var(--txt-muted)' }}>
            Need help? Contact{' '}
            <a 
              href="mailto:support@energylink.com" 
              className="hover:underline transition-all"
              style={{ color: 'var(--accent-energy-1)' }}
            >
              support@energylink.com
            </a>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPasswordModal} onOpenChange={setShowForgotPasswordModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Forgot Password</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                   style={{ backgroundColor: 'rgba(46, 242, 255, 0.1)' }}>
                <Info className="w-8 h-8 icon-energy-cyan" />
              </div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--txt-heading)' }}>
                Demo Mode Active
              </h4>
              <p className="text-sm" style={{ color: 'var(--txt-primary)' }}>
                Demo mode does not require password recovery. Any password will work for login.
              </p>
            </div>
            
            <AppButton
              variant="primary"
              onClick={() => setShowForgotPasswordModal(false)}
              className="w-full"
            >
              Got it
            </AppButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}