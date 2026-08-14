import React from 'react';
import {
  PackageCheck,
  TrendingUp,
  Percent,
  Sparkles,
  Zap,
  BarChart2,
  ShieldCheck,
} from 'lucide-react';
import { CargoPerformanceItem } from '../../types/rising';

interface CargoPerformanceSectionProps {
  cargoList: CargoPerformanceItem[];
}

export const CargoPerformanceSection: React.FC<CargoPerformanceSectionProps> = ({
  cargoList,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#111726] border border-slate-800 space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
              <PackageCheck className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              High-Yield Cargo Performance & Volume Trends
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Throughput growth velocity and gross margin breakdown across key commodity groups.
          </p>
        </div>

        <span className="text-xs font-mono-code text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          Index Base: 100
        </span>
      </div>

      {/* Cargo List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cargoList.map((cargo) => {
          const progressPercent = Math.min(100, Math.round((cargo.volumeIndex / 200) * 100));

          return (
            <div
              key={cargo.id}
              className="p-4 rounded-xl bg-[#0E1320] border border-slate-800/90 hover:border-emerald-500/40 transition-all space-y-3.5 group"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-code font-bold uppercase border ${
                    cargo.forecastSignal === 'Strong Surge'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : cargo.forecastSignal === 'High Value Priority'
                      ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                      : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                  }`}
                >
                  {cargo.forecastSignal}
                </span>
                <span className="text-xs font-bold font-mono-code text-white">
                  Index {cargo.volumeIndex}
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {cargo.category}
                </h3>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono-code text-slate-400">
                  <span>Volume Velocity</span>
                  <span className="text-emerald-400 font-bold">{cargo.growthRate}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Metrics Pill */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#090D16] border border-slate-800/80 text-xs">
                <span className="text-slate-400 font-mono-code text-[11px]">Gross Margin</span>
                <span className="font-bold text-emerald-400 font-mono-code">
                  {cargo.margin}
                </span>
              </div>

              {/* Drivers Narrative */}
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <Sparkles className="w-3 h-3 text-emerald-400 inline mr-1" />
                {cargo.demandDrivers}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
