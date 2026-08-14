import React, { useState } from 'react';
import {
  Globe,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Anchor,
  Building2,
  PackageCheck
} from 'lucide-react';
import { SupplyNode, SupplyRoute } from '../types';

interface PrimaryWorkspaceProps {
  nodes: SupplyNode[];
  routes: SupplyRoute[];
  onNavigateToView?: (viewId: string) => void;
  commandFilterRegion?: string | null;
  commandFilterStatus?: string | null;
  highlightedNodeIds?: string[];
  highlightedRouteIds?: string[];
}

export const PrimaryWorkspace: React.FC<PrimaryWorkspaceProps> = ({
  nodes,
  routes,
  onNavigateToView,
  commandFilterRegion,
  commandFilterStatus,
  highlightedNodeIds,
  highlightedRouteIds,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-shanghai');
  const [filterType, setFilterType] = useState<'all' | 'port' | 'hub' | 'warning'>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const filteredNodes = nodes.filter((node) => {
    // If AI command region filter is set (e.g. Europe, Asia Pacific)
    if (commandFilterRegion && commandFilterRegion !== 'all') {
      if (!node.region.toLowerCase().includes(commandFilterRegion.toLowerCase())) {
        return false;
      }
    }
    // If AI command status filter is set (e.g. warning, delayed)
    if (commandFilterStatus === 'warning' && node.status !== 'warning') {
      // Keep connected nodes or warning nodes
      if (!highlightedNodeIds?.includes(node.id)) return false;
    }
    if (filterType === 'all') return true;
    if (filterType === 'port') return node.type === 'port';
    if (filterType === 'hub') return node.type === 'hub';
    if (filterType === 'warning') return node.status === 'warning';
    return true;
  });

  const getNodeCoords = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return { x: 50, y: 50 };
    return { x: node.lng, y: node.lat };
  };

  const getNodeIcon = (type: SupplyNode['type']) => {
    switch (type) {
      case 'port': return <Anchor className="w-3.5 h-3.5" />;
      case 'hub': return <Building2 className="w-3.5 h-3.5" />;
      default: return <PackageCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="rounded-2xl bg-[#111726] border border-slate-800/80 shadow-md overflow-hidden flex flex-col min-h-[520px] lg:min-h-[580px] relative">
      {/* Workspace Controls Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 bg-[#0E1320] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-200">Global Network Topology</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            7 Primary Nodes • 6 Active Operational Routes
          </span>
        </div>

        {/* Node Filters */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800">
          {[
            { id: 'all', label: 'All Nodes' },
            { id: 'port', label: 'Ports' },
            { id: 'hub', label: 'Hubs' },
            { id: 'warning', label: 'At Risk' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                filterType === tab.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Topology Visual Canvas Surface */}
      <div className="flex-1 relative bg-[#0B0F19] overflow-hidden flex flex-col justify-between">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#3B82F6 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Network Vector Map Canvas */}
        <div className="absolute inset-0 p-6 flex items-center justify-center">
          <svg
            className="w-full h-full max-w-5xl transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
            viewBox="0 0 100 80"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="routeWarningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Geographic Continental Wireframe Guides (Minimal, non-distracting) */}
            <g opacity="0.12" fill="none" stroke="#475569" strokeWidth="0.3">
              {/* Americas */}
              <path d="M 18,20 Q 25,15 32,25 Q 35,45 28,65 Q 22,75 18,60 Z" />
              {/* Europe & Africa */}
              <path d="M 45,18 Q 58,15 62,30 Q 58,55 52,70 Q 45,60 45,35 Z" />
              {/* Asia & APAC */}
              <path d="M 65,18 Q 88,15 92,40 Q 85,65 72,60 Q 68,35 65,18 Z" />
            </g>

            {/* Connecting Vector Route Curves */}
            {routes.map((route) => {
              const from = getNodeCoords(route.fromId);
              const to = getNodeCoords(route.toId);
              const isDelayed = route.status === 'delayed';

              // Midpoint calculation for smooth curve arc
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2 - 8;

              return (
                <g key={route.id}>
                  {/* Outer Curve Line */}
                  <path
                    d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                    fill="none"
                    stroke={isDelayed ? 'url(#routeWarningGrad)' : 'url(#routeGrad)'}
                    strokeWidth={isDelayed ? '0.7' : '0.5'}
                    strokeDasharray={isDelayed ? '1.5,1' : 'none'}
                  />

                  {/* Flow Pulse Indicator along path */}
                  <circle r="0.8" fill={isDelayed ? '#F59E0B' : '#60A5FA'}>
                    <animateMotion
                      path={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
                      dur={isDelayed ? '6s' : '4s'}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Interactive Node Markers */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isWarning = node.status === 'warning';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.lng}, ${node.lat})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  {/* Selection Pulsing Ring */}
                  {isSelected && (
                    <circle
                      r="3.5"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="0.4"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Outer Glow Halo */}
                  <circle
                    r={isSelected ? '2.8' : '2'}
                    fill={isWarning ? '#F59E0B' : '#3B82F6'}
                    fillOpacity={isSelected ? '0.25' : '0.12'}
                  />

                  {/* Core Node Marker */}
                  <circle
                    r={isSelected ? '1.4' : '1'}
                    fill={isWarning ? '#F59E0B' : isSelected ? '#3B82F6' : '#94A3B8'}
                    stroke="#0B0F19"
                    strokeWidth="0.4"
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* Node Label Tag */}
                  <text
                    x="2.5"
                    y="0.5"
                    fontSize="2.2"
                    fontWeight={isSelected ? '700' : '500'}
                    fill={isSelected ? '#FFFFFF' : '#94A3B8'}
                    className="select-none font-sans transition-colors group-hover:fill-white"
                  >
                    {node.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Canvas Controls (Zoom In/Out, Reset) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-[#111726]/90 backdrop-blur-xs border border-slate-800 p-1 rounded-lg shadow-md">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Selected Node Inspector Bottom Overlay Panel */}
        <div className="relative z-20 p-4 m-4 bg-[#111726]/95 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg border shrink-0 ${
              selectedNode.status === 'warning'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-blue-600/10 text-blue-400 border-blue-500/20'
            }`}>
              {getNodeIcon(selectedNode.type)}
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-tight">
                  {selectedNode.name}
                </h3>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedNode.region}
                </span>
                {selectedNode.status === 'warning' && (
                  <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Monitoring</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Type: <span className="capitalize text-slate-300">{selectedNode.type}</span> • Active Shipments: <span className="text-slate-200 font-medium">{selectedNode.shipmentsCount.toLocaleString()}</span> • Throughput: <span className="text-emerald-400 font-medium">{selectedNode.throughput}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              onClick={() => onNavigateToView?.('network')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>View Network Node</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Restored 3 Summary Cards Below Network Workspace */}
      <div className="p-3.5 border-t border-slate-800/80 bg-[#0E1320]/90 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        {/* Card 1: On-Time Delivery */}
        <div className="p-3 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium">On-Time Delivery</span>
            <span className="text-emerald-400 font-mono-code font-semibold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+1.4%</span>
          </div>
          <div className="text-base font-bold text-white font-mono-code">98.2%</div>
          <div className="text-[10px] text-slate-500">Benchmark target: 98.0%</div>
        </div>

        {/* Card 2: Capacity Utilization */}
        <div className="p-3 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium">Capacity Utilization</span>
            <span className="text-blue-400 font-mono-code font-semibold text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">Optimal</span>
          </div>
          <div className="text-base font-bold text-white font-mono-code">92.4%</div>
          <div className="text-[10px] text-slate-500">Across 7 primary hubs</div>
        </div>

        {/* Card 3: Forecast Accuracy */}
        <div className="p-3 rounded-xl bg-[#111726] border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-medium">Forecast Accuracy</span>
            <span className="text-emerald-400 font-mono-code font-semibold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+2.1%</span>
          </div>
          <div className="text-base font-bold text-white font-mono-code">96.8%</div>
          <div className="text-[10px] text-slate-500">AI route prediction precision</div>
        </div>
      </div>
    </div>
  );
};
