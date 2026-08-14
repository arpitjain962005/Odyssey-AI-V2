import React, { useState } from 'react';
import {
  JourneyItem,
} from '../../types/journey';
import {
  Ship,
  Plane,
  Truck,
  Train,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  MapPin,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';

interface InteractiveJourneysMapProps {
  journeys: JourneyItem[];
  selectedJourneyId: string;
  onSelectJourney: (id: string) => void;
  isCompareMode: boolean;
  comparedJourneyIds: string[];
  onToggleCompareJourney: (id: string) => void;
}

export const InteractiveJourneysMap: React.FC<InteractiveJourneysMapProps> = ({
  journeys,
  selectedJourneyId,
  onSelectJourney,
  isCompareMode,
  comparedJourneyIds,
  onToggleCompareJourney,
}) => {
  const [hoveredJourney, setHoveredJourney] = useState<JourneyItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const activeJourney = journeys.find((j) => j.id === selectedJourneyId) || journeys[0];

  const getHealthColor = (status: JourneyItem['status']) => {
    switch (status) {
      case 'active':
      case 'delivered':
        return '#10B981'; // Emerald Green
      case 'delayed':
        return '#F59E0B'; // Amber Yellow
      case 'critical':
        return '#F43F5E'; // Rose Red
      default:
        return '#3B82F6';
    }
  };

  const getModeIcon = (mode: JourneyItem['mode'], className = 'w-3.5 h-3.5') => {
    switch (mode) {
      case 'sea':
        return <Ship className={className} />;
      case 'air':
        return <Plane className={className} />;
      case 'road':
        return <Truck className={className} />;
      case 'rail':
        return <Train className={className} />;
      default:
        return <Compass className={className} />;
    }
  };

  // Helper to generate a quadratic curved SVG path string between two points
  const getCurvePath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.25;
    return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  };

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setMapCenter({ x: 50, y: 50 });
  };

  return (
    <div className="rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col min-h-[480px] lg:min-h-[540px]">
      {/* Map Control Bar Header */}
      <div className="px-5 py-3 bg-[#0E1320] border-b border-slate-800/80 flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono-code">
              FlightRadar / Global Transit Map
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 border-l border-slate-800 pl-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Delayed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Critical</span>
          </div>
        </div>

        {/* Map Toolbar / Legend */}
        <div className="flex items-center gap-2">
          {isCompareMode && (
            <span className="px-2.5 py-0.5 rounded text-[11px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
              Compare Mode Active ({comparedJourneyIds.length} Selected)
            </span>
          )}

          <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-lg border border-slate-800">
            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 bg-[#080B13] overflow-hidden select-none">
        {/* World Continent Vector Background & Grid Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.1" />
            </pattern>

            {/* Glowing filter for active routes */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Continent Landmass Vector Outlines (Stylized Dark Minimalist World) */}
          <g fill="rgba(30, 41, 59, 0.35)" stroke="rgba(71, 85, 105, 0.25)" strokeWidth="0.2">
            {/* Americas */}
            <path d="M 12 25 Q 22 20 28 35 Q 24 55 22 75 Q 16 65 12 50 Z" />
            <path d="M 22 55 Q 32 60 30 80 Q 22 92 18 78 Z" />
            {/* Europe & Africa */}
            <path d="M 38 22 Q 48 18 52 30 Q 44 38 38 32 Z" />
            <path d="M 42 38 Q 54 36 52 68 Q 44 78 40 55 Z" />
            {/* Asia & Australia */}
            <path d="M 52 20 Q 82 15 88 45 Q 70 52 54 38 Z" />
            <path d="M 72 65 Q 85 62 82 82 Q 72 85 70 72 Z" />
          </g>

          {/* Render All Shipment Route Arcs */}
          {journeys.map((j) => {
            const isSelected = j.id === selectedJourneyId;
            const isCompared = comparedJourneyIds.includes(j.id);
            const isHovered = hoveredJourney?.id === j.id;

            const strokeColor = getHealthColor(j.status);
            const pathStr = getCurvePath(j.originLng, j.originLat, j.destLng, j.destLat);

            return (
              <g key={j.id} className="cursor-pointer">
                {/* Background Shadow Route Line */}
                <path
                  d={pathStr}
                  fill="none"
                  stroke={isSelected || isCompared ? strokeColor : '#1E293B'}
                  strokeWidth={isSelected || isCompared ? '0.8' : '0.4'}
                  strokeOpacity={isSelected || isCompared ? '0.9' : '0.4'}
                  filter={isSelected ? 'url(#glow)' : undefined}
                />

                {/* Animated Moving Dash Flow on Selected/Active Route */}
                <path
                  d={pathStr}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? '1.2' : isCompared ? '0.9' : '0.5'}
                  strokeDasharray="1, 2"
                  strokeOpacity={isSelected ? '1' : '0.6'}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="12"
                    to="0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* Origin Pin */}
                <circle
                  cx={j.originLng}
                  cy={j.originLat}
                  r={isSelected ? '1.2' : '0.7'}
                  fill="#0B0F19"
                  stroke={strokeColor}
                  strokeWidth="0.4"
                />

                {/* Destination Pin */}
                <circle
                  cx={j.destLng}
                  cy={j.destLat}
                  r={isSelected ? '1.2' : '0.7'}
                  fill={strokeColor}
                />
              </g>
            );
          })}
        </svg>

        {/* HTML Interactive Layer for Moving Vessels/Flights, Overlay Tooltips & Journey Cards */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-auto transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        >
          {journeys.map((j) => {
            const isSelected = j.id === selectedJourneyId;
            const isCompared = comparedJourneyIds.includes(j.id);
            const isHovered = hoveredJourney?.id === j.id;
            const healthColor = getHealthColor(j.status);

            return (
              <div key={j.id}>
                {/* Current Position Pulse Badge */}
                <div
                  style={{ left: `${j.currentLng}%`, top: `${j.currentLat}%` }}
                  onClick={() => {
                    if (isCompareMode) {
                      onToggleCompareJourney(j.id);
                    } else {
                      onSelectJourney(j.id);
                    }
                  }}
                  onMouseEnter={() => setHoveredJourney(j)}
                  onMouseLeave={() => setHoveredJourney(null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all duration-200 ${
                    isSelected ? 'scale-125' : 'hover:scale-110'
                  }`}
                >
                  {/* Outer Pulsing Ring */}
                  <span
                    className="absolute -inset-1.5 rounded-full opacity-75 animate-ping"
                    style={{ backgroundColor: healthColor }}
                  />

                  {/* Main Icon Circle */}
                  <div
                    className={`relative p-2 rounded-full border shadow-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-slate-900 border-2 border-white ring-4 ring-blue-500/30'
                        : isCompared
                        ? 'bg-slate-900 border-2 border-blue-400'
                        : 'bg-[#0E1320] border-slate-700'
                    }`}
                    style={{ color: healthColor }}
                  >
                    {getModeIcon(j.mode, 'w-3.5 h-3.5')}
                  </div>

                  {/* Micro ID Badge */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 px-1.5 py-0.5 rounded text-[9px] font-mono-code whitespace-nowrap shadow-md border ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold border-blue-400'
                        : 'bg-[#111726]/90 text-slate-300 border-slate-800'
                    }`}
                  >
                    {j.id}
                  </div>
                </div>

                {/* AI Map Overlay Recommendation Callout directly on map if present & selected */}
                {isSelected && j.mapOverlayAlert && (
                  <div
                    style={{
                      left: `${j.mapOverlayAlert.lng}%`,
                      top: `${j.mapOverlayAlert.lat}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto bg-[#111827]/95 border border-amber-500/50 shadow-xl rounded-xl p-2.5 max-w-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 text-xs text-white space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>AI Map Diagnostic</span>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-tight">
                      {j.mapOverlayAlert.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Hover Tooltip Popup */}
          {hoveredJourney && (
            <div
              style={{
                left: `${Math.min(hoveredJourney.currentLng + 2, 80)}%`,
                top: `${Math.max(hoveredJourney.currentLat - 8, 10)}%`,
              }}
              className="absolute z-40 bg-[#0E1320]/95 border border-slate-700/80 shadow-2xl rounded-xl p-3 max-w-xs backdrop-blur-md text-xs text-white space-y-2 pointer-events-none animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                <span className="font-bold font-mono-code text-blue-400">{hoveredJourney.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono-code font-semibold ${
                  hoveredJourney.status === 'delayed' ? 'bg-amber-500/20 text-amber-400' :
                  hoveredJourney.status === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {hoveredJourney.status}
                </span>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="text-slate-300 font-medium">{hoveredJourney.title}</div>
                <div className="text-slate-400 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-blue-400" />
                  <span>{hoveredJourney.carrier}</span>
                </div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>ETA:</span>
                  <span className="font-mono-code text-slate-200">{hoveredJourney.eta}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Journey Stops Sequence Bar overlay at bottom of Map */}
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-[#0E1320]/90 backdrop-blur-xl border border-slate-800 rounded-xl p-3 shadow-xl">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-mono-code">{activeJourney.id}</span>
              <span className="text-slate-400 text-[11px]">{activeJourney.origin} → {activeJourney.destination}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono-code">
              <span className="text-slate-400">Progress:</span>
              <span className="text-blue-400 font-bold">{activeJourney.progressPercent}%</span>
            </div>
          </div>

          {/* Visual Sequence of Stops */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
            {activeJourney.stops.map((stop, idx) => {
              const isCompleted = stop.status === 'completed';
              const isInProgress = stop.status === 'in_progress';

              return (
                <div
                  key={stop.id}
                  className={`p-2 rounded-lg border text-[10px] space-y-1 transition-all ${
                    isInProgress
                      ? 'bg-blue-600/15 border-blue-500/60 ring-1 ring-blue-500/30'
                      : isCompleted
                      ? 'bg-slate-900/80 border-slate-800/80'
                      : 'bg-[#090D16]/60 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-300 truncate">{stop.name}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : isInProgress ? (
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-slate-500 truncate">{stop.location}</div>
                  <div className="font-mono-code text-[9px] text-slate-400 truncate">{stop.scheduledTime}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
