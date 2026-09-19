import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Lock,
  Zap,
  Users
} from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';
import { fetchProjectStats } from '../lib/supabase';
import { ProjectStats } from '../types';
import { AnimatedCounter } from '../components/AnimatedCounter';

export const Home: React.FC = () => {
  const [stats, setStats] = useState<ProjectStats>({
    totalParticipants: 0,
    totalQuizAttempts: 0,
    totalDetectionAttempts: 0,
    averageAwarenessScore: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchProjectStats()
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoadingStats(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoadingStats(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative z-10">
      {/* ================================================================= */}
      {/* HERO SECTION                                                      */}
      {/* ================================================================= */}
      <section
        id="hero-section"
        className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Phishing • Scam • Fraud Awareness</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
            Think Before You <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200">Click.</span>
          </h1>

          {/* Supporting Text */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed mb-8 font-normal">
            Learn how to identify phishing, scams and digital fraud before they put your information, money or accounts at risk.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              id="hero-primary-cta"
              to="/learn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-6 py-3.5 text-sm font-semibold shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-150 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              id="hero-secondary-cta"
              to="/quiz"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 hover:border-slate-600 text-white px-6 py-3.5 text-sm font-semibold transition-all duration-150 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>Take the Quiz</span>
              <HelpCircle className="h-4 w-4 text-cyan-400" />
            </Link>
          </div>

          {/* Controlled Cybersecurity Visual Treatment */}
          <div className="relative mx-auto max-w-3xl rounded-2xl border border-cyan-900/40 bg-[#07111F]/80 p-5 sm:p-6 backdrop-blur-md shadow-2xl shadow-cyan-950/40 text-left">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-slate-400">threat-analyzer://community-feed</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                <Lock className="h-3.5 w-3.5" />
                <span className="font-mono">ENCRYPTED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg bg-[#040810]/70 border border-slate-800 p-3">
                <div className="text-slate-400 font-medium">Common Threat Vector</div>
                <div className="text-cyan-300 font-semibold text-sm mt-1">Urgent Deceptive SMS</div>
                <p className="text-slate-400 text-[11px] mt-1">Fake bank blockage notices</p>
              </div>

              <div className="rounded-lg bg-[#040810]/70 border border-slate-800 p-3">
                <div className="text-slate-400 font-medium">Primary Human Flaw</div>
                <div className="text-amber-300 font-semibold text-sm mt-1">Artificial Panic</div>
                <p className="text-slate-400 text-[11px] mt-1">Fear of losing accounts</p>
              </div>

              <div className="rounded-lg bg-[#040810]/70 border border-slate-800 p-3">
                <div className="text-slate-400 font-medium">Core Defense Rule</div>
                <div className="text-emerald-300 font-semibold text-sm mt-1">Never Share OTPs</div>
                <p className="text-slate-400 text-[11px] mt-1">Verify via authentic apps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CEP COMMUNITY ACTIVITY METRICS BAR (REAL DYNAMIC DATA)            */}
      {/* ================================================================= */}
      <section id="cep-metrics" className="border-y border-slate-800/80 bg-[#060D1A]/80 backdrop-blur-sm py-6 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/60 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Activity Metrics</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Dynamic CEP Records</span>
            </div>
            <Link
              to="/results"
              className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>View Individual Submissions</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center divide-y-0 divide-slate-800/80">
            {/* Card 1: Unique Participants */}
            <Link
              to="/results"
              id="stat-participants"
              className="group hover:bg-slate-900/40 rounded-xl p-3 sm:p-4 border border-slate-800/60 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-300 group-hover:scale-105 transition-transform duration-200">
                {loadingStats ? (
                  <span className="inline-block w-12 h-8 bg-slate-800 animate-pulse rounded" />
                ) : (
                  <AnimatedCounter value={stats.totalParticipants} />
                )}
              </div>
              <div className="text-xs text-slate-300 group-hover:text-cyan-300 mt-1 uppercase tracking-wider font-semibold">
                Participants
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {stats.totalParticipants <= 1
                  ? (stats.totalParticipants === 1 ? '1 active participant' : 'Be the first participant')
                  : 'Unique participants verified'}
              </div>
            </Link>

            {/* Card 2: Quizzes Completed */}
            <Link
              to="/quiz"
              id="stat-quizzes-completed"
              className="group hover:bg-slate-900/40 rounded-xl p-3 sm:p-4 border border-slate-800/60 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-cyan-400 group-hover:scale-105 transition-transform duration-200">
                {loadingStats ? (
                  <span className="inline-block w-12 h-8 bg-slate-800 animate-pulse rounded" />
                ) : (
                  <AnimatedCounter value={stats.totalQuizAttempts} />
                )}
              </div>
              <div className="text-xs text-slate-300 group-hover:text-cyan-300 mt-1 uppercase tracking-wider font-semibold">
                Quizzes Completed
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {stats.totalQuizAttempts === 0 ? 'Start evaluation' : 'Verified quiz records'}
              </div>
            </Link>

            {/* Card 3: Scenarios Analyzed */}
            <Link
              to="/detect"
              id="stat-scenarios-analyzed"
              className="group hover:bg-slate-900/40 rounded-xl p-3 sm:p-4 border border-slate-800/60 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-teal-400 group-hover:scale-105 transition-transform duration-200">
                {loadingStats ? (
                  <span className="inline-block w-12 h-8 bg-slate-800 animate-pulse rounded" />
                ) : (
                  <AnimatedCounter value={stats.totalDetectionAttempts} />
                )}
              </div>
              <div className="text-xs text-slate-300 group-hover:text-teal-300 mt-1 uppercase tracking-wider font-semibold">
                Scenarios Analyzed
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {stats.totalDetectionAttempts === 0 ? 'Interactive simulations' : 'Live threat assessments logged'}
              </div>
            </Link>

            {/* Card 4: Average Awareness Score */}
            <Link
              to="/results"
              id="stat-average-score"
              className="group hover:bg-slate-900/40 rounded-xl p-3 sm:p-4 border border-slate-800/60 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                {loadingStats ? (
                  <span className="inline-block w-16 h-8 bg-slate-800 animate-pulse rounded" />
                ) : (
                  <AnimatedCounter value={stats.averageAwarenessScore} suffix="%" />
                )}
              </div>
              <div className="text-xs text-slate-300 group-hover:text-emerald-300 mt-1 uppercase tracking-wider font-semibold">
                Average Awareness Score
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {stats.averageAwarenessScore === 0 ? 'Calculated upon submission' : 'Dynamic cohort performance'}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4 FEATURE CARDS                                                   */}
      {/* ================================================================= */}
      <section id="feature-cards-section" className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Essential Cyber Defense Skills
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Practical, jargon-free education built for students and everyday internet users.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              id="feature-card-learn"
              title="Learn"
              description="Understand common online threats and psychological manipulation tactics."
              icon={ShieldAlert}
              to="/learn"
              badge="9 Topics"
              accentColor="cyan"
            />

            <FeatureCard
              id="feature-card-detect"
              title="Detect"
              description="Identify suspicious messages, fraudulent links and fake portal designs."
              icon={Search}
              to="/detect"
              badge="Interactive"
              accentColor="blue"
            />

            <FeatureCard
              id="feature-card-test"
              title="Test"
              description="Check your cybersecurity awareness using real-world scenarios and scoring."
              icon={HelpCircle}
              to="/quiz"
              badge="10 Questions"
              accentColor="teal"
            />

            <FeatureCard
              id="feature-card-safety"
              title="Stay Safe"
              description="Follow practical safety guidelines and discover official helpline resources."
              icon={ShieldCheck}
              to="/safety"
              badge="Helpline 1930"
              accentColor="emerald"
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* HOW IT WORKS SECTION (MINIMAL 4 STEPS)                            */}
      {/* ================================================================= */}
      <section id="how-it-works-section" className="py-12 md:py-16 bg-[#060E1C]/40 border-y border-slate-800/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Step-by-Step Methodology
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              How CyberAware Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="rounded-xl border border-slate-800 bg-[#081220] p-5">
              <div className="text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-900/60 w-7 h-7 rounded-lg flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-semibold text-white text-base">Learn</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                Read practical summaries of phishing, job scams, and OTP fraud.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#081220] p-5">
              <div className="text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-900/60 w-7 h-7 rounded-lg flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-semibold text-white text-base">Identify</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                Spot specific red flags like false urgency, spoofed domains, and QR scams.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#081220] p-5">
              <div className="text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-900/60 w-7 h-7 rounded-lg flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-semibold text-white text-base">Test</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                Complete realistic scenarios and a 10-question evaluation to check your reflexes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#081220] p-5">
              <div className="text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-900/60 w-7 h-7 rounded-lg flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="font-semibold text-white text-base">Stay Safe</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-normal">
                Adopt safe habits, enable multi-factor auth, and report scams to 1930.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* COMPACT CTA SECTION                                               */}
      {/* ================================================================= */}
      <section id="compact-cta-section" className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-cyan-900/50 bg-gradient-to-br from-[#0A1628] to-[#060D18] p-8 sm:p-10 text-center shadow-2xl shadow-cyan-950/40">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
              Ready to test your awareness?
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-300 mb-6 leading-relaxed font-normal">
              Take the 10-question interactive quiz to see how well you can detect deceptive emails, fake bank notices, and malicious payment links.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                id="bottom-quiz-cta"
                to="/quiz"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-7 py-3.5 text-sm font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-150 active:scale-[0.98]"
              >
                <span>Take the Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/results"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 hover:border-cyan-500/50 bg-[#081220] hover:bg-slate-800 text-slate-200 hover:text-white px-6 py-3.5 text-sm font-semibold transition-all"
              >
                <span>Check Quiz Results</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
