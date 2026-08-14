import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Percent,
  Truck,
  Sparkles,
  Info,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import {
  FinancialTrendPoint,
  RevenueMetricType,
  TimeFilterType,
} from '../../types/revenue';
import {
  MOCK_TREND_DATA_YEAR,
  MOCK_TREND_DATA_QUARTER,
  MOCK_TREND_DATA_30D,
  MOCK_TREND_DATA_7D,
} from '../../data/mockRevenueData';

interface FinancialChartHeroProps {
  selectedMetric: RevenueMetricType;
  onMetricChange: (m: RevenueMetricType) => void;
  timeFilter: TimeFilterType;
  onTimeFilterChange: (t: TimeFilterType) => void;
}

export const FinancialChartHero: React.FC<FinancialChartHeroProps> = ({
  selectedMetric,
  onMetricChange,
  timeFilter,
  onTimeFilterChange,
}) => {
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [showTargetBenchmark, setShowTargetBenchmark] = useState(true);

  // Get trend data based on time filter
  const getTrendData = (): FinancialTrendPoint[] => {
    switch (timeFilter) {
      case '7D':
        return MOCK_TREND_DATA_7D;
      case '30D':
        return MOCK_TREND_DATA_30D;
      case 'Quarter':
        return MOCK_TREND_DATA_QUARTER;
      case 'Year':
      default:
        return MOCK_TREND_DATA_YEAR;
    }
  };

  const data = getTrendData();

  // Helper to get raw values for the active metric
  const getValue = (p: FinancialTrendPoint) => {
    switch (selectedMetric) {
      case 'revenue':
        return p.revenue;
      case 'profit':
        return p.profit;
      case 'margin':
        return p.margin;
      case 'cost':
        return p.cost;
      default:
        return p.revenue;
    }
  };

  const getMetricConfig = () => {
    switch (selectedMetric) {
      case 'revenue':
        return {
          title: 'Total Revenue Trend',
          unit: '$M',
          color: '#10B981', // emerald
          gradientId: 'revGrad',
          benchmarkVal: timeFilter === '7D' ? 0.70 : timeFilter === 'Year' ? 4.5 : 1.25,
          benchmarkLabel: 'Target $4.5M/mo',
          icon: DollarSign,
        };
      case 'profit':
        return {
          title: 'Net Operating Profit',
          unit: '$M',
          color: '#3B82F6', // blue
          gradientId: 'profGrad',
          benchmarkVal: timeFilter === '7D' ? 0.18 : timeFilter === 'Year' ? 1.15 : 0.32,
          benchmarkLabel: 'Target $1.15M/mo',
          icon: TrendingUp,
        };
      case 'margin':
        return {
          title: 'Net Profit Margin %',
          unit: '%',
          color: '#06B6D4', // cyan
          gradientId: 'marGrad',
          benchmarkVal: 25.0,
          benchmarkLabel: 'Threshold 25.0%',
          icon: Percent,
        };
      case 'cost':
        return {
          title: 'Total Logistics Expense',
          unit: '$M',
          color: '#F43F5E', // rose
          gradientId: 'costGrad',
          benchmarkVal: timeFilter === '7D' ? 0.50 : timeFilter === 'Year' ? 3.10 : 0.88,
          benchmarkLabel: 'Cap $3.1M/mo',
          icon: Truck,
        };
    }
  };

  const config = getMetricConfig();
  const values = data.map(getValue);
  const maxVal = Math.max(...values, config.benchmarkVal) * 1.12;
  const minVal = Math.min(...values) * 0.85;

  // Chart dimensions inside SVG
  const width = 800;
  const height = 280;
  const paddingX = 45;
  const paddingY = 30;
  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Coordinate mapper
  const getX = (idx: number) => {
    if (data.length <= 1) return paddingX + graphWidth / 2;
    return paddingX + (idx / (data.length - 1)) * graphWidth;
  };

  const getY = (val: number) => {
    const range = maxVal - minVal || 1;
    const norm = (val - minVal) / range;
    return height - paddingY - norm * graphHeight;
  };

  // Generate SVG smooth bezier path
  const points = data.map((p, i) => ({ x: getX(i), y: getY(getValue(p)) }));
  
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const pathD = createSmoothPath(points);
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const benchmarkY = getY(config.benchmarkVal);

  const activePoint = hoveredPointIndex !== null ? data[hoveredPointIndex] : data[data.length - 1];
  const activeValue = getValue(activePoint);

  return (
    <div className="bg-[#111726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Top Hero Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Interactive Financial Performance
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time revenue dynamics, profit margins, and cost trajectories across time.
          </p>
        </div>

        {/* Metric Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-xl border border-slate-800">
          {[
            { id: 'revenue', label: 'Revenue', icon: DollarSign },
            { id: 'profit', label: 'Net Profit', icon: TrendingUp },
            { id: 'margin', label: 'Margin %', icon: Percent },
            { id: 'cost', label: 'Logistics Cost', icon: Truck },
          ].map((m) => {
            const Icon = m.icon;
            const isActive = selectedMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onMetricChange(m.id as RevenueMetricType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric Summary Banner + Hover Tooltip readout */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#090D16] p-3 rounded-xl border border-slate-800/80">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 font-mono-code uppercase">Selected Metric</span>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <span style={{ color: config.color }}>●</span>
            {config.title}
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 font-mono-code uppercase">
            {hoveredPointIndex !== null ? `Point (${activePoint.label})` : 'Latest Period'}
          </span>
          <div className="text-base font-bold text-white font-mono-code">
            {selectedMetric === 'margin' ? `${activeValue.toFixed(1)}%` : `$${activeValue.toFixed(2)}${config.unit}`}
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 font-mono-code uppercase">Target Benchmark</span>
          <div className="text-sm font-semibold text-slate-300 font-mono-code flex items-center gap-1">
            <span>
              {selectedMetric === 'margin' ? `${config.benchmarkVal}%` : `$${config.benchmarkVal}${config.unit}`}
            </span>
            <button
              onClick={() => setShowTargetBenchmark(!showTargetBenchmark)}
              className="ml-1 text-[10px] text-emerald-400 hover:underline"
            >
              {showTargetBenchmark ? '[Hide]' : '[Show]'}
            </button>
          </div>
        </div>

        <div className="space-y-0.5 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-mono-code uppercase">Time Horizon</span>
          <div className="flex items-center gap-1">
            {(['7D', '30D', 'Quarter', 'Year'] as TimeFilterType[]).map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeFilterChange(tf)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-code ${
                  timeFilter === tf
                    ? 'bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full h-[280px] bg-[#090D16] border border-slate-800/80 rounded-xl p-2 overflow-hidden group">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio, i) => {
            const y = paddingY + ratio * graphHeight;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Target Benchmark Line */}
          {showTargetBenchmark && (
            <g>
              <line
                x1={paddingX}
                y1={benchmarkY}
                x2={width - paddingX}
                y2={benchmarkY}
                stroke="#E2E8F0"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity={0.5}
              />
              <text
                x={width - paddingX - 5}
                y={benchmarkY - 6}
                fill="#94A3B8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {config.benchmarkLabel}
              </text>
            </g>
          )}

          {/* Gradient Fill Area under curve */}
          <path d={areaD} fill={`url(#${config.gradientId})`} />

          {/* Main Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke={config.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover indicator vertical line */}
          {hoveredPointIndex !== null && (
            <line
              x1={getX(hoveredPointIndex)}
              y1={paddingY}
              x2={getX(hoveredPointIndex)}
              y2={height - paddingY}
              stroke="#64748B"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredPointIndex === idx;
            return (
              <g key={idx}>
                {/* Invisible hover target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="14"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                  onMouseLeave={() => setHoveredPointIndex(null)}
                />
                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 4}
                  fill={config.color}
                  opacity={isHovered ? 0.9 : 0.6}
                  className="transition-all duration-150"
                />
                {/* Inner white dot */}
                <circle cx={pt.x} cy={pt.y} r={isHovered ? 3 : 2} fill="#FFFFFF" />
              </g>
            );
          })}

          {/* X Axis Labels */}
          {data.map((p, idx) => (
            <text
              key={idx}
              x={getX(idx)}
              y={height - 8}
              fill={hoveredPointIndex === idx ? '#F8FAFC' : '#64748B'}
              fontSize="10"
              fontFamily="monospace"
              textAnchor="middle"
            >
              {p.label}
            </text>
          ))}
        </svg>

        {/* Dynamic Tooltip Popup */}
        {hoveredPointIndex !== null && (
          <div
            className="absolute pointer-events-none bg-[#111726]/95 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs space-y-1 backdrop-blur-md z-20"
            style={{
              left: `${(getX(hoveredPointIndex) / width) * 100}%`,
              top: '15%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="text-[10px] text-slate-400 font-mono-code border-b border-slate-800 pb-1">
              Period: <span className="text-white font-bold">{data[hoveredPointIndex].label}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] pt-0.5">
              <span className="text-slate-400">Revenue:</span>
              <span className="text-emerald-400 font-mono-code font-bold">${data[hoveredPointIndex].revenue}M</span>
              <span className="text-slate-400">Profit:</span>
              <span className="text-blue-400 font-mono-code font-bold">${data[hoveredPointIndex].profit}M</span>
              <span className="text-slate-400">Margin:</span>
              <span className="text-cyan-400 font-mono-code font-bold">{data[hoveredPointIndex].margin}%</span>
              <span className="text-slate-400">Cost:</span>
              <span className="text-rose-400 font-mono-code font-bold">${data[hoveredPointIndex].cost}M</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
