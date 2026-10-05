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

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const Icon = iconRegistry[topic.iconName] || AlertTriangle;

  return (
    <Link
      id={`topic-card-${topic.id}`}
      to={`/learn/${topic.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0F150E] p-6 transition-all duration-200 hover:border-[#B4F437]/50 hover:bg-[#131B11] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#B4F437]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437]"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#151E13] border border-white/10 text-[#B4F437] group-hover:text-[#B4F437] group-hover:border-[#B4F437]/50 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <Clock className="h-3.5 w-3.5 text-neutral-400" />
            <span>{topic.readTime}</span>
          </div>
        </div>

        <div className="text-[11px] font-bold uppercase tracking-wider text-[#B4F437] mb-1.5">
          {topic.category}
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-[#B4F437] transition-colors">
          {topic.title}
        </h3>

        <p className="mt-2 text-sm text-neutral-200 leading-relaxed line-clamp-2 font-normal">
          {topic.shortDesc}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-neutral-400 group-hover:text-[#B4F437] transition-colors">
        <span>Read Guide</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};
