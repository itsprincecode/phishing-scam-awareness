import React from 'react';
import { Link } from 'react-router-dom';
import {
  MailWarning,
  AlertTriangle,
  ShieldAlert,
  Users,
  Globe,
  Link2,
  CreditCard,
  Briefcase,
  Share2,
  ArrowRight,
  Clock
} from 'lucide-react';
import { LearningTopic } from '../types';

interface TopicCardProps {
  topic: LearningTopic;
  index: number;
}

const iconRegistry: Record<string, React.ElementType> = {
  MailWarning,
  AlertTriangle,
  ShieldAlert,
  Users,
  Globe,
  Link2,
  CreditCard,
  Briefcase,
  Share2,
};

export const TopicCard: React.FC<TopicCardProps> = ({ topic, index }) => {
  const Icon = iconRegistry[topic.iconName] || AlertTriangle;

  return (
    <Link
      id={`topic-card-${topic.id}`}
      to={`/learn/${topic.id}`}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-[#08101E]/90 p-5 transition-all duration-200 hover:border-cyan-500/50 hover:bg-[#0A1628] hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/50 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{topic.readTime}</span>
          </div>
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/90 mb-1">
          {topic.category}
        </div>

        <h3 className="text-base font-semibold text-white group-hover:text-cyan-200 transition-colors">
          {topic.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
          {topic.shortDesc}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
        <span>Read Guide</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};
