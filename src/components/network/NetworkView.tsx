import React, { useState, useEffect } from 'react';
import {
  Network as NetworkIcon,
  Globe,
  Ship,
  Plane,
  Train,
  Truck,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Maximize2,
  ChevronRight,
  X,
  Zap,
  Sliders
} from 'lucide-react';
import {
  MOCK_NETWORK_NODES,
  MOCK_NETWORK_CORRIDORS
} from '../../data/mockEnterpriseData';
import { NetworkNodeDetail, NetworkCorridorDetail } from '../../types/enterprise';
import { fetchNetworkData } from '../../services/api';

interface NetworkViewProps {
  onNavigateToView: (viewId: string) => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({ onNavigateToView }) => {
  const [nodesList, setNodesList] = useState<NetworkNodeDetail[]>(MOCK_NETWORK_NODES);
  const [corridorsList, setCorridorsList] = useState<NetworkCorridorDetail[]>(MOCK_NETWORK_CORRIDORS);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<NetworkNodeDetail | null>(MOCK_NETWORK_NODES[0]);

  useEffect(() => {
    fetchNetworkData()
      .then((data) => {
        if (data.nodes && data.nodes.length > 0) {
          setNodesList(data.nodes);
          setSelectedNode(data.nodes[0]);
        }
        if (data.corridors && data.corridors.length > 0) {
          setCorridorsList(data.corridors);
        }
      })
      .catch((err) => {
        console.warn('Fallback to local network cache:', err);
      });
  }, []);

  const filteredNodes = nodesList.filter((node) => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || node.region === selectedRegion;
    const matchesType = selectedType === 'All' || node.type.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesRegion && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Elevated Load': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Severe Bottleneck': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getNodeDotColor = (status: string) => {
    switch (status) {
      case 'Optimal': return 'bg-emerald-400 ring-emerald-400/30';
      case 'Elevated Load': return 'bg-amber-400 ring-amber-400/30';
      case 'Severe Bottleneck': return 'bg-rose-500 ring-rose-500/40 animate-pulse';
      default: return 'bg-blue-400 ring-blue-400/30';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 lg:p-8 pb-32">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <NetworkIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                Global Network & Topology
              </h1>
              <p className="text-xs text-slate-400">
                End-to-end multi-modal logistics nodes, gateways, ports, and corridor capacities.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToView('journeys')}
            className="px-3.5 py-2 rounded-xl bg-[#111726] border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>Live Journeys View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateToView('smart-staff')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-blue-600/30"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Audit Capacity Balance</span>
          </button>
        </div>
      </div>

      {/* TOP NETWORK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Global Gateways</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">8 Hubs</div>
          <div className="text-[11px] text-emerald-400 font-medium">6 running at optimal capacity</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Global In-Transit TEU</span>
            <Ship className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">118,900</div>
          <div className="text-[11px] text-slate-400">Across 76 active carrier routes</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Terminal Turnaround</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">1.8 days</div>
          <div className="text-[11px] text-emerald-400 font-medium">-0.3 days vs last month</div>
        </div>

        <div className="p-4 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Network Reliability Score</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-code">97.8%</div>
          <div className="text-[11px] text-blue-400 font-medium">On-time dispatch rate</div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111726] p-3 rounded-xl border border-slate-800/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search port, code, or facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#090D16] border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 text-xs">
            {['All', 'Asia Pacific', 'Europe', 'North America', 'South America'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
                  selectedRegion === region
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800 text-xs">
            {['All', 'Sea', 'Air', 'Rail'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                  selectedType === t
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOPOLOGY VISUAL CANVAS + NODE INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INTERACTIVE TOPOLOGY MAP (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#111726] border border-slate-800/80 p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Interactive Infrastructure Map</h3>
              <p className="text-xs text-slate-400">Click any gateway hub to view telemetry and connected trade lanes</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Optimal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Heavy</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Bottleneck</span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-80 rounded-xl bg-[#090D16] border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
            {/* World Grid Lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            {/* SVG Connecting Corridors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M 20% 40% Q 49% 15% 78% 44%" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
              <path d="M 78% 44% Q 76% 51% 74% 58%" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.7" />
              <path d="M 74% 58% Q 62% 45% 50% 32%" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" opacity="0.8" />
              <path d="M 50% 32% L 52% 35%" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.7" />
              <path d="M 86% 38% Q 53% 20% 20% 40%" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
              <path d="M 20% 40% L 26% 36%" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
              <path d="M 38% 74% Q 29% 57% 20% 40%" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </svg>

            {/* Node Markers */}
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all group z-10 ${
                    isSelected ? 'ring-4 ring-blue-500 scale-125' : 'hover:scale-110'
                  }`}
                  title={`${node.name} (${node.code})`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ring-4 ${getNodeDotColor(node.status)} shadow-lg`}></div>
                  <span className={`absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono-code font-bold px-1.5 py-0.5 rounded bg-[#0B0F19]/90 border border-slate-700/80 transition-all ${
                    isSelected ? 'text-blue-300 border-blue-500' : 'text-slate-300 group-hover:text-white'
                  }`}>
                    {node.code}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Showing {filteredNodes.length} nodes across {selectedRegion}</span>
            <span className="font-mono-code text-[11px] text-blue-400">Live Telemetry Synchronized</span>
          </div>
        </div>

        {/* NODE INSPECTOR DRAWER / CARD (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#111726] border border-slate-800/80 p-5 space-y-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{selectedNode.name}</h3>
                    <span className="text-xs font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedNode.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedNode.region} • {selectedNode.type}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusColor(selectedNode.status)}`}>
                  {selectedNode.status}
                </span>
              </div>

              {/* METRICS GRID */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Avg Berth Dwell</span>
                  <div className="text-sm font-bold font-mono-code text-white">{selectedNode.dwellTimeAvg}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Gate Congestion</span>
                  <div className={`text-sm font-bold font-mono-code ${
                    selectedNode.gateCongestionPct > 70 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedNode.gateCongestionPct}%
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Capacity Utilization</span>
                  <div className="text-sm font-bold font-mono-code text-white">{selectedNode.capacityUtilizationPct}%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0B0F19] border border-slate-800/80 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Active Shipments</span>
                  <div className="text-sm font-bold font-mono-code text-blue-400">{selectedNode.activeShipmentsCount.toLocaleString()}</div>
                </div>
              </div>

              {/* RECENT OPERATIONAL LOGS */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-300">Live Hub Events:</span>
                <div className="space-y-1.5">
                  {selectedNode.recentEvents.map((evt, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#090D16] border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                      <span>{evt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onNavigateToView('journeys')}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all text-center"
                >
                  View Inbound Shipments
                </button>
                {selectedNode.status !== 'Optimal' && (
                  <button
                    onClick={() => onNavigateToView('falling')}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold transition-all"
                  >
                    Inspect Risk Radar
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Select a node on the map to inspect telemetry
            </div>
          )}
        </div>
      </div>

      {/* MAJOR CORRIDORS TABLE */}
      <div className="p-5 rounded-2xl bg-[#111726] border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Global Trade Corridors</h3>
            <p className="text-xs text-slate-400">Scheduled throughput, vessel/train allocations, and reliability pacing</p>
          </div>
          <button
            onClick={() => onNavigateToView('rising')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>Top Performing Lanes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Corridor</th>
                <th className="pb-3 font-semibold">Mode</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Avg Transit</th>
                <th className="pb-3 font-semibold">Active Fleet</th>
                <th className="pb-3 font-semibold">Weekly Capacity</th>
                <th className="pb-3 font-semibold text-right">On-Time %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MOCK_NETWORK_CORRIDORS.map((corr) => (
                <tr key={corr.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 font-semibold text-white">{corr.name}</td>
                  <td className="py-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px]">{corr.mode}</span>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      corr.status === 'Optimal'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : corr.status === 'Delayed'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {corr.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono-code text-slate-300">{corr.transitAvgHours} hrs</td>
                  <td className="py-3 font-mono-code text-slate-300">{corr.activeVessels} units</td>
                  <td className="py-3 font-mono-code text-slate-300">{corr.weeklyCapacityTeu.toLocaleString()} TEU</td>
                  <td className="py-3 text-right font-mono-code font-bold">
                    <span className={corr.onTimeRatePct >= 95 ? 'text-emerald-400' : 'text-rose-400'}>
                      {corr.onTimeRatePct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
