import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  AlertTriangle,
  Clock,
  ShieldAlert,
  DollarSign,
  ArrowUpRight,
  Filter,
  Search,
  CheckCircle2,
  ChevronRight,
  Ship,
  Plane,
  Train,
  Truck,
  Zap,
  RefreshCw,
  ExternalLink,
  Layers
} from 'lucide-react';
import {
  MOCK_FALLING_CORRIDORS,
  MOCK_RISK_SIGNALS,
  MOCK_AT_RISK_CUSTOMERS,
  MOCK_COST_ESCALATIONS
} from '../../data/mockEnterpriseData';
import { FallingCorridor, RiskSignal } from '../../types/falling';
import { CommandFilterState } from '../../types';
import { fetchFallingData, mitigateRiskSignal } from '../../services/api';

interface FallingViewProps {
  onNavigateToView: (viewId: string) => void;
  commandState?: CommandFilterState | null;
}

export const FallingView: React.FC<FallingViewProps> = ({ onNavigateToView, commandState }) => {
  const [corridorsList, setCorridorsList] = useState<FallingCorridor[]>(MOCK_FALLING_CORRIDORS);
  const [riskSignalsList, setRiskSignalsList] = useState<RiskSignal[]>(MOCK_RISK_SIGNALS);
  const [atRiskCustList, setAtRiskCustList] = useState<any[]>(MOCK_AT_RISK_CUSTOMERS);
  const [costEscList, setCostEscList] = useState<any[]>(MOCK_COST_ESCALATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [executingSignalId, setExecutingSignalId] = useState<string | null>(null);
  const [resolvedSignals, setResolvedSignals] = useState<string[]>([]);
  const [selectedCorridor, setSelectedCorridor] = useState<FallingCorridor | null>(null);

  // Sync with commandState
  useEffect(() => {
    if (commandState?.targetSectionId) {
      setTimeout(() => {
        const el = document.getElementById(commandState.targetSectionId!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [commandState]);

  useEffect(() => {
    fetchFallingData()
      .then((data) => {
        if (data.fallingCorridors && data.fallingCorridors.length > 0) {
          setCorridorsList(data.fallingCorridors);
        }
        if (data.riskSignals && data.riskSignals.length > 0) {
          setRiskSignalsList(data.riskSignals);
        }
        if (data.atRiskCustomers && data.atRiskCustomers.length > 0) {
          setAtRiskCustList(data.atRiskCustomers);
        }
        if (data.costEscalations && data.costEscalations.length > 0) {
          setCostEscList(data.costEscalations);
        }
      })
      .catch((err) => {
        console.warn('Fallback to local cache:', err);
      });
  }, []);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Sea': return <Ship className="w-3.5 h-3.5" />;
      case 'Air': return <Plane className="w-3.5 h-3.5" />;
      case 'Rail': return <Train className="w-3.5 h-3.5" />;
      case 'Road': return <Truck className="w-3.5 h-3.5" />;
      default: return <Ship className="w-3.5 h-3.5" />;
    }
  };

  const handleMitigateSignal = async (signalId: string) => {
    setExecutingSignalId(signalId);
    try {
      await mitigateRiskSignal(signalId);
      setResolvedSignals((prev) => [...prev, signalId]);
    } catch {
      setResolvedSignals((prev) => [...prev, signalId]);
    } finally {
      setExecutingSignalId(null);
    }
  };

  const filteredCorridors = corridorsList.filter((corridor) => {
    const matchesSearch = corridor.lane.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          corridor.primaryIssue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = selectedMode === 'All' || corridor.mode === selectedMode;
    const matchesSeverity = selectedSeverity === 'All' || corridor.impactScore === selectedSeverity;
    return matchesSearch && matchesMode && matchesSeverity;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 lg:p-8 pb-32">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                Falling & Risk Radar
              </h1>
              <p className="text-xs text-slate-400">
                Early-warning intelligence identifying decelerating corridors, cost overruns, and SLA bottlenecks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToView('rising')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>View Rising Corridors</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateToView('smart-staff')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-blue-600/30"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Trigger Autonomous Reroute</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Decelerating Corridors</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">4 Lanes</div>
          <div className="text-[11px] text-rose-400 font-medium">Avg delay variance +2.3 days</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Weekly Margin at Risk</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">$163,500</div>
          <div className="text-[11px] text-amber-400 font-medium">Demurrage & spot surcharge leak</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>At-Risk Enterprise Value</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">$7.98M</div>
          <div className="text-[11px] text-slate-400">Across 63 active customer batches</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Risk Signals</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">4 Signals</div>
          <div className="text-[11px] text-emerald-400 font-medium">2 mitigated in past 2 hrs</div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111726] p-3 rounded-xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by lane or bottleneck..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#090D16] border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 text-xs">
            {['All', 'Sea', 'Air', 'Rail', 'Road'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  selectedMode === mode
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 text-xs">
            {['All', 'Critical', 'High'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  selectedSeverity === sev
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Decelerating Corridors Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div id="falling-corridors" className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Decelerating Trade Corridors</h3>
                <p className="text-xs text-slate-400">Routes showing highest lead time degradation and volume drop</p>
              </div>
              <span className="text-[11px] font-mono-code px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {filteredCorridors.length} Corridors
              </span>
            </div>

            <div className="space-y-3">
              {filteredCorridors.map((corridor) => (
                <div
                  key={corridor.id}
                  onClick={() => setSelectedCorridor(corridor)}
                  className="p-4 rounded-xl bg-[#0B0F19] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-800/80 text-slate-300">
                        {getModeIcon(corridor.mode)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                          <span>{corridor.lane}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {corridor.primaryIssue}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                        corridor.impactScore === 'Critical'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {corridor.impactScore} Impact
                      </span>
                      <div className="text-right">
                        <div className="text-xs font-mono-code font-bold text-rose-400">{corridor.leadTimeVariance}</div>
                        <div className="text-[10px] text-slate-500">{corridor.delayProbability}% delay prob</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 gap-2">
                    <div className="flex items-center gap-4">
                      <span>Volume: <strong className="text-rose-400">{corridor.weeklyVolumeLoss}</strong></span>
                      <span>Margin: <strong className="text-rose-400">{corridor.marginImpact}</strong></span>
                    </div>

                    {corridor.alternativeLaneName ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToView('rising');
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 hover:underline"
                      >
                        <span>Alt: {corridor.alternativeLaneName}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToView('journeys');
                        }}
                        className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 hover:underline"
                      >
                        <span>Inspect in Journeys</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AT-RISK VIP CUSTOMERS */}
          <div id="at-risk-customers" className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Impacted Customer Accounts</h3>
                <p className="text-xs text-slate-400">Enterprise accounts experiencing SLA variance on falling corridors</p>
              </div>
              <button
                onClick={() => onNavigateToView('revenue')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <span>View Revenue Impact</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MOCK_AT_RISK_CUSTOMERS.map((cust) => (
                <div key={cust.id} className="p-3.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">{cust.customerName}</div>
                      <span className="text-[10px] text-blue-400 font-medium">{cust.tier}</span>
                    </div>
                    <div className="text-right font-mono-code text-xs font-bold text-amber-400">
                      {cust.delayedValue}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{cust.riskFactor}</p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                    <span>SLA: <strong className="text-rose-400">{cust.currentSla}</strong> / target {cust.targetSla}</span>
                    <span>{cust.accountOwner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Risk Radar Signals & Cost Escalations (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* RISK SIGNALS RADAR */}
          <div id="risk-radar" className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Live Risk Signals</h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono-code">AI Sentinel Scan</span>
            </div>

            <div className="space-y-3">
              {MOCK_RISK_SIGNALS.map((signal) => {
                const isResolved = resolvedSignals.includes(signal.id);
                const isExecuting = executingSignalId === signal.id;

                return (
                  <div
                    key={signal.id}
                    className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                      isResolved
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-400'
                        : signal.severity === 'critical'
                        ? 'bg-rose-950/20 border-rose-800/50'
                        : 'bg-[#0B0F19] border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {signal.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{signal.location} • {signal.timeDetected}</div>
                      </div>
                      <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        isResolved
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : signal.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {isResolved ? 'Mitigated' : signal.severity}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-slate-400 text-[10px] block font-medium">Recommended Mitigation:</span>
                      {signal.recommendedAction}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">{signal.affectedShipments} shipments affected</span>
                      {!isResolved ? (
                        <button
                          onClick={() => handleMitigateSignal(signal.id)}
                          disabled={isExecuting}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-all flex items-center gap-1 shadow-xs"
                        >
                          {isExecuting ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Routing...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 text-amber-300" />
                              <span>Apply Action</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Action Queued</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COST ESCALATIONS BREAKDOWN */}
          <div id="cost-escalations" className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Cost Escalations</h3>
              </div>
              <span className="text-[10px] text-slate-400">Demurrage / Spot</span>
            </div>

            <div className="space-y-2.5">
              {MOCK_COST_ESCALATIONS.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{item.category}</span>
                    <span className="text-xs font-mono-code font-bold text-rose-400">{item.projectedOverrun}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{item.corridor}</div>
                  <p className="text-[10px] text-slate-500">{item.driver}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
