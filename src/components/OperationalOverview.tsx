import React from 'react';
import { Package, DollarSign, Gauge, ShieldCheck, Globe, TrendingUp, Minus } from 'lucide-react';
import { StatusCardItem } from '../types';

interface OperationalOverviewProps {
  cards: StatusCardItem[];
  highlightedCardId?: string | null;
}

export const OperationalOverview: React.FC<OperationalOverviewProps> = ({
  cards,
  highlightedCardId,
}) => {
  const renderIcon = (iconName: string) => {
    const className = 'w-4 h-4 text-slate-400';
    switch (iconName) {
      case 'Package': return <Package className={className} />;
      case 'DollarSign': return <DollarSign className={className} />;
      case 'Gauge': return <Gauge className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Globe': return <Globe className={className} />;
      default: return <Package className={className} />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => {
        const isPositive = card.trendType === 'positive';
        const isNeutral = card.trendType === 'neutral';
        const isHighlighted = highlightedCardId === card.id;

        return (
          <div
            key={card.id}
            className={`p-4 rounded-xl transition-all space-y-3 shadow-xs ${
              isHighlighted
                ? 'bg-[#151E32] border-2 border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-950/40'
                : 'bg-[#111726] border border-slate-800/80 hover:border-slate-700/80'
            }`}
          >
            {/* Header: Title + Simple Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <div className="p-1.5 rounded-md bg-slate-800/50">
                {renderIcon(card.iconName)}
              </div>
            </div>

            {/* Current Value */}
            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight text-white font-sans">
                {card.value}
              </div>

              {/* Supporting Text & Trend Indicator */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400 truncate max-w-[120px]">
                  {card.supportingText}
                </span>

                <span
                  className={`inline-flex items-center gap-0.5 font-medium shrink-0 ${
                    isPositive
                      ? 'text-emerald-400'
                      : isNeutral
                      ? 'text-slate-400'
                      : 'text-rose-400'
                  }`}
                >
                  {isPositive && <TrendingUp className="w-3 h-3" />}
                  {isNeutral && <Minus className="w-3 h-3" />}
                  <span>{card.trend}</span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
