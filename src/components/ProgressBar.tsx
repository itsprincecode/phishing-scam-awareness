import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label = 'Progress',
  className = '',
}) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
        <span>{label}</span>
        <span>
          {current} of {total} ({percentage}%)
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80 border border-slate-700/50"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
