import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  badge?: string;
  accentColor?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  to,
  badge,
}) => {
  return (
    <Link
      id={id}
      to={to}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#B4F437]/50 hover:shadow-xl hover:shadow-[#B4F437]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437]"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141C12] border border-white/10 text-[#B4F437] transition-all duration-200 group-hover:border-[#B4F437]/60 group-hover:scale-105">
            <Icon className="h-5 w-5" />
          </div>
          {badge ? (
            <span className="text-[11px] font-semibold text-[#B4F437] px-2.5 py-0.5 rounded-md bg-[#162013] border border-[#B4F437]/30">
              {badge}
            </span>
          ) : (
            <div className="rounded-full p-1 text-neutral-500 group-hover:text-[#B4F437] transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#B4F437] transition-colors">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-neutral-200 leading-relaxed font-normal">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#B4F437] opacity-90 group-hover:opacity-100">
        <span>Explore Module</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
};
