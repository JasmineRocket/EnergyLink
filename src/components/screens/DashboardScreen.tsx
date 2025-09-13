import React, { useState, useEffect } from 'react';
import { KBarChart } from '../stock/KBarChart';
import { KpiStat } from '../stock/KpiStat';
import { LiveTransactionsList } from '../stock/LiveTransactionsList';
import { TradePanel } from '../stock/TradePanel';
import { BackgroundFX } from '../fx/BackgroundFX';
import { AutoMatchStatusLive } from '../auto-match/AutoMatchStatusLive';

interface DashboardScreenProps {
  role: 'seller' | 'buyer';
  className?: string;
}

interface Transaction {
  id: string;
  time: string;
  neighbor: string;
  side: 'BUY' | 'SELL';
  quantity: string;
  price: string;
  status: 'EXECUTING' | 'SETTLED' | 'PENDING';
}

export function DashboardScreen({ role, className = '' }: DashboardScreenProps) {
  const [chartTimeframe, setChartTimeframe] = useState<'24H' | '7D' | '30D'>('24H');
  const [chartVariant, setChartVariant] = useState<'state_1' | 'state_2' | 'state_3' | 'state_4' | 'state_5' | 'state_6'>('state_1');
  const [kpiVariant, setKpiVariant] = useState<'value_1' | 'value_2' | 'value_3'>('value_1');
  const [transactionVariant, setTransactionVariant] = useState<'v1' | 'v2' | 'v3' | 'v4'>('v1');
  const [transactionFilter, setTransactionFilter] = useState<'ALL' | 'EXECUTING' | 'SETTLED'>('ALL');

  // Simulate live updates every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Cycle through chart variants
      setChartVariant(prev => {
        const variants: typeof chartVariant[] = ['state_1', 'state_2', 'state_3', 'state_4', 'state_5', 'state_6'];
        const currentIndex = variants.indexOf(prev);
        return variants[(currentIndex + 1) % variants.length];
      });

      // Cycle through KPI variants
      setKpiVariant(prev => {
        const variants: typeof kpiVariant[] = ['value_1', 'value_2', 'value_3'];
        const currentIndex = variants.indexOf(prev);
        return variants[(currentIndex + 1) % variants.length];
      });

      // Cycle through transaction variants
      setTransactionVariant(prev => {
        const variants: typeof transactionVariant[] = ['v1', 'v2', 'v3', 'v4'];
        const currentIndex = variants.indexOf(prev);
        return variants[(currentIndex + 1) % variants.length];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Mock data that changes based on variants
  const getKpiData = () => {
    const baseValues = {
      energyBought: { value: '12.5', change: '+2.3 kWh today', trend: 'up' as const },
      energySold: { value: '8.7', change: '+1.8 kWh today', trend: 'up' as const },
      remainingBudget: { value: '$85.50', change: '-$12.30 used', trend: 'neutral' as const },
      remainingCapacity: { value: '15.2', change: '-4.8 kWh used', trend: 'neutral' as const }
    };

    const variance = kpiVariant === 'value_1' ? 0 : kpiVariant === 'value_2' ? 0.1 : 0.2;
    
    return {
      ...baseValues,
      energyBought: {
        ...baseValues.energyBought,
        value: (12.5 + variance).toFixed(1)
      },
      energySold: {
        ...baseValues.energySold,
        value: (8.7 + variance * 0.5).toFixed(1)
      }
    };
  };

  const getTransactionData = (): Transaction[] => {
    const baseTransactions = [
      { id: '1', time: '14:32', neighbor: 'Sarah M.', side: 'BUY' as const, quantity: '5.2 kWh', price: '$0.145', status: 'EXECUTING' as const },
      { id: '2', time: '14:28', neighbor: 'James R.', side: 'SELL' as const, quantity: '3.8 kWh', price: '$0.152', status: 'SETTLED' as const },
      { id: '3', time: '14:25', neighbor: 'Lisa P.', side: 'BUY' as const, quantity: '7.1 kWh', price: '$0.148', status: 'SETTLED' as const },
      { id: '4', time: '14:20', neighbor: 'David C.', side: 'SELL' as const, quantity: '2.4 kWh', price: '$0.150', status: 'EXECUTING' as const },
      { id: '5', time: '14:15', neighbor: 'Emma W.', side: 'BUY' as const, quantity: '4.6 kWh', price: '$0.147', status: 'SETTLED' as const }
    ];

    // Slight variations based on variant
    if (transactionVariant === 'v2') {
      baseTransactions[0].status = 'SETTLED';
      baseTransactions[0].time = '14:33';
    } else if (transactionVariant === 'v3') {
      baseTransactions.unshift({
        id: '6', time: '14:35', neighbor: 'Mike T.', side: 'BUY', quantity: '6.3 kWh', price: '$0.149', status: 'EXECUTING'
      });
    } else if (transactionVariant === 'v4') {
      baseTransactions[3].status = 'SETTLED';
    }

    return baseTransactions;
  };

  const kpiData = getKpiData();
  const transactions = getTransactionData();

  return (
    <div className={`min-h-screen content-clean p-6 ${className}`}>
      <BackgroundFX variant="hybrid" intensity="md" interactive />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--txt-heading)' }}>
            Energy Trading Dashboard
          </h1>
          <p style={{ color: 'var(--txt-primary)' }}>Real-time market data and trading controls</p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chart - Takes 2/3 to 3/4 width */}
          <div className="lg:col-span-3">
            <AutoMatchStatusLive range={chartTimeframe === '24H' ? '24h' : chartTimeframe === '7D' ? '7d' : '30d'} />
          </div>

          {/* Account Status - Takes 1/3 to 1/4 width */}
          <div className="lg:col-span-1">
            <div className="dashboard-block h-full">
              <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--txt-heading)' }}>
                Account Status
              </h3>
              
              <div className="space-y-4">
                {/* KPIs */}
                <div className="space-y-3">
                  <div className="dashboard-block">
                    <p className="text-xs mb-1 metric-energy-secondary">Energy Bought Today</p>
                    <p className="text-lg font-semibold metric-energy-value">{kpiData.energyBought.value} kWh</p>
                    <p className="text-xs metric-energy-label">{kpiData.energyBought.change}</p>
                  </div>
                  
                  <div className="dashboard-block">
                    <p className="text-xs mb-1 metric-energy-secondary">Energy Sold Today</p>
                    <p className="text-lg font-semibold metric-energy-value">{kpiData.energySold.value} kWh</p>
                    <p className="text-xs metric-energy-label">{kpiData.energySold.change}</p>
                  </div>
                  
                  <div className="dashboard-block">
                    <p className="text-xs mb-1 metric-energy-secondary">
                      {role === 'buyer' ? 'Remaining Budget' : 'Remaining Capacity'}
                    </p>
                    <p className="text-lg font-semibold" style={{ color: 'var(--txt-heading)' }}>
                      {role === 'buyer' ? kpiData.remainingBudget.value : kpiData.remainingCapacity.value}
                    </p>
                    <p className="text-xs metric-energy-secondary">
                      {role === 'buyer' ? kpiData.remainingBudget.change : kpiData.remainingCapacity.change}
                    </p>
                  </div>
                </div>

                {/* Stacked bar - Used vs Remaining */}
                <div className="dashboard-block">
                  <p className="text-xs mb-2 metric-energy-secondary">Usage Overview</p>
                  <div className="w-full rounded-full h-2 mb-2" 
                       style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div className="h-2 rounded-full" 
                         style={{ 
                           width: '65%',
                           background: 'linear-gradient(90deg, var(--accent-energy-1), var(--accent-energy-2))'
                         }} />
                  </div>
                  <div className="flex justify-between text-xs metric-energy-secondary">
                    <span>Used 65%</span>
                    <span>35% remaining</span>
                  </div>
                </div>

                {/* Price band thermometer */}
                <div className="dashboard-block">
                  <p className="text-xs mb-2 metric-energy-secondary">Price Band</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-16 rounded-full relative" 
                         style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="absolute bottom-0 w-full h-3/4 rounded-full"
                           style={{ 
                             background: 'linear-gradient(to top, #ef4444, var(--accent-warning), var(--accent-energy-1))'
                           }} />
                      <div className="absolute w-3 h-1 rounded-full -right-0.5" 
                           style={{ 
                             bottom: '45%',
                             backgroundColor: 'var(--txt-heading)',
                             boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)'
                           }} />
                    </div>
                    <div className="text-xs space-y-1 metric-energy-secondary">
                      <div>Cap: $0.20</div>
                      <div className="font-semibold metric-energy-value">Now: $0.149</div>
                      <div>Export: $0.08</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Transactions */}
          <LiveTransactionsList
            transactions={transactions}
            filter={transactionFilter}
            onFilterChange={setTransactionFilter}
            variant={transactionVariant}
            className="h-full"
          />

          {/* Trade Panel */}
          <TradePanel
            role={role}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}