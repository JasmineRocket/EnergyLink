import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Dot, ReferenceLine, Tooltip, Customized } from 'recharts';
import { Circle } from 'lucide-react';

interface DataPoint {
  time: string;
  value: number;
  timestamp: number;
  displayTime: string;
}

interface CrosshairState {
  x: number;
  y: number;
  isVisible: boolean;
  data: DataPoint | null;
}

interface AutoMatchStatusLiveProps {
  range?: '24h' | '7d' | '30d';
  className?: string;
}

const RANGE_CONFIGS = {
  '24h': {
    maxPoints: 120,
    intervalMs: 1200, // 1.2 seconds
    timeFormat: (index: number) => {
      const hour = Math.floor(index / 5);
      return `${hour}h`;
    },
  },
  '7d': {
    maxPoints: 168,
    intervalMs: 1000, // 1 second
    timeFormat: (index: number) => {
      const day = Math.floor(index / 24);
      return `Day ${day + 1}`;
    },
  },
  '30d': {
    maxPoints: 240,
    intervalMs: 1800, // 1.8 seconds
    timeFormat: (index: number) => {
      const week = Math.floor(index / 48);
      return `W${week + 1}`;
    },
  },
};

export function AutoMatchStatusLive({ 
  range = '24h',
  className = '' 
}: AutoMatchStatusLiveProps) {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [crosshair, setCrosshair] = useState<CrosshairState>({
    x: 0,
    y: 0,
    isVisible: false,
    data: null,
  });
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastValueRef = useRef<number>(0.145);
  const dataIndexRef = useRef<number>(0);
  const chartRef = useRef<any>(null);

  const config = RANGE_CONFIGS[range];

  // Check for reduced motion preference
  const checkReducedMotion = useCallback(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const dataAttribute = document.documentElement.getAttribute('data-reduce-motion');
    return mediaQuery.matches || dataAttribute === 'true';
  }, []);

  // Format timestamp for display
  const formatDisplayTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }, []);

  // Generate initial data
  const generateInitialData = useCallback(() => {
    const initialData: DataPoint[] = [];
    const now = Date.now();
    const baseValue = 0.145;

    for (let i = 0; i < Math.min(20, config.maxPoints); i++) {
      const timeAgo = (config.maxPoints - i) * config.intervalMs;
      const timestamp = now - timeAgo;
      
      // Generate realistic price movement
      const trend = Math.sin(i * 0.1) * 0.01;
      const noise = (Math.random() - 0.5) * 0.005;
      const value = Math.max(0.08, Math.min(0.25, baseValue + trend + noise));

      initialData.push({
        time: config.timeFormat(i),
        value: Number(value.toFixed(3)),
        timestamp,
        displayTime: formatDisplayTime(timestamp),
      });
    }

    lastValueRef.current = initialData[initialData.length - 1]?.value || baseValue;
    dataIndexRef.current = initialData.length;
    return initialData;
  }, [config, formatDisplayTime]);

  // Generate new data point
  const generateNewPoint = useCallback(() => {
    const now = Date.now();
    const lastValue = lastValueRef.current;
    
    // Generate realistic price movement
    const trend = (Math.random() - 0.5) * 0.002; // Small trend
    const noise = (Math.random() - 0.5) * 0.003; // Random noise
    const momentum = (Math.random() - 0.5) * 0.001; // Momentum factor
    
    const newValue = Math.max(0.08, Math.min(0.25, lastValue + trend + noise + momentum));
    lastValueRef.current = newValue;

    const newPoint: DataPoint = {
      time: config.timeFormat(dataIndexRef.current),
      value: Number(newValue.toFixed(3)),
      timestamp: now,
      displayTime: formatDisplayTime(now),
    };

    dataIndexRef.current++;

    return newPoint;
  }, [config, formatDisplayTime]);

  // Add new data point
  const addDataPoint = useCallback(() => {
    if (isReducedMotion) return;

    const newPoint = generateNewPoint();
    
    setData(prevData => {
      const newData = [...prevData, newPoint];
      
      // Keep only the last maxPoints
      if (newData.length > config.maxPoints) {
        return newData.slice(-config.maxPoints);
      }
      
      return newData;
    });
  }, [generateNewPoint, config.maxPoints, isReducedMotion]);

  // Start/stop live updates
  const startLiveUpdates = useCallback(() => {
    if (isReducedMotion) return;

    setIsLive(true);
    intervalRef.current = setInterval(() => {
      addDataPoint();
    }, config.intervalMs + Math.random() * 800); // Add some randomness
  }, [addDataPoint, config.intervalMs, isReducedMotion]);

  const stopLiveUpdates = useCallback(() => {
    setIsLive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  // Initialize data and start updates
  useEffect(() => {
    const reducedMotion = checkReducedMotion();
    setIsReducedMotion(reducedMotion);
    
    const initialData = generateInitialData();
    setData(initialData);

    if (!reducedMotion) {
      startLiveUpdates();
    }

    return () => {
      stopLiveUpdates();
    };
  }, [checkReducedMotion, generateInitialData, startLiveUpdates, stopLiveUpdates]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLiveUpdates();
      } else if (!isReducedMotion) {
        startLiveUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [startLiveUpdates, stopLiveUpdates, isReducedMotion]);

  // Handle reduced motion changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => {
      const reducedMotion = checkReducedMotion();
      setIsReducedMotion(reducedMotion);
      
      if (reducedMotion) {
        stopLiveUpdates();
      } else {
        startLiveUpdates();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [checkReducedMotion, startLiveUpdates, stopLiveUpdates]);

  // Calculate current metrics
  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || currentValue;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;

  const formatPrice = (value: number) => `$${value.toFixed(3)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(3)}`;
  const formatChangePercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`;

  // Crosshair component
  const Crosshair = useCallback((props: any) => {
    if (!crosshair.isVisible || !crosshair.data) return null;

    const { width, height } = props;
    const { x, y } = crosshair;

    return (
      <g>
        {/* Vertical line */}
        <line
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="rgba(0, 245, 212, 0.25)"
          strokeWidth={1}
          strokeDasharray="2,2"
        />
        {/* Horizontal line */}
        <line
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="rgba(0, 245, 212, 0.25)"
          strokeWidth={1}
          strokeDasharray="2,2"
        />
        {/* Data point dot */}
        <circle
          cx={x}
          cy={y}
          r={4}
          fill="#00F5D4"
          stroke="#ffffff"
          strokeWidth={2}
          filter="drop-shadow(0 0 4px rgba(0, 245, 212, 0.6))"
        />
      </g>
    );
  }, [crosshair]);

  // Current time line component
  const CurrentTimeLine = useCallback((props: any) => {
    const { width, height } = props;
    const rightmostX = width - 20; // Position at right edge with some padding

    return (
      <line
        x1={rightmostX}
        y1={0}
        x2={rightmostX}
        y2={height}
        stroke="rgba(46, 242, 255, 0.4)"
        strokeWidth={1}
        strokeDasharray="1,3"
      />
    );
  }, []);

  // Custom tooltip
  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{data.displayTime}</p>
          <p className="text-[#00F5D4] font-semibold">{formatPrice(data.value)}</p>
        </div>
      );
    }
    return null;
  }, [formatPrice]);

  // Handle mouse move for crosshair
  const handleMouseMove = useCallback((event: any) => {
    if (!chartRef.current) return;

    const { x, y } = event;
    const chartData = data;
    
    if (chartData.length === 0) return;

    // Find nearest data point
    const chartWidth = chartRef.current.props.width || 800;
    const dataIndex = Math.round((x / chartWidth) * (chartData.length - 1));
    const nearestData = chartData[Math.max(0, Math.min(dataIndex, chartData.length - 1))];

    setCrosshair({
      x,
      y,
      isVisible: true,
      data: nearestData,
    });
  }, [data]);

  const handleMouseLeave = useCallback(() => {
    setCrosshair(prev => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <div className={`auto-match-live bg-[#111113] border border-[#262626] rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">Auto-Match Status</h3>
          {isLive && !isReducedMotion ? (
            <div className="flex items-center space-x-2">
              <Circle className="w-2 h-2 fill-green-400 text-green-400 live-indicator" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Circle className="w-2 h-2 fill-gray-400 text-gray-400" />
              <span className="text-xs text-gray-400 font-medium">PAUSED</span>
            </div>
          )}
        </div>

        {/* Timeframe selector */}
        <div className="flex space-x-1 bg-[#1a1a1a] rounded-lg p-1">
          {(['24h', '7d', '30d'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => {
                // Reset data when changing timeframe
                const initialData = generateInitialData();
                setData(initialData);
                dataIndexRef.current = initialData.length;
              }}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                range === timeframe
                  ? 'bg-[#00ff88] text-black font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {timeframe.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Current Price Display */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-3">
          <span className="text-3xl font-bold text-white">{formatPrice(currentValue)}</span>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatChange(change)}
            </span>
            <span className={`text-sm font-medium ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              ({formatChangePercent(changePercent)})
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            ref={chartRef}
            data={data} 
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00F5D4" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.1} />
            <XAxis 
              dataKey="displayTime" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              interval="preserveStartEnd"
              type="category"
              scale="point"
            />
            <YAxis 
              domain={['dataMin - 0.01', 'dataMax + 0.01']}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00F5D4"
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#00F5D4',
                stroke: '#ffffff',
                strokeWidth: 2,
                filter: 'drop-shadow(0 0 4px rgba(0, 245, 212, 0.6))',
              }}
            />
            <Customized component={Crosshair} />
            <Customized component={CurrentTimeLine} />
            {/* Current price horizontal line */}
            <ReferenceLine 
              y={currentValue} 
              stroke="rgba(46, 242, 255, 0.3)" 
              strokeDasharray="1,2"
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Info */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        {isReducedMotion ? (
          'Animations disabled for accessibility'
        ) : (
          `Live updates every ${Math.round(config.intervalMs / 1000)}s`
        )}
      </div>
    </div>
  );
}
