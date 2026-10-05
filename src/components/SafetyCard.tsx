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
      border: 'border-white/10 hover:border-[#B4F437]/50',
      badge: 'bg-[#162013] text-[#B4F437] border-[#B4F437]/30',
      iconBox: 'bg-[#141C11] text-[#B4F437] border-white/10',
      stepDot: 'text-[#B4F437]',
    },
    amber: {
      border: 'border-white/10 hover:border-amber-500/50',
      badge: 'bg-amber-950/50 text-amber-300 border-amber-800/40',
      iconBox: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
      stepDot: 'text-amber-400',
    },
    red: {
      border: 'border-white/10 hover:border-red-500/50',
      badge: 'bg-red-950/50 text-red-300 border-red-800/40',
      iconBox: 'bg-red-950/40 text-red-300 border-red-800/40',
      stepDot: 'text-red-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      id={id}
      className={`rounded-2xl border bg-[#0F150E] p-6 sm:p-8 transition-all duration-200 hover:shadow-xl hover:shadow-[#B4F437]/5 ${style.border}`}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${style.iconBox}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${style.badge}`}>
              {badge}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1.5">
              {title}
            </h3>
          </div>
        </div>
      </div>

      <p className="text-sm sm:text-base text-neutral-200 mb-6 leading-relaxed font-normal">
        {description}
      </p>

      <div className="space-y-4 border-t border-white/10 pt-5">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              <CheckCircle2 className={`h-4 w-4 ${style.stepDot}`} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                {step.title}
              </h4>
              <p className="text-sm text-neutral-200 mt-1 leading-relaxed font-normal">
                {step.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
