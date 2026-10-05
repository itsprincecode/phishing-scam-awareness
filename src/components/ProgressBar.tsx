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
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5 font-medium">
        <span>{label}</span>
        <span className="text-[#B4F437] font-semibold">
          {current} of {total} ({percentage}%)
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-900 border border-white/10"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-lime-500 via-[#B4F437] to-emerald-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(180,244,55,0.6)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
