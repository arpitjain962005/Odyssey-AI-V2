import React from 'react';

interface CommandCenterHeaderProps {
  title?: string;
  subtitle?: string;
}

export const CommandCenterHeader: React.FC<CommandCenterHeaderProps> = ({
  title = 'Command Center',
  subtitle = 'Real-time overview of your global supply chain.',
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-slate-800/60">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>
        <p className="text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono-code pt-1 sm:pt-0">
        <span>{currentDateFormatted}</span>
        <span>•</span>
        <span>Synced 2 mins ago</span>
      </div>
    </div>
  );
};
