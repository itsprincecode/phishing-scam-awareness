import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, ExternalLink, AlertCircle, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-footer"
      className="relative z-10 border-t border-slate-700/80 bg-[#081325] text-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Initiative Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-sm shadow-cyan-950">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Cyber<span className="text-cyan-400">Aware</span>
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              A College Extension & Community Engagement Project (CEP) dedicated to educating students and citizens on identifying phishing emails, scam messages, digital fraud, and social engineering threats.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/60 bg-cyan-950/50 px-3.5 py-1 text-xs text-cyan-300 font-medium">
              <HeartHandshake className="h-3.5 w-3.5 text-cyan-400" />
              <span>Community Awareness & Safety Initiative</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3.5">
              Platform Modules
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">
                  Learn Topics
                </Link>
              </li>
              <li>
                <Link to="/detect" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">
                  Phishing Simulator (Detect)
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">
                  Awareness Quiz
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">
                  Check Participant Results
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">
                  Emergency Safety Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-cyan-400 transition-colors font-medium">
                  About CEP Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Helplines */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3.5">
              Official Cyber Helplines
            </h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-red-800/50 bg-red-950/40 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-red-300 font-semibold text-xs mb-1.5">
                  <PhoneCall className="h-4 w-4 text-red-400" />
                  <span>National Cyber Crime Helpline</span>
                </div>
                <div className="text-2xl font-extrabold text-white tracking-wider">
                  Dial 1930
                </div>
                <p className="text-xs text-slate-300 mt-1 font-normal">Toll-free across India • 24x7 Emergency Assistance</p>
              </div>

              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors p-1"
              >
                <span>National Portal: <span className="font-mono">cybercrime.gov.in</span></span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-8 border-t border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5 max-w-2xl">
            <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white font-semibold">Educational Disclaimer:</strong> This platform is created strictly for academic, educational, and public awareness purposes under a College Extension & Community Engagement Project (CEP). It does not replace professional cybersecurity, banking, legal, or law-enforcement advice. No financial credentials or private secrets are ever collected.
            </p>
          </div>
          <div className="text-right shrink-0 text-slate-400">
            <p>© {new Date().getFullYear()} CyberAware CEP. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
