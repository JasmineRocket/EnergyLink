import React from 'react';
import { AppButton } from '../design-system/AppButton';
import { Card } from '../ui/card';
import { Home, Zap, Users, DollarSign, Leaf, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { HomeFX } from '../fx/HomeFX';

interface HomeScreenProps {
  onJoinForFree: () => void;
}

export function HomeScreen({ onJoinForFree }: HomeScreenProps) {
  const steps = [
    {
      number: 1,
      title: 'Verify address',
      description: 'Confirm your location to connect with nearby neighbors',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      number: 2,
      title: 'Set price/budget',
      description: 'Configure your trading preferences and daily limits',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      number: 3,
      title: 'Auto-match',
      description: 'Our system automatically finds compatible neighbors',
      icon: <Zap className="w-6 h-6" />
    },
    {
      number: 4,
      title: 'Get receipts',
      description: 'Track all trades with detailed transaction history',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen content-clean">
      <HomeFX intensity="md" interactive scrim />
      {/* Hero Section */}
      <div className="relative overflow-hidden hero-energy-glow">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          {/* Full-width text stack */}
          <div className="max-w-4xl">
            <div className="space-y-8 text-left">
              {/* Headline */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight" 
                    style={{ color: 'var(--txt-heading)' }}>
                  Trade solar locally.<br />
                  <span className="text-energy-gradient">Keep the value</span> on your block.
                </h1>
                <p className="text-lg md:text-xl leading-relaxed max-w-3xl" 
                   style={{ color: 'var(--txt-primary)' }}>
                  Connect with neighbors to buy and sell solar energy directly. 
                  Get better prices than utilities while supporting local clean power.
                </p>
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <button 
                  className="btn-energy-primary px-8 py-4 text-lg"
                  onClick={onJoinForFree}
                >
                  <Zap className="w-5 h-5 mr-2 icon-energy-white" />
                  Join for Free
                </button>
                
                {/* Helper Text */}
                <div className="pt-2">
                  <p className="text-sm" style={{ color: 'var(--txt-muted)' }}>
                    💡 You can switch between Seller and Buyer later
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: 'var(--accent-energy-1)' }}></div>
                  <span className="text-sm" style={{ color: 'var(--txt-primary)' }}>
                    Verified neighbors only
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: 'var(--accent-energy-1)' }}></div>
                  <span className="text-sm" style={{ color: 'var(--txt-primary)' }}>
                    Automatic payments
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: 'var(--accent-energy-1)' }}></div>
                  <span className="text-sm" style={{ color: 'var(--txt-primary)' }}>
                    Privacy protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="content-section-lg section-energy-glow">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" 
                style={{ color: 'var(--txt-heading)' }}>How it works</h2>
            <p className="text-lg md:text-xl" 
               style={{ color: 'var(--txt-primary)' }}>
              Get started in minutes with our simple 4-step process
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="content-clean p-6 text-center transition-all duration-200 hover:transform hover:scale-105">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                       style={{ 
                         background: 'linear-gradient(135deg, var(--accent-energy-1), var(--accent-energy-2))',
                         boxShadow: 'var(--glow-teal)'
                       }}>
                    <span className="text-lg font-semibold" 
                          style={{ color: 'var(--bg-page)' }}>{step.number}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
                         style={{ backgroundColor: 'rgba(0, 245, 212, 0.1)' }}>
                      <div className="icon-energy-teal">{step.icon}</div>
                    </div>
                    <h3 className="text-lg font-semibold" 
                        style={{ color: 'var(--txt-heading)' }}>{step.title}</h3>
                    <p className="text-sm" 
                       style={{ color: 'var(--txt-primary)' }}>{step.description}</p>
                  </div>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 icon-energy-cyan" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="content-section-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-3xl md:text-4xl font-semibold mb-4" 
                style={{ color: 'var(--txt-heading)' }}>Why choose peer-to-peer energy?</h3>
            <p className="text-lg md:text-xl" 
               style={{ color: 'var(--txt-primary)' }}>
              Better prices, cleaner energy, stronger communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="content-clean p-6 md:p-8 text-center transition-all duration-200 hover:transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                   style={{ backgroundColor: 'rgba(0, 245, 212, 0.1)' }}>
                <DollarSign className="w-8 h-8 icon-energy-teal" />
              </div>
              <h4 className="text-xl font-semibold mb-4" 
                  style={{ color: 'var(--txt-heading)' }}>Better Prices</h4>
              <p style={{ color: 'var(--txt-primary)' }}>
                Sellers earn 2-3x more than utility rates. Buyers save 20-30% on electricity costs.
              </p>
            </div>

            <div className="content-clean p-6 md:p-8 text-center transition-all duration-200 hover:transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                   style={{ backgroundColor: 'rgba(0, 245, 212, 0.1)' }}>
                <Leaf className="w-8 h-8 icon-energy-teal" />
              </div>
              <h4 className="text-xl font-semibold mb-4" 
                  style={{ color: 'var(--txt-heading)' }}>Local Clean Energy</h4>
              <p style={{ color: 'var(--txt-primary)' }}>
                Support renewable energy in your neighborhood. Reduce transmission losses and carbon footprint.
              </p>
            </div>

            <div className="content-clean p-6 md:p-8 text-center transition-all duration-200 hover:transform hover:scale-105">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                   style={{ backgroundColor: 'rgba(0, 245, 212, 0.1)' }}>
                <Users className="w-8 h-8 icon-energy-teal" />
              </div>
              <h4 className="text-xl font-semibold mb-4" 
                  style={{ color: 'var(--txt-heading)' }}>Community Building</h4>
              <p style={{ color: 'var(--txt-primary)' }}>
                Connect with neighbors, build energy resilience, and create a more sustainable community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="content-section-lg section-energy-glow">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-semibold mb-2 metric-energy-value">2,450+</div>
              <div className="metric-energy-label">Active Neighbors</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold mb-2 metric-energy-value">156,000</div>
              <div className="metric-energy-label">kWh Traded Monthly</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold mb-2 metric-energy-value">$47,200</div>
              <div className="metric-energy-label">Community Savings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-semibold mb-2 metric-energy-value">89.2%</div>
              <div className="metric-energy-label">CO₂ Reduction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}