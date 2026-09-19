import React from 'react';
import {
  GraduationCap,
  Target,
  CheckCircle,
  Code2,
  Database,
  ShieldAlert,
  Mail,
  HeartHandshake,
  AlertCircle
} from 'lucide-react';

export const About: React.FC = () => {
  const learningOutcomes = [
    'Recognize psychological manipulation, false urgency, and social engineering pretexts in messages.',
    'Distinguish between genuine institutional domains and deceptive typosquatting lookalikes.',
    'Understand why OTPs, CVVs, and UPI PINs should never be disclosed under any circumstances.',
    'Assess realistic threat simulations and apply safe protocols before clicking unknown links.',
    'Respond effectively during an incident by contacting bank hotlines and the national 1930 cybercrime helpline.',
  ];

  const technologies = [
    { name: 'React 19 & Vite', category: 'Frontend Framework & Bundler' },
    { name: 'TypeScript', category: 'Type Safety & Application Architecture' },
    { name: 'Tailwind CSS', category: 'Responsive Cybersecurity UI Styling' },
    { name: 'Supabase PostgreSQL', category: 'Database, RLS Security & Project Analytics' },
    { name: 'Lucide React', category: 'Lightweight & Semantic Iconography' },
    { name: 'ThreeUI Shaders Ready', category: 'Pointer-Reactive Matrix Laser Background' },
  ];

  return (
    <div className="relative z-10 py-10 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Academic Extension Project</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About the CyberAware Program
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            A College Extension and Community Engagement Project (CEP) created to build digital defense resilience among students and everyday citizens.
          </p>
        </div>

        {/* Project Profile Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-8 mb-10 shadow-xl">
          <div className="border-b border-slate-800/80 pb-4 mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Project Specification
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Phishing, Scam & Fraud Detection Awareness Program
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Target className="h-4 w-4 text-cyan-400" />
                <span>Project Objective</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To address the escalating wave of financial fraud, job application deception, and credential theft targeting students and youth through accessible, interactive, and jargon-free education.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <HeartHandshake className="h-4 w-4 text-cyan-400" />
                <span>Community Engagement Scope</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Deployed as a college community extension tool for classroom seminars, student orientations, and community workshops to evaluate and elevate baseline cyber vigilance.
              </p>
            </div>
          </div>
        </div>

        {/* Key Learning Outcomes */}
        <div className="rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-8 mb-10 shadow-xl">
          <h2 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span>Key Learning Outcomes</span>
          </h2>
          <div className="space-y-3">
            {learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60 text-[11px] font-bold mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed font-normal">{outcome}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Used */}
        <div className="rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-8 mb-10 shadow-xl">
          <h2 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-cyan-400" />
            <span>Technologies & Architecture</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {technologies.map((tech, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800/80 bg-[#060D18] p-3.5 flex flex-col justify-between"
              >
                <span className="text-sm font-semibold text-white">{tech.name}</span>
                <span className="text-xs text-slate-400 mt-0.5 font-normal">{tech.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="rounded-2xl border border-slate-800 bg-[#0A1424] p-6 sm:p-8 mb-10 shadow-xl">
          <h2 className="text-lg font-bold text-white tracking-tight mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5 text-cyan-400" />
            <span>CEP Project Contact</span>
          </h2>
          <p className="text-xs text-slate-400 mb-4 font-normal">
            For academic inquiries, seminar scheduling, or suggestions regarding this community engagement initiative:
          </p>
          <div className="rounded-xl border border-slate-800 bg-[#060D18] p-4 text-xs text-slate-300 space-y-1.5 font-medium">
            <div><strong className="text-slate-400">Program:</strong> CyberAware CEP Extension Team</div>
            <div><strong className="text-slate-400">Department:</strong> Computer Science & Information Security</div>
            <div><strong className="text-slate-400">Email:</strong> <span className="font-mono text-cyan-300">awareness-cep@college-domain.edu</span></div>
            <div><strong className="text-slate-400">Academic Year:</strong> 2025–2026</div>
          </div>
        </div>

        {/* Disclaimer Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#070E1A] p-6 sm:p-8 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Educational & Awareness Disclaimer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This website is created for educational and awareness purposes. It does not replace professional cybersecurity, banking, legal, or law-enforcement advice. No personal banking credentials, passwords, or identification numbers are ever requested or stored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
