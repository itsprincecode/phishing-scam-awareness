import React from 'react';
import { LucideIcon, CheckCircle2 } from 'lucide-react';

interface SafetyCardProps {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: LucideIcon;
  steps: Array<{
    title: string;
    detail: string;
  }>;
  variant?: 'cyan' | 'amber' | 'red';
}

export const SafetyCard: React.FC<SafetyCardProps> = ({
  id,
  badge,
  title,
  description,
  icon: Icon,
  steps,
  variant = 'cyan',
}) => {
  const variantStyles = {
    cyan: {
      border: 'border-cyan-800/40 hover:border-cyan-500/60',
      badge: 'bg-cyan-950 text-cyan-400 border-cyan-800/50',
      iconBox: 'bg-cyan-950/80 text-cyan-400 border-cyan-800/50',
      stepDot: 'text-cyan-400',
    },
    amber: {
      border: 'border-amber-800/40 hover:border-amber-500/60',
      badge: 'bg-amber-950 text-amber-400 border-amber-800/50',
      iconBox: 'bg-amber-950/80 text-amber-400 border-amber-800/50',
      stepDot: 'text-amber-400',
    },
    red: {
      border: 'border-red-800/40 hover:border-red-500/60',
      badge: 'bg-red-950 text-red-400 border-red-800/50',
      iconBox: 'bg-red-950/80 text-red-400 border-red-800/50',
      stepDot: 'text-red-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      id={id}
      className={`rounded-2xl border bg-[#0A1424] p-6 sm:p-8 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 ${style.border}`}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${style.iconBox}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${style.badge}`}>
              {badge}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="space-y-4 border-t border-slate-800/80 pt-5">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <CheckCircle2 className={`h-4 w-4 ${style.stepDot}`} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {step.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
