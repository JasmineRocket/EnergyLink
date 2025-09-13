import React, { useState, useEffect } from 'react';
import { KpiStat } from '../stock/KpiStat';
import { Tabs } from '../stock/Tabs';
import { LeaderboardRow } from '../stock/LeaderboardRow';
import { HeatMapCell } from '../stock/HeatMapCell';
import { ActivityItem } from '../stock/ActivityItem';
import { AchievementCard } from '../stock/AchievementCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin } from 'lucide-react';
import { BackgroundFX } from '../fx/BackgroundFX';

interface CommunityScreenNewProps {
  className?: string;
}

export function CommunityScreenNew({ className = '' }: CommunityScreenNewProps) {
  const [activeTimeframe, setActiveTimeframe] = useState('month');
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState('month');
  const [activityTab, setActivityTab] = useState('heatmap');
  const [selectedLocation, setSelectedLocation] = useState('mission');
  const [kpiVariant, setKpiVariant] = useState<'value_1' | 'value_2' | 'value_3'>('value_1');
  const [activityVariant, setActivityVariant] = useState<'v1' | 'v2' | 'v3'>('v1');

  // Simulate live updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiVariant(prev => {
        const variants: typeof kpiVariant[] = ['value_1', 'value_2', 'value_3'];
        const currentIndex = variants.indexOf(prev);
        return variants[(currentIndex + 1) % variants.length];
      });

      setActivityVariant(prev => {
        const variants: typeof activityVariant[] = ['v1', 'v2', 'v3'];
        const currentIndex = variants.indexOf(prev);
        return variants[(currentIndex + 1) % variants.length];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const timeframeTabs = [
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' },
    { id: 'alltime', label: 'All Time' }
  ];

  const leaderboardTabs = [
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' },
    { id: 'alltime', label: 'All Time' }
  ];

  const activityTabs = [
    { id: 'heatmap', label: 'Heat Map' },
    { id: 'recent', label: 'Recent Trades' }
  ];

  // Location data
  const locations = [
    { id: 'mission', name: 'Mission District', multiplier: 1.0 },
    { id: 'castro', name: 'Castro District', multiplier: 0.8 },
    { id: 'soma', name: 'SOMA', multiplier: 1.2 },
    { id: 'marina', name: 'Marina District', multiplier: 0.6 }
  ];

  // KPI data with variants and location-based multipliers
  const getKpiData = () => {
    const currentLocation = locations.find(loc => loc.id === selectedLocation) || locations[0];
    const timeframeMultiplier = activeTimeframe === 'week' ? 0.25 : activeTimeframe === 'alltime' ? 3.5 : 1.0;
    
    const baseData = [
      { title: 'TOTAL KWH TRADED', value: 1247, change: '+15% this month', trend: 'up' as const },
      { title: 'ACTIVE NEIGHBORS', value: 24, change: '+8 this week', trend: 'up' as const },
      { title: 'CO₂ SAVED (KG)', value: 156, change: '+120 this month', trend: 'up' as const },
      { title: 'COMMUNITY SAVINGS', value: 2840, change: '+$180 this week', trend: 'up' as const }
    ];

    const variance = kpiVariant === 'value_1' ? 0 : kpiVariant === 'value_2' ? 1 : 2;

    return baseData.map((item, index) => ({
      ...item,
      value: index === 0 ? Math.round((item.value + variance) * currentLocation.multiplier * timeframeMultiplier).toString() :
             index === 1 ? Math.round((item.value + Math.floor(variance / 2)) * currentLocation.multiplier).toString() :
             index === 2 ? Math.round((item.value + variance * 10) * currentLocation.multiplier * timeframeMultiplier).toString() :
             `${Math.round((item.value + variance * 50) * currentLocation.multiplier * timeframeMultiplier).toLocaleString()}`
    }));
  };

  const getLeaderboardData = () => {
    const baseData = {
      month: [
        { rank: 1, name: 'Sarah Miller', neighborhood: 'Oak Street', metric: '247 kWh TRADED', isCurrentUser: false },
        { rank: 2, name: 'James Rodriguez', neighborhood: 'Sunset District', metric: '198 kWh TRADED', isCurrentUser: false },
        { rank: 3, name: 'Lisa Park', neighborhood: 'Mission District', metric: '156 kWh TRADED', isCurrentUser: false },
        { rank: 4, name: 'David Chen', neighborhood: 'Castro District', metric: '134 kWh TRADED', isCurrentUser: false },
        { rank: 5, name: 'You', neighborhood: 'Mission District', metric: '127 kWh TRADED', isCurrentUser: true }
      ],
      week: [
        { rank: 1, name: 'Lisa Park', neighborhood: 'Mission District', metric: '67 kWh TRADED', isCurrentUser: false },
        { rank: 2, name: 'You', neighborhood: 'Mission District', metric: '54 kWh TRADED', isCurrentUser: true },
        { rank: 3, name: 'Sarah Miller', neighborhood: 'Oak Street', metric: '48 kWh TRADED', isCurrentUser: false },
        { rank: 4, name: 'Mike Chen', neighborhood: 'Castro District', metric: '39 kWh TRADED', isCurrentUser: false },
        { rank: 5, name: 'Emma Wilson', neighborhood: 'SOMA', metric: '31 kWh TRADED', isCurrentUser: false }
      ],
      alltime: [
        { rank: 1, name: 'Sarah Miller', neighborhood: 'Oak Street', metric: '1,247 kWh TRADED', isCurrentUser: false },
        { rank: 2, name: 'James Rodriguez', neighborhood: 'Sunset District', metric: '1,098 kWh TRADED', isCurrentUser: false },
        { rank: 3, name: 'Lisa Park', neighborhood: 'Mission District', metric: '956 kWh TRADED', isCurrentUser: false },
        { rank: 4, name: 'You', neighborhood: 'Mission District', metric: '834 kWh TRADED', isCurrentUser: true },
        { rank: 5, name: 'David Chen', neighborhood: 'Castro District', metric: '734 kWh TRADED', isCurrentUser: false }
      ]
    };
    
    return baseData[leaderboardTimeframe as keyof typeof baseData] || baseData.month;
  };

  const heatMapData = [
    { neighborhood: 'Mission', activity: 'high' as const, value: '18.2 kWh' },
    { neighborhood: 'Castro', activity: 'medium' as const, value: '12.1 kWh' },
    { neighborhood: 'SOMA', activity: 'high' as const, value: '16.8 kWh' },
    { neighborhood: 'Marina', activity: 'low' as const, value: '5.3 kWh' },
    { neighborhood: 'Richmond', activity: 'medium' as const, value: '9.7 kWh' },
    { neighborhood: 'Sunset', activity: 'high' as const, value: '21.4 kWh' },
    { neighborhood: 'Haight', activity: 'low' as const, value: '3.8 kWh' },
    { neighborhood: 'Nob Hill', activity: 'medium' as const, value: '11.2 kWh' },
    { neighborhood: 'Chinatown', activity: 'low' as const, value: '4.6 kWh' },
    { neighborhood: 'FIDI', activity: 'medium' as const, value: '13.5 kWh' },
    { neighborhood: 'Potrero', activity: 'high' as const, value: '19.1 kWh' },
    { neighborhood: 'Bernal', activity: 'medium' as const, value: '10.9 kWh' }
  ];

  const getActivityData = () => {
    const baseActivities = [
      { icon: '🔄⚡', text: 'Sarah Miller sold 12.5 kWh to James Rodriguez', timestamp: '2 minutes ago', type: 'trade' as const },
      { icon: '🏆', text: 'Lisa Park reached 100 kWh milestone this month!', timestamp: '15 minutes ago', type: 'milestone' as const },
      { icon: '🌱', text: 'Community saved 50 kg CO₂ today', timestamp: '1 hour ago', type: 'community' as const },
      { icon: '👋', text: 'David Chen joined EnergyLink', timestamp: '2 hours ago', type: 'user' as const },
      { icon: '⚡', text: 'You bought 8.2 kWh from Sarah Miller', timestamp: '3 hours ago', type: 'trade' as const }
    ];

    if (activityVariant === 'v2') {
      baseActivities.unshift({
        icon: '💰', text: 'Mike Thompson sold 15.3 kWh to Emma Wilson', timestamp: '1 minute ago', type: 'trade'
      });
    } else if (activityVariant === 'v3') {
      baseActivities[0].timestamp = '1 minute ago';
      baseActivities.unshift({
        icon: '🎯', text: 'Community reached 1000 kWh milestone!', timestamp: '30 seconds ago', type: 'milestone'
      });
    }

    return baseActivities;
  };

  const achievementData = [
    { icon: '🌱', title: 'Green Pioneer', subtitle: 'First 100 kWh traded', progress: 100, isCompleted: true },
    { icon: '⚡', title: 'Power Trader', subtitle: '50 successful trades', progress: 100, isCompleted: true },
    { icon: '🏆', title: 'Community Champion', subtitle: 'Top 3 in monthly leaderboard', progress: 60, isCompleted: false },
    { icon: '🌍', title: 'Eco Warrior', subtitle: 'Save 500 kg CO₂', progress: 35, isCompleted: false }
  ];

  const kpiData = getKpiData();
  const activityData = getActivityData();
  const leaderboardData = getLeaderboardData();

  return (
    <div className={`min-h-screen content-clean p-6 ${className}`}>
      <BackgroundFX variant="orbits" intensity="low" interactive />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--txt-heading)' }}>Community</h1>
            <div className="flex items-center space-x-2" style={{ color: 'var(--txt-muted)' }}>
              <MapPin className="w-4 h-4 icon-energy-cyan" />
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem 
                      key={location.id} 
                      value={location.id}
                    >
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs
            tabs={timeframeTabs}
            activeTab={activeTimeframe}
            onTabChange={setActiveTimeframe}
            variant="segmented"
          />
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <KpiStat
              key={index}
              title={kpi.title}
              value={kpi.value}
              change={kpi.change}
              trend={kpi.trend}
            />
          ))}
        </div>

        {/* Energy Champions */}
        <div className="dashboard-block">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--txt-heading)' }}>Energy Champions</h2>
            <Tabs
              tabs={leaderboardTabs}
              activeTab={leaderboardTimeframe}
              onTabChange={setLeaderboardTimeframe}
              variant="segmented"
            />
          </div>
          
          <div className="space-y-3">
            {leaderboardData.map((item) => (
              <LeaderboardRow
                key={item.rank}
                rank={item.rank}
                name={item.name}
                neighborhood={item.neighborhood}
                metric={item.metric}
                isCurrentUser={item.isCurrentUser}
              />
            ))}
          </div>
        </div>

        {/* Neighborhood Activity */}
        <div className="dashboard-block">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--txt-heading)' }}>Neighborhood Activity</h2>
            <Tabs
              tabs={activityTabs}
              activeTab={activityTab}
              onTabChange={setActivityTab}
              variant="segmented"
            />
          </div>

          {activityTab === 'heatmap' ? (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {heatMapData.map((cell, index) => (
                  <HeatMapCell
                    key={index}
                    activity={cell.activity}
                    neighborhood={cell.neighborhood}
                    value={cell.value}
                  />
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--accent-energy-1)' }} />
                  <span style={{ color: 'var(--txt-muted)' }}>High Activity (15+ kWh)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--accent-warning)' }} />
                  <span style={{ color: 'var(--txt-muted)' }}>Medium Activity (8-14 kWh)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                  <span style={{ color: 'var(--txt-muted)' }}>Low Activity (&lt;8 kWh)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {activityData.map((activity, index) => (
                <ActivityItem
                  key={index}
                  icon={activity.icon}
                  text={activity.text}
                  timestamp={activity.timestamp}
                  type={activity.type}
                />
              ))}
            </div>
          )}
        </div>

        {/* Community Achievements */}
        <div className="dashboard-block">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--txt-heading)' }}>Community Achievements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievementData.map((achievement, index) => (
              <AchievementCard
                key={index}
                icon={achievement.icon}
                title={achievement.title}
                subtitle={achievement.subtitle}
                progress={achievement.progress}
                isCompleted={achievement.isCompleted}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}