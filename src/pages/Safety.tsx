import React from 'react';
import {
  ShieldAlert,
  MessageSquareWarning,
  ExternalLink,
  PhoneCall,
  AlertOctagon,
  Lock,
  FileCheck2,
  HelpCircle,
  Clock,
  Landmark,
  CheckCircle2,
  Info
} from 'lucide-react';
import { SafetyCard } from '../components/SafetyCard';
import { Link } from 'react-router-dom';

export const Safety: React.FC = () => {
  return (
    <div className="relative z-10 py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/40 bg-emerald-950/30 px-3 py-1 text-xs font-semibold text-emerald-300 mb-3">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Practical Incident Response Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Safety Center & Incident Guidance
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Clear, actionable steps to take if you receive a suspicious message, accidentally click a malicious link, or suspect financial fraud.
          </p>
        </div>

        {/* 3 Main Action Protocols */}
        <div className="space-y-8 mb-14">
          {/* Section A */}
          <SafetyCard
            id="safety-section-a"
            badge="Phase 1: Pre-Click Awareness"
            title="A. If You Receive a Suspicious Message"
            description="When an unknown or unexpected text, WhatsApp message, email, or direct message arrives claiming urgency, prizes, or account suspension:"
            icon={MessageSquareWarning}
            variant="cyan"
            steps={[
              {
                title: "1. Do NOT Click Any Links or Buttons",
                detail: "Even clicking the link can confirm to attackers that your phone number/email is active, or trigger automated redirect chains."
              },
              {
                title: "2. Do NOT Download or Open Attachments",
                detail: "Invoices, coupons, or forms sent as .zip, .html, or .apk files often harbor malware, spyware, or keyloggers."
              },
              {
                title: "3. Never Share OTPs, UPI PINs, or Passwords",
                detail: "No bank, telecom company, or college portal will ever ask you to recite an OTP over chat or call."
              },
              {
                title: "4. Verify Directly Through Official Channels",
                detail: "If the message claims to be from your bank, college, or courier, open their official app independently or call the number on your physical card."
              },
              {
                title: "5. Block and Report the Sender",
                detail: "Use built-in reporting features in WhatsApp, Gmail, or your SMS app to tag the sender as spam or fraud."
              }
            ]}
          />

          {/* Section B */}
          <SafetyCard
            id="safety-section-b"
            badge="Phase 2: Immediate Mitigation"
            title="B. If You Already Clicked a Suspicious Link"
            description="If you clicked a deceptive link before realizing it was unsafe, act swiftly to neutralize any compromise:"
            icon={AlertOctagon}
            variant="amber"
            steps={[
              {
                title: "1. Immediately Close the Browser Tab",
                detail: "Terminate the connection immediately and do not interact further with the page or download prompts."
              },
              {
                title: "2. Do NOT Enter Any Further Credentials or Details",
                detail: "Even if the page asks you to 'cancel the request' or 'verify your identity', close it right away."
              },
              {
                title: "3. Change Compromised Passwords Immediately",
                detail: "From a clean, trusted device or separate tab, log into the real service and change your password to a strong, unique pass-phrase."
              },
              {
                title: "4. Enable Multi-Factor Authentication (MFA)",
                detail: "Turn on two-step verification using an authenticator app (Google Authenticator, Microsoft Authenticator) instead of plain SMS."
              },
              {
                title: "5. Monitor Account Activity & Active Sessions",
                detail: "Check 'Where you are logged in' inside your email/social media settings and click 'Log out of all other sessions'."
              },
              {
                title: "6. Contact Your Bank or IT Administrator",
                detail: "If campus credentials or banking details were typed, alert your college IT helpdesk or bank support immediately."
              }
            ]}
          />

          {/* Section C */}
          <SafetyCard
            id="safety-section-c"
            badge="Phase 3: Financial Emergency"
            title="C. If Money Was Lost or Fraud Occurred"
            description="Time is the single most critical factor in recovering fraudulent transactions and freezing attacker accounts:"
            icon={Landmark}
            variant="red"
            steps={[
              {
                title: "1. Contact Your Bank Immediately (Golden Hour)",
                detail: "Call your bank's dedicated 24/7 fraud hotline or use the mobile app to block your debit/credit card and freeze the affected account. Reporting within the first 1–2 hours dramatically increases the chance of reversing the transaction."
              },
              {
                title: "2. Preserve All Evidence and Screenshots",
                detail: "Take clear screenshots of transaction receipts, SMS alerts, UPI Reference / UTR numbers, chat logs, sender phone numbers, and URLs. Do not delete the messages."
              },
              {
                title: "3. Call the National Cyber Crime Helpline: 1930",
                detail: "In India, dial 1930 immediately. Provide transaction details and beneficiary UPI/bank numbers so law enforcement can flag and freeze beneficiary wallets."
              },
              {
                title: "4. Lodge a Formal Complaint at cybercrime.gov.in",
                detail: "Submit an incident report on the National Cyber Crime Reporting Portal and keep the acknowledgment number for bank dispute resolution."
              }
            ]}
          />
        </div>

        {/* Official Reporting Resources Section */}
        <section
          id="official-resources-section"
          className="rounded-2xl border border-cyan-900/40 bg-[#06101E] p-6 sm:p-8 mb-12 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Official Indian Cybercrime Helplines & Portals
              </h2>
              <p className="text-xs text-slate-400">
                Authorized government platforms for reporting cyber offenses
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Helpline 1930 */}
            <div className="rounded-xl border border-slate-800 bg-[#040812] p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Immediate Financial Fraud
                </span>
                <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-900/50">
                  24x7 Toll Free
                </span>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight my-1">
                Dial 1930
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS), Ministry of Home Affairs, Government of India.
              </p>
            </div>

            {/* Portal cybercrime.gov.in */}
            <div className="rounded-xl border border-slate-800 bg-[#040812] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    National Web Portal
                  </span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-900/50">
                    Official Govt
                  </span>
                </div>
                <div className="text-lg font-bold font-mono text-white tracking-tight my-1">
                  cybercrime.gov.in
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-1 font-normal">
                  Lodge online complaints regarding financial fraud, cyber harassment, hacking, or social media impersonation.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Visit National Cybercrime Portal</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Critical Disclaimer Notice */}
          <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed font-normal">
              <strong className="text-amber-300 font-semibold">Important Advisory:</strong> This CyberAware website is an educational extension project and does NOT process, file, or transmit official criminal complaints directly to law enforcement authorities. To officially register a cyber fraud case, always use the government helpline (<strong>1930</strong>) or the official portal (<strong className="font-mono">cybercrime.gov.in</strong>).
            </div>
          </div>
        </section>

        {/* Quick Review Navigation */}
        <div className="rounded-xl border border-slate-800 bg-[#081220] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Want to see how cyber threats actually appear in the real world?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              Practice identifying red flags in our scenario simulation.
            </p>
          </div>
          <Link
            to="/detect"
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#050B14] px-4 py-2 text-xs font-semibold transition-all shrink-0"
          >
            <span>Explore Detection Scenarios</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
