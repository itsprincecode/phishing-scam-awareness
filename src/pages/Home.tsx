import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Zap,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';
import { fetchProjectStats } from '../lib/supabase';
import { ProjectStats } from '../types';
import { AnimatedCounter } from '../components/AnimatedCounter';

// Four-point geometric star SVG matching the uploaded image
const FourPointStar = ({ className = 'w-6 h-6 text-[#B4F437]' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

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
      {/* HERO SECTION - REPLICA OF THE UPLOADED KRONIX AESTHETIC           */}
      {/* ================================================================= */}
      <section
        id="hero-section"
        className="relative pt-8 pb-10 md:pt-14 md:pb-12 overflow-hidden text-center"
      >
        {/* Soft Ambient Radial Olive/Lime Glow behind Hero */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] md:w-[1050px] h-[500px] pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,_rgba(180,244,55,0.15)_0%,_rgba(100,160,30,0.06)_40%,_transparent_72%)] blur-2xl"
          aria-hidden="true"
        />

        {/* Scattered 4-point decorative stars around hero (exact match to image) */}
        <div className="absolute top-20 left-10 sm:left-24 opacity-40 pointer-events-none hidden sm:block">
          <FourPointStar className="w-5 h-5 text-[#B4F437]/70" />
        </div>
        <div className="absolute bottom-28 left-16 sm:left-36 opacity-30 pointer-events-none hidden sm:block">
          <FourPointStar className="w-4 h-4 text-[#B4F437]/60" />
        </div>
        <div className="absolute bottom-36 right-16 sm:right-32 opacity-35 pointer-events-none hidden sm:block">
          <FourPointStar className="w-4 h-4 text-[#B4F437]/70" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Main Headline - Bold typography echoing "Bringing Your Dream Into Reality" */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.08] mb-4">
            Making Online
            <br />
            Safety a{' '}
            <span className="relative inline-block text-[#B4F437]">
              Reality
              {/* Prominent green 4-point star on the top-right of "Reality" as shown in the screenshot */}
              <span className="absolute -top-3 -right-8 sm:-top-6 sm:-right-12 md:-top-7 md:-right-14">
                <FourPointStar className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14 text-[#B4F437] drop-shadow-[0_0_15px_rgba(180,244,55,0.8)]" />
              </span>
            </span>
          </h1>

          {/* Supporting Subtitle - Crisp, readable typography */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-neutral-200 leading-relaxed mb-6 sm:mb-8 font-normal">
            We increase security awareness and ensure sustainable digital protection for your personal data and organization through interactive scam detection.
          </p>

          {/* Primary Hero CTA Button - Solid Neon Lime with Black Text leading to Step 1: Learn */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              id="hero-primary-cta"
              to="/learn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] px-8 py-3 text-sm sm:text-base font-bold shadow-[0_0_30px_rgba(180,244,55,0.3)] hover:shadow-[0_0_40px_rgba(180,244,55,0.55)] transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437]"
            >
              <span>Get Started</span>
            </Link>

            <Link
              id="hero-secondary-cta"
              to="/detect"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-[#121811]/80 hover:bg-[#182216] hover:border-[#B4F437]/50 text-white px-7 py-3 text-sm sm:text-base font-semibold transition-all duration-200 active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#B4F437]"
            >
              <span>Try Simulator</span>
              <Search className="h-4 w-4 text-[#B4F437]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* CEP COMMUNITY ACTIVITY METRICS BAR (SEAMLESS SINGLE-PAGE FLOW)    */}
      {/* ================================================================= */}
      <section id="cep-metrics" className="py-6 sm:py-8 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2 text-neutral-300 font-medium">
              <span className="flex h-2 w-2 rounded-full bg-[#B4F437] animate-pulse" />
              <span>Live Activity Metrics</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
            {/* Card 1: Unique Participants */}
            <Link
              to="/results"
              id="stat-participants"
              className="group hover:border-[#B4F437]/40 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-3.5 sm:p-4 border border-white/10 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#B4F437] group-hover:scale-105 transition-transform duration-200">
                {loadingStats ? (
                  <span className="inline-block w-12 h-8 bg-neutral-800 animate-pulse rounded" />
                ) : (
                  <AnimatedCounter value={stats.totalParticipants} />
                )}
              </div>
              <div className="text-xs text-neutral-300 group-hover:text-white mt-1 uppercase tracking-wider font-semibold">
                Participants
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                {stats.totalParticipants <= 1
                  ? (stats.totalParticipants === 1 ? '1 active participant' : 'Be the first participant')
                  : 'Unique participants verified'}
              </div>
            </Link>

            {/* Card 2: Quizzes Completed */}
            <Link
              to="/quiz"
              id="stat-quizzes-completed"
              className="group hover:border-[#B4F437]/40 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-3.5 sm:p-4 border border-white/10 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#B4F437] group-hover:scale-105 transition-transform duration-200">
                {loadingStats ? (
                  <span className="inline-block w-12 h-8 bg-neutral-800 animate-pulse rounded" />
                ) : (
                  <AnimatedCounter value={stats.totalQuizAttempts} />
                )}
              </div>
              <div className="text-xs text-neutral-300 group-hover:text-white mt-1 uppercase tracking-wider font-semibold">
                Quizzes Completed
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                {stats.totalQuizAttempts === 0 ? 'Start evaluation' : 'Verified quiz records'}
              </div>
            </Link>

            {/* Card 3: Scenarios Analyzed */}
            <Link
              to="/detect"
              id="stat-scenarios-analyzed"
              className="group hover:border-emerald-400/50 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-3.5 sm:p-4 border border-white/10 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                {loadingStats ? (
                  <span className="inline-block w-12 h-8 bg-neutral-800 animate-pulse rounded" />
                ) : (
                  <AnimatedCounter value={stats.totalDetectionAttempts} />
                )}
              </div>
              <div className="text-xs text-neutral-300 group-hover:text-white mt-1 uppercase tracking-wider font-semibold">
                Scenarios Analyzed
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                {stats.totalDetectionAttempts === 0 ? 'Interactive simulations' : 'Live threat assessments logged'}
              </div>
            </Link>

            {/* Card 4: Average Awareness Score */}
            <Link
              to="/results"
              id="stat-average-score"
              className="group hover:border-[#B4F437]/40 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl p-3.5 sm:p-4 border border-white/10 transition-all"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#B4F437] group-hover:scale-105 transition-transform duration-200">
                {loadingStats ? (
                  <span className="inline-block w-16 h-8 bg-neutral-800 animate-pulse rounded" />
                ) : (
                  <AnimatedCounter value={stats.averageAwarenessScore} suffix="%" />
                )}
              </div>
              <div className="text-xs text-neutral-300 group-hover:text-white mt-1 uppercase tracking-wider font-semibold">
                Average Awareness Score
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                {stats.averageAwarenessScore === 0 ? 'Calculated upon submission' : 'Dynamic cohort performance'}
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4 FEATURE CARDS                                                   */}
      {/* ================================================================= */}
      <section id="feature-cards-section" className="py-8 sm:py-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Essential Cyber Defense Skills
            </h2>
            <p className="mt-2 text-base sm:text-lg text-neutral-200 leading-relaxed font-normal">
              Practical, jargon-free cybersecurity education built for students and everyday internet users.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <FeatureCard
              id="feature-card-learn"
              title="Learn"
              description="Understand common online threats, phishing tactics, and social engineering manipulations."
              icon={ShieldAlert}
              to="/learn"
              badge="9 Topics"
            />

            <FeatureCard
              id="feature-card-detect"
              title="Detect"
              description="Inspect suspicious messages, identify fraudulent payment links and fake portal logins."
              icon={Search}
              to="/detect"
              badge="Interactive"
            />

            <FeatureCard
              id="feature-card-test"
              title="Test"
              description="Check your cybersecurity awareness using real-world scenarios and earn your certificate."
              icon={HelpCircle}
              to="/quiz"
              badge="10 Questions"
            />

            <FeatureCard
              id="feature-card-safety"
              title="Stay Safe"
              description="Follow practical safety checklists and discover official emergency helpline resources."
              icon={ShieldCheck}
              to="/safety"
              badge="Helpline 1930"
            />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* HOW IT WORKS SECTION (SEAMLESS SINGLE-PAGE FLOW)                  */}
      {/* ================================================================= */}
      <section id="how-it-works-section" className="py-8 sm:py-12 relative z-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B4F437]">
              Step-by-Step Methodology
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
              How CyberAware Works
            </h2>
            <p className="mt-1.5 text-sm text-neutral-300 font-normal">
              Follow the recommended pathway: 1. Learn ➔ 2. Detect ➔ 3. Quiz
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            <Link
              to="/learn"
              className="group rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-4 sm:p-5 hover:border-[#B4F437]/50 transition-all"
            >
              <div className="text-xs font-bold text-[#080C07] bg-[#B4F437] w-7 h-7 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                1
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-[#B4F437] transition-colors">
                Step 1: Learn
              </h3>
              <p className="text-sm text-neutral-200 mt-1.5 leading-relaxed font-normal">
                Read practical summaries of phishing, job scams, and OTP fraud.
              </p>
            </Link>

            <Link
              to="/detect"
              className="group rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-4 sm:p-5 hover:border-[#B4F437]/50 transition-all"
            >
              <div className="text-xs font-bold text-[#080C07] bg-[#B4F437] w-7 h-7 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                2
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-[#B4F437] transition-colors">
                Step 2: Detect
              </h3>
              <p className="text-sm text-neutral-200 mt-1.5 leading-relaxed font-normal">
                Spot specific red flags like false urgency, spoofed domains, and QR scams.
              </p>
            </Link>

            <Link
              to="/quiz"
              className="group rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-4 sm:p-5 hover:border-[#B4F437]/50 transition-all"
            >
              <div className="text-xs font-bold text-[#080C07] bg-[#B4F437] w-7 h-7 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                3
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-[#B4F437] transition-colors">
                Step 3: Quiz
              </h3>
              <p className="text-sm text-neutral-200 mt-1.5 leading-relaxed font-normal">
                Complete realistic scenarios and a 10-question evaluation to test reflexes.
              </p>
            </Link>

            <Link
              to="/safety"
              className="group rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-4 sm:p-5 hover:border-[#B4F437]/50 transition-all"
            >
              <div className="text-xs font-bold text-[#080C07] bg-[#B4F437] w-7 h-7 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                4
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-[#B4F437] transition-colors">
                Stay Safe
              </h3>
              <p className="text-sm text-neutral-200 mt-1.5 leading-relaxed font-normal">
                Adopt safe habits, enable multi-factor auth, and report scams to 1930.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* COMPACT CTA SECTION                                               */}
      {/* ================================================================= */}
      <section id="compact-cta-section" className="py-8 sm:py-12 relative z-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-[#111A0F] to-[#0A1009] p-6 sm:p-8 md:p-10 text-center shadow-2xl overflow-hidden">
            {/* Ambient Radial Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-[#B4F437]/10 blur-3xl pointer-events-none" />

            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              Ready to begin your cyber defense journey?
            </h2>
            <p className="relative mx-auto max-w-xl text-sm sm:text-base text-neutral-200 mb-6 leading-relaxed font-normal">
              Follow the recommended sequence: Start by exploring threat lessons in <strong>Learn</strong>, practice identifying deceptive messages in <strong>Detect</strong>, and then test your instincts with the <strong>Quiz</strong>.
            </p>
            <div className="relative flex flex-wrap items-center justify-center gap-3">
              <Link
                id="bottom-start-cta"
                to="/learn"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#B4F437] hover:bg-[#C6F756] text-[#080C07] px-7 py-3 text-sm sm:text-base font-bold shadow-[0_0_25px_rgba(180,244,55,0.3)] transition-all duration-150 active:scale-[0.98]"
              >
                <span>Step 1: Start Learning</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/detect"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 hover:border-[#B4F437]/50 bg-[#141C12] hover:bg-[#182216] text-white px-5 py-3 text-sm sm:text-base font-semibold transition-all"
              >
                <span>Step 2: Try Simulator</span>
              </Link>
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 hover:border-[#B4F437]/50 bg-[#141C12] hover:bg-[#182216] text-white px-5 py-3 text-sm sm:text-base font-semibold transition-all"
              >
                <span>Step 3: Take Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
