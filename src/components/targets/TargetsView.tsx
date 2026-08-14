import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Leaf,
  ShieldCheck,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { MOCK_PERFORMANCE_TARGETS } from '../../data/mockEnterpriseData';
import { PerformanceTarget } from '../../types/enterprise';
import { fetchTargetsData } from '../../services/api';

interface TargetsViewProps {
  onNavigateToView: (viewId: string) => void;
}

export const TargetsView: React.FC<TargetsViewProps> = ({ onNavigateToView }) => {
  const [targetsList, setTargetsList] = useState<PerformanceTarget[]>(MOCK_PERFORMANCE_TARGETS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q3 2026');

  useEffect(() => {
    fetchTargetsData()
      .then((data) => {
        if (data.targets && data.targets.length > 0) {
          setTargetsList(data.targets);
        }
      })
      .catch((err) => {
        console.warn('Fallback to local targets cache:', err);
      });
  }, []);

  const filteredTargets = targetsList.filter((t) => {
    return selectedCategory === 'All' || t.category === selectedCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ahead':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'On Track':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'At Risk':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Critical Gap':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SLA & OTIF': return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case 'Transit Speed': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Financial & Cost': return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'Sustainability / ESG': return <Leaf className="w-4 h-4 text-teal-400" />;
      default: return <Target className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 lg:p-8 pb-32">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                Executive Targets & SLAs
              </h1>
              <p className="text-xs text-slate-400">
                Quarterly supply chain KPIs, On-Time-In-Full (OTIF) adherence, margin thresholds, and ESG goals.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#111726] p-1 rounded-xl border border-slate-800 text-xs">
            {['Q2 2026', 'Q3 2026', 'Q4 2026'].map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuarter(q)}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium ${
                  selectedQuarter === q
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigateToView('reports')}
            className="px-3.5 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>Generate Briefing</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TARGET METRIC CARDS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Targets On-Track / Ahead</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">5 of 6</div>
          <div className="text-[11px] text-emerald-400 font-medium">83.3% compliance pace</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Global OTIF Score</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">97.4%</div>
          <div className="text-[11px] text-slate-400">Target 98.5% (-1.1% gap)</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Operating Margin Pacing</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">26.2%</div>
          <div className="text-[11px] text-emerald-400 font-medium">+1.2% ahead of plan</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>At-Risk Metric</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">Port Dwell</div>
          <div className="text-[11px] text-amber-400 font-medium">1.9d vs 1.5d target</div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 bg-[#111726] p-2 rounded-xl border border-slate-800/80 overflow-x-auto">
        <span className="text-xs text-slate-400 px-2 font-medium flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          Category:
        </span>
        {['All', 'SLA & OTIF', 'Transit Speed', 'Financial & Cost', 'Sustainability / ESG'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* TARGETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTargets.map((target) => {
          const progressPercent = Math.min(100, Math.round((target.currentValue / target.targetValue) * 100));
          return (
            <div
              key={target.id}
              className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#090D16] border border-slate-800">
                      {getCategoryIcon(target.category)}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium">{target.category}</span>
                      <h4 className="text-xs font-bold text-white leading-tight">{target.metric}</h4>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(target.status)}`}>
                    {target.status}
                  </span>
                </div>

                {/* CURRENT VS TARGET VALUE */}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current</span>
                    <span className="text-xl font-bold font-mono-code text-white">
                      {target.unit === 'USD' ? `$${target.currentValue.toLocaleString()}` : `${target.currentValue}${target.unit}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Goal</span>
                    <span className="text-sm font-semibold font-mono-code text-slate-300">
                      {target.unit === 'USD' ? `$${target.targetValue.toLocaleString()}` : `${target.targetValue}${target.unit}`}
                    </span>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        target.status === 'Ahead' || target.status === 'On Track'
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, progressPercent)}%` }}
                    />
                  </div>
                </div>

                {/* AI INSIGHT */}
                <div className="p-2.5 rounded-xl bg-[#090D16] border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{target.aiInsights}</p>
                </div>
              </div>

              {/* FOOTER */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Owner: <strong className="text-slate-300">{target.owner}</strong></span>
                <span className="font-mono-code text-slate-500">{target.quarter}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* STRATEGIC CORRECTIVE PLAYBOOK */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">AI Target Acceleration Playbook</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono-code">3 Action items</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Berth Dwell Fix</span>
            <div className="text-xs font-semibold text-white">Zeebrugge Feeder Re-allocation</div>
            <p className="text-[11px] text-slate-400">Shift 4 feeder vessels away from Rotterdam queue to close 0.4-day dwell target gap.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">OTIF Optimization</span>
            <div className="text-xs font-semibold text-white">VIP Pre-Clearance Routing</div>
            <p className="text-[11px] text-slate-400">Automate customs clearance for AeroDynamics to boost global OTIF from 97.4% to 98.6%.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#090D16] border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Margin Expansion</span>
            <div className="text-xs font-semibold text-white">Transpacific Spot Surcharge Lock</div>
            <p className="text-[11px] text-slate-400">Lock 3-month contract tender on LAX lanes to secure +1.8% operating margin headroom.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
