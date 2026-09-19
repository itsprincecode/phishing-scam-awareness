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
  accentColor?: 'cyan' | 'blue' | 'teal' | 'emerald';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  id,
  title,
  description,
  icon: Icon,
  to,
  badge,
  accentColor = 'cyan',
}) => {
  const colorMap = {
    cyan: 'border-cyan-800/40 hover:border-cyan-500/60 bg-[#0A1424]/80 text-cyan-400 group-hover:text-cyan-300',
    blue: 'border-blue-800/40 hover:border-blue-500/60 bg-[#0A1424]/80 text-blue-400 group-hover:text-blue-300',
    teal: 'border-teal-800/40 hover:border-teal-500/60 bg-[#0A1424]/80 text-teal-400 group-hover:text-teal-300',
    emerald: 'border-emerald-800/40 hover:border-emerald-500/60 bg-[#0A1424]/80 text-emerald-400 group-hover:text-emerald-300',
  };

  return (
    <Link
      id={id}
      to={to}
      className={`group relative flex flex-col justify-between rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${colorMap[accentColor]}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900/90 border border-slate-700/50 transition-colors duration-200 group-hover:border-cyan-500/40">
            <Icon className="h-5 w-5" />
          </div>
          {badge ? (
            <span className="rounded-full bg-cyan-950 border border-cyan-800/60 px-2.5 py-0.5 text-[11px] font-medium text-cyan-300">
              {badge}
            </span>
          ) : (
            <div className="rounded-full p-1 text-slate-500 group-hover:text-cyan-400 transition-colors">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-200 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 opacity-90 group-hover:opacity-100 group-hover:underline">
        <span>Explore Module</span>
        <ArrowUpRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
};
