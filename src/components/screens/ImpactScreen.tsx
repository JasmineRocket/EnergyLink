import React, { useState, useEffect } from 'react';
import { AppButton } from '../design-system/AppButton';
import { Card } from '../ui/card';
import { TrendingUp, Users, Leaf, DollarSign, Zap, ArrowUpIcon, ArrowDownIcon, Trophy, Target, Award, Star } from 'lucide-react';
import { BackgroundFX } from '../fx/BackgroundFX';

interface ImpactScreenProps {
  onJoinForFree: () => void;
}

interface KpiData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface ActivityItem {
  text: string;
  timestamp: string;
  type: 'trade' | 'milestone' | 'community';
}

interface Achievement {
  icon: string;
  title: string;
  subtitle: string;
  progress: number;
}

export function ImpactScreen({ onJoinForFree }: ImpactScreenProps) {
  const [currentVariant, setCurrentVariant] = useState(0);
  
  // Auto-advance variants every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVariant(prev => (prev + 1) % 3);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // KPI data with three variants for animation
  const kpiVariants: KpiData[][] = [
    [
      { title: 'TOTAL KWH TRADED', value: '18,247', change: '+127 today', trend: 'up', icon: <Zap className="w-6 h-6" /> },
      { title: 'ACTIVE NEIGHBORS', value: '342', change: '+12 this week', trend: 'up', icon: <Users className="w-6 h-6" /> },
      { title: 'CO₂ SAVED (KG)', value: '2,156', change: '+89 today', trend: 'up', icon: <Leaf className="w-6 h-6" /> },
      { title: 'COMMUNITY SAVINGS', value: '$52,840', change: '+$1,220 this week', trend: 'up', icon: <DollarSign className="w-6 h-6" /> }
    ],
    [
      { title: 'TOTAL KWH TRADED', value: '18,374', change: '+254 today', trend: 'up', icon: <Zap className="w-6 h-6" /> },
      { title: 'ACTIVE NEIGHBORS', value: '343', change: '+13 this week', trend: 'up', icon: <Users className="w-6 h-6" /> },
      { title: 'CO₂ SAVED (KG)', value: '2,245', change: '+178 today', trend: 'up', icon: <Leaf className="w-6 h-6" /> },
      { title: 'COMMUNITY SAVINGS', value: '$53,060', change: '+$1,440 this week', trend: 'up', icon: <DollarSign className="w-6 h-6" /> }
    ],
    [
      { title: 'TOTAL KWH TRADED', value: '18,489', change: '+369 today', trend: 'up', icon: <Zap className="w-6 h-6" /> },
      { title: 'ACTIVE NEIGHBORS', value: '345', change: '+15 this week', trend: 'up', icon: <Users className="w-6 h-6" /> },
      { title: 'CO₂ SAVED (KG)', value: '2,334', change: '+267 today', trend: 'up', icon: <Leaf className="w-6 h-6" /> },
      { title: 'COMMUNITY SAVINGS', value: '$53,280', change: '+$1,660 this week', trend: 'up', icon: <DollarSign className="w-6 h-6" /> }
    ]
  ];

  // Activity variants for animation
  const activityVariants: ActivityItem[][] = [
    [
      { text: 'Neighbor sold 12.5 kWh', timestamp: '2 minutes ago', type: 'trade' },
      { text: 'Community milestone reached', timestamp: '15 minutes ago', type: 'milestone' },
      { text: 'New neighbor joined network', timestamp: '1 hour ago', type: 'community' }
    ],
    [
      { text: 'Neighbor bought 8.3 kWh', timestamp: '1 minute ago', type: 'trade' },
      { text: 'Daily savings target met', timestamp: '12 minutes ago', type: 'milestone' },
      { text: 'Solar installation verified', timestamp: '45 minutes ago', type: 'community' }
    ],
    [
      { text: 'Neighbor traded 15.7 kWh', timestamp: '30 seconds ago', type: 'trade' },
      { text: 'Weekly CO₂ goal achieved', timestamp: '8 minutes ago', type: 'milestone' },
      { text: 'Community event scheduled', timestamp: '30 minutes ago', type: 'community' }
    ]
  ];

  const achievements: Achievement[] = [
    { icon: '🌱', title: 'Green Pioneer', subtitle: 'Community-wide adoption', progress: 100 },
    { icon: '⚡', title: 'Power Network', subtitle: 'Trading infrastructure', progress: 85 },
    { icon: '🏆', title: 'Eco Champions', subtitle: 'Environmental impact', progress: 67 },
    { icon: '🌍', title: 'Carbon Neutral', subtitle: 'CO₂ reduction goals', progress: 43 }
  ];

  const currentKpis = kpiVariants[currentVariant];
  const currentActivity = activityVariants[currentVariant];

  return (
    <div className="min-h-screen bg-white">
      <BackgroundFX variant="hybrid" intensity="low" interactive />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 via-white to-amber-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-[#2E7D32]">Impact</span> Together
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              See how neighbors across the city are building a cleaner, more affordable energy future through peer-to-peer trading.
            </p>
          </div>
        </div>
      </div>

      {/* Live KPI Section */}
      <div className="content-section-lg section-energy-glow">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" 
                style={{ color: 'var(--txt-heading)' }}>
              Our Impact Together
            </h2>
            <p className="text-lg" style={{ color: 'var(--txt-primary)' }}>
              Live updates from all EnergyLink neighborhoods
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {currentKpis.map((kpi, index) => (
              <div key={index} className="content-clean p-6 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                       style={{ backgroundColor: 'rgba(0, 245, 212, 0.1)' }}>
                    <div className="icon-energy-teal">{kpi.icon}</div>
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    kpi.trend === 'up' ? 'icon-energy-teal' : 'text-red-400'
                  }`}>
                    {kpi.trend === 'up' ? (
                      <ArrowUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium uppercase tracking-wide metric-energy-secondary">
                    {kpi.title}
                  </p>
                  <p className="text-2xl md:text-3xl font-semibold metric-energy-value">
                    {kpi.value}
                  </p>
                  <p className="text-sm metric-energy-label">
                    {kpi.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neighborhood Activity Section */}
      <div className="content-section-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Heat Map */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Neighborhood Activity</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { area: 'Mission', activity: 'high', value: '18.2' },
                  { area: 'Castro', activity: 'medium', value: '12.1' },
                  { area: 'SOMA', activity: 'high', value: '16.8' },
                  { area: 'Marina', activity: 'low', value: '5.3' },
                  { area: 'Richmond', activity: 'medium', value: '9.7' },
                  { area: 'Sunset', activity: 'high', value: '21.4' },
                  { area: 'Haight', activity: 'low', value: '3.8' },
                  { area: 'Nob Hill', activity: 'medium', value: '11.2' },
                  { area: 'FIDI', activity: 'medium', value: '13.5' }
                ].map((cell, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                      cell.activity === 'high' 
                        ? 'bg-green-100 border-green-200 text-green-800' 
                        : cell.activity === 'medium'
                        ? 'bg-amber-100 border-amber-200 text-amber-800'
                        : 'bg-gray-100 border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="text-sm font-medium">{cell.area}</div>
                    <div className="text-xs mt-1">{cell.value} kWh</div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded" />
                  <span className="text-gray-600">High (15+ kWh)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-400 rounded" />
                  <span className="text-gray-600">Medium (8-14 kWh)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded" />
                  <span className="text-gray-600">Low (&lt;8 kWh)</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
              
              <div className="space-y-4">
                {currentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'trade' ? 'bg-blue-400' :
                      activity.type === 'milestone' ? 'bg-green-400' :
                      'bg-purple-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">Updates every few seconds</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Community Achievements Section */}
      <div className="content-section-lg section-energy-glow">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4" 
                style={{ color: 'var(--txt-heading)' }}>
              Community Achievements
            </h2>
            <p className="text-lg" style={{ color: 'var(--txt-primary)' }}>
              Collective progress towards our sustainability goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{achievement.subtitle}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      achievement.progress === 100 ? 'bg-green-500' : 'bg-[#2E7D32]'
                    }`}
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">{achievement.progress}%</p>
                
                {achievement.progress === 100 && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Trophy className="w-3 h-3 mr-1" />
                      Completed
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="content-section-lg hero-energy-glow">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6" 
              style={{ color: 'var(--txt-heading)' }}>
            Ready to be part of the energy revolution?
          </h2>
          <p className="text-lg md:text-xl mb-8" 
             style={{ color: 'var(--txt-primary)' }}>
            Join your neighbors in building a cleaner, more affordable energy future for everyone.
          </p>
          
          <button
            className="btn-energy-primary px-8 py-4 text-lg min-w-[280px] flex items-center justify-center gap-3 mx-auto"
            onClick={onJoinForFree}
          >
            <Zap className="w-5 h-5 icon-energy-white" />
            Join for Free
          </button>
        </div>
      </div>
    </div>
  );
}