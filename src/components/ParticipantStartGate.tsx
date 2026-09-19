import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Mail,
  ArrowRight,
  AlertCircle,
  Clock,
  Award,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  checkEmailAlreadyUsedForQuiz,
  checkEmailAlreadyUsedForDetection
} from '../lib/supabase';
import { getLastParticipant, saveLastParticipant } from '../utils/storage';

interface ParticipantStartGateProps {
  title: string;
  subtitle: string;
  badgeText: string;
  assessmentType: 'quiz' | 'detection';
  buttonLabel: string;
  estimatedTime?: string;
  onProceed: (participant: { name: string; email: string }) => void;
}

export const ParticipantStartGate: React.FC<ParticipantStartGateProps> = ({
  title,
  subtitle,
  badgeText,
  assessmentType,
  buttonLabel,
  estimatedTime = '5-7 minutes',
  onProceed,
}) => {
  const lastParticipant = getLastParticipant();
  const [name, setName] = useState(lastParticipant?.name || '');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingAttemptDate, setExistingAttemptDate] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setExistingAttemptDate(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage('Please enter your full name to begin.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      // Check if this email is already registered and has completed this assessment
      let checkResult;
      if (assessmentType === 'quiz') {
        checkResult = await checkEmailAlreadyUsedForQuiz(cleanEmail);
      } else {
        checkResult = await checkEmailAlreadyUsedForDetection(cleanEmail);
      }

      if (checkResult.alreadyUsed) {
        setErrorMessage(
          'This email address has already been used. Each participant can only attempt this assessment once. Please enter another email address.'
        );
        if (checkResult.existingRecord?.completed_at) {
          try {
            const formatted = new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
            }).format(new Date(checkResult.existingRecord.completed_at));
            setExistingAttemptDate(formatted);
          } catch {
            setExistingAttemptDate(checkResult.existingRecord.completed_at);
          }
        }
        setLoading(false);
        return;
      }

      // Email is unique and valid! Save as current participant & proceed
      saveLastParticipant({ name: cleanName, email: cleanEmail });
      onProceed({ name: cleanName, email: cleanEmail });
    } catch (err) {
      console.error('Participant validation failed:', err);
      // In case of unexpected network error, allow proceed with local fallback
      saveLastParticipant({ name: cleanName, email: cleanEmail });
      onProceed({ name: cleanName, email: cleanEmail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-10 shadow-2xl shadow-cyan-950/40">
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-slate-800/80">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/50 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>{badgeText}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>Est. {estimatedTime}</span>
          </div>
        </div>

        {/* Title & Introduction */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Policy & Guidance Note */}
        <div className="mb-6 rounded-xl border border-slate-800/80 bg-[#060D18] p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>One Attempt Policy:</strong> To ensure accurate awareness measurement, each participant email can only be registered once.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Your full name will be printed on your official <strong>Cyber Awareness Certificate</strong> and your scores will be accessible anytime via the Results portal.
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="start-participant-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Full Name <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <User className="h-4 w-4" />
              </div>
              <input
                id="start-participant-name"
                type="text"
                required
                placeholder="e.g. Alex Kumar"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full rounded-xl border border-slate-700 bg-[#060D18] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="start-participant-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              College / Personal Email Address <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="start-participant-email"
                type="email"
                required
                placeholder="e.g. alex.kumar@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full rounded-xl border border-slate-700 bg-[#060D18] pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Error Message Display if already used */}
          {errorMessage && (
            <div className="rounded-xl border border-rose-900/60 bg-rose-950/40 p-4 text-xs text-rose-200 space-y-2 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-rose-200">{errorMessage}</p>
                  {existingAttemptDate && (
                    <p className="text-rose-300/80 text-[11px]">
                      Previous attempt recorded on: <strong>{existingAttemptDate}</strong>
                    </p>
                  )}
                </div>
              </div>

              {email && (
                <div className="pt-2 border-t border-rose-900/40 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-rose-300/90">
                    Already took this assessment?
                  </span>
                  <Link
                    to={`/results?email=${encodeURIComponent(email.trim().toLowerCase())}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-900/70 text-white font-semibold text-[11px] transition-colors"
                  >
                    <span>View Your Existing Result & Certificate</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              id="btn-start-assessment"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#050B14] py-3.5 px-6 text-sm font-bold shadow-lg shadow-cyan-950 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#050B14] border-t-transparent" />
                  <span>Checking Eligibility...</span>
                </>
              ) : (
                <>
                  <span>{buttonLabel}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/results"
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Already participated? Look up your records</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
