import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, ExternalLink, AlertCircle, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="main-footer"
      className="relative z-10 border-t border-white/10 bg-[#060A05] text-neutral-300 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Initiative Identity */}
          <div className="md:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#141C12] border border-[#B4F437]/30 text-[#B4F437] shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Cyber<span className="text-[#B4F437]">Aware</span>
              </span>
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed max-w-md font-normal">
              A College Extension & Community Engagement Project (CEP) dedicated to educating students and citizens on identifying phishing emails, scam messages, digital fraud, and social engineering threats.
            </p>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#B4F437]/20 bg-[#121A10] px-3 py-1 text-xs text-[#B4F437] font-semibold">
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Community Awareness & Safety Initiative</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Platform Modules
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors font-medium">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-neutral-400 hover:text-white transition-colors font-medium">
                  Learn Topics
                </Link>
              </li>
              <li>
                <Link to="/detect" className="text-neutral-400 hover:text-white transition-colors font-medium">
                  Phishing Simulator (Detect)
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-neutral-400 hover:text-white transition-colors font-medium">
                  Awareness Quiz
                </Link>
              </li>
              <li>
                <Link to="/results" className="text-neutral-400 hover:text-white transition-colors font-medium">
                  Check Participant Results
                </Link>
              </li>
              <li>
                <Link to="/responses" className="text-neutral-400 hover:text-white transition-colors font-medium">
                  Form & Sheet Responses
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-neutral-400 hover:text-white transition-colors font-medium">
                  Emergency Safety Guide
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors font-medium">
                  About CEP Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Helplines */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Official Cyber Helplines
            </h3>
            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-4">
                <div className="flex items-center gap-2 text-red-300 font-bold text-xs mb-1.5">
                  <PhoneCall className="h-4 w-4 text-red-400" />
                  <span>National Cyber Crime Helpline</span>
                </div>
                <div className="text-2xl font-black text-white tracking-wider">
                  Dial 1930
                </div>
                <p className="text-xs text-neutral-400 mt-1 font-normal">Toll-free 24x7 Emergency Assistance</p>
              </div>

              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#B4F437] hover:underline transition-colors p-1"
              >
                <span>National Portal: <span className="font-mono">cybercrime.gov.in</span></span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-start gap-2.5 max-w-2xl">
            <AlertCircle className="h-4 w-4 text-[#B4F437] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white font-semibold">Educational Disclaimer:</strong> This platform is created strictly for academic, educational, and public awareness purposes under a College Extension & Community Engagement Project (CEP). It does not replace professional cybersecurity, banking, legal, or law-enforcement advice.
            </p>
          </div>
          <div className="text-right shrink-0 text-neutral-500">
            <p>© {new Date().getFullYear()} CyberAware CEP. All rights reserved.Devloped By - Prinde Dev</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
