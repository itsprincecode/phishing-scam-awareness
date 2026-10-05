import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Mail,
  Smartphone,
  Share2,
  Briefcase,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { DetectionScenario, ScenarioVerdict } from '../types';

interface ScenarioCardProps {
  scenario: DetectionScenario;
  index: number;
  total: number;
  userVerdict?: ScenarioVerdict;
  onSelectVerdict: (verdict: ScenarioVerdict) => void;
  onNext?: () => void;
  isLast?: boolean;
}

const channelIcons = {
  SMS: Smartphone,
  Email: Mail,
  WhatsApp: MessageSquare,
  'Social Media': Share2,
  'Job Portal': Briefcase,
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  index,
  total,
  userVerdict,
  onSelectVerdict,
  onNext,
  isLast,
}) => {
  const ChannelIcon = channelIcons[scenario.channel] || MessageSquare;
  const isAnswered = Boolean(userVerdict);
  const isCorrect = userVerdict === scenario.correctVerdict;

  return (
    <div
      id={`scenario-card-${scenario.id}`}
      className="rounded-2xl border border-white/10 bg-[#0F150E] shadow-2xl overflow-hidden"
    >
      {/* Header bar */}
      <div className="border-b border-white/10 bg-[#0A0F09] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 px-2.5 items-center justify-center rounded-md bg-[#162013] text-[#B4F437] border border-[#B4F437]/30 text-xs font-bold">
            Case #{index + 1} of {total}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <ChannelIcon className="h-3.5 w-3.5 text-[#B4F437]" />
            <span>{scenario.channel} Simulation</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded border border-white/10 bg-[#121811] text-neutral-300 font-semibold">
            {scenario.difficulty} Level
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <h2 className="text-xl font-bold text-white tracking-tight mb-2">
          {scenario.title}
        </h2>
        <p className="text-sm text-neutral-200 mb-6 font-normal leading-relaxed">
          Analyze the simulated incoming communication below and classify its risk level.
        </p>

        {/* Realistic Simulated Message Box */}
        <div className="mb-6 rounded-xl border border-white/10 bg-[#080C07] p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-300">From:</span>
              <span className="font-mono text-[#B4F437] bg-[#121811] px-2.5 py-0.5 rounded border border-white/10">
                {scenario.sender}
              </span>
            </div>
            <span className="text-neutral-500 font-medium text-[11px]">{scenario.timestamp}</span>
          </div>

          {scenario.subjectOrHeader && (
            <div className="text-xs font-semibold text-neutral-300 mb-3">
              Subject: <span className="text-white font-normal">{scenario.subjectOrHeader}</span>
            </div>
          )}

          <div className="font-sans text-sm text-neutral-200 leading-relaxed break-words whitespace-pre-line p-3.5 rounded-lg bg-[#0C120B] border border-white/5">
            {scenario.messageContent}
          </div>
        </div>

        {/* Action Prompt */}
        {!isAnswered ? (
          <div>
            <p className="text-sm font-semibold text-white mb-3">
              How would you classify this incoming message?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                id={`btn-verdict-safe-${scenario.id}`}
                type="button"
                onClick={() => onSelectVerdict('safe')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border border-emerald-800/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 hover:border-emerald-500 transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Safe</span>
              </button>

              <button
                id={`btn-verdict-suspicious-${scenario.id}`}
                type="button"
                onClick={() => onSelectVerdict('suspicious')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border border-amber-800/40 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 hover:border-amber-500 transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Suspicious</span>
              </button>

              <button
                id={`btn-verdict-scam-${scenario.id}`}
                type="button"
                onClick={() => onSelectVerdict('scam')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border border-red-800/40 bg-red-950/20 text-red-300 hover:bg-red-950/40 hover:border-red-500 transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Flame className="h-4 w-4 text-red-400" />
                <span>Scam / Fraud</span>
              </button>
            </div>
          </div>
        ) : (
          /* Answer Revealed */
          <div
            id={`verdict-feedback-${scenario.id}`}
            className={`rounded-xl border p-5 transition-all ${
              isCorrect
                ? 'border-[#B4F437]/50 bg-[#141C12]/80'
                : 'border-red-800/50 bg-red-950/20'
            }`}
          >
            {/* Status Header */}
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-[#B4F437] shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400 shrink-0" />
                )}
                <div>
                  <h4 className="text-base font-bold text-white">
                    {isCorrect ? 'Correct Analysis!' : 'Incorrect Classification'}
                  </h4>
                  <p className="text-xs text-neutral-300">
                    You chose <strong className="capitalize">{userVerdict}</strong>. The actual classification is <strong className="capitalize text-[#B4F437]">{scenario.correctVerdict}</strong>.
                  </p>
                </div>
              </div>

              <span
                className={`text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded ${
                  scenario.correctVerdict === 'safe'
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                    : scenario.correctVerdict === 'suspicious'
                    ? 'bg-amber-900/60 text-amber-300 border border-amber-700/50'
                    : 'bg-red-900/60 text-red-300 border border-red-700/50'
                }`}
              >
                {scenario.correctVerdict}
              </span>
            </div>

            {/* Explanation */}
            <div className="mb-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1">
                Expert Analysis
              </h5>
              <p className="text-sm text-neutral-200 leading-relaxed font-normal">
                {scenario.explanation}
              </p>
            </div>

            {/* Red flags */}
            {scenario.redFlags.length > 0 && (
              <div className="mb-4 rounded-lg bg-red-950/30 border border-red-900/40 p-3.5">
                <h5 className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  <span>Key Red Flags Detected ({scenario.redFlags.length})</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside font-normal">
                  {scenario.redFlags.map((flag, i) => (
                    <li key={i}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safe user actions */}
            <div className="mb-5 rounded-lg bg-[#111A0E] border border-[#B4F437]/30 p-3.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#B4F437] flex items-center gap-1.5 mb-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#B4F437]" />
                <span>What You Should Do</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside font-normal">
                {scenario.safeActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => onSelectVerdict('' as ScenarioVerdict)}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Change Answer</span>
              </button>

              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#B4F437]/20"
                >
                  <span>{isLast ? 'View Final Results' : 'Next Scenario'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
