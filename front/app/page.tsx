"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileCheck,
  Layers,
  Lock,
  ScrollText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/logo";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Deterministic Risk Engine",
    body: "Actuarial-style rules compute risk and fraud factors before any AI call. The model decides on top of facts, not free-form text.",
  },
  {
    icon: ScrollText,
    title: "Audit-Grade Decision Log",
    body: "Every decision is persisted with inputs, factors, model, version, confidence, and full rationale. Built for state DOI and internal audit reviews.",
  },
  {
    icon: Lock,
    title: "Self-Hostable & Offline",
    body: "Run on your own infrastructure, in your VPC, or fully air-gapped. No customer PII has to leave your perimeter.",
  },
  {
    icon: FileCheck,
    title: "Underwriting Workbench",
    body: "Risk score, suggested premium, and an explainable rationale on every new policy submission — auto, home, life, or commercial.",
  },
  {
    icon: Sparkles,
    title: "Claims Triage",
    body: "Fraud scoring, out-of-window detection, severity flags, and a clear APPROVE / FLAG / REJECT recommendation for every FNOL.",
  },
  {
    icon: Layers,
    title: "Model-Agnostic",
    body: "Plug in OpenAI, Anthropic, Azure OpenAI, or a private on-prem model. A heuristic fallback keeps the platform deterministic when you need it to be.",
  },
];

const TRUST_SIGNALS = [
  "SOC 2 Type II ready",
  "NAIC Model #672 aligned",
  "HIPAA-aware data handling",
  "Immutable audit log",
];

const DECISION_SAMPLE = {
  decision: "REJECT",
  confidence: 0.72,
  risk_score: 77,
  suggested_premium: 124.1,
  reasoning: [
    "Base rate for 'auto': 0.060",
    "Policy type 'auto' classified as elevated risk (+10)",
    "Young applicant (age 19) increases risk (+12)",
    "Declared risk profile: HIGH (+20)",
  ],
  model: "gpt-4o-mini",
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-forest [background-size:40px_40px] opacity-40" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-radial-gold" />

      <header className="relative z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#platform" className="hover:text-[#0B2545]">
              Platform
            </a>
            <a href="#how" className="hover:text-[#0B2545]">
              How it works
            </a>
            <a href="#compliance" className="hover:text-[#0B2545]">
              Compliance
            </a>
            <a
              href="https://github.com/aida-solat/Insurance-API-Marketplace"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#0B2545]"
            >
              GitHub
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <a href="mailto:hello@deciwa.com?subject=Aegis%20demo%20request">
                Request a demo
              </a>
            </Button>
            <Button asChild size="sm">
              <Link href="/app">
                Open dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Built for North American carriers, MGAs, and TPAs
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-[#0B2545] md:text-6xl"
        >
          Audit-grade AI for
          <br />
          <span className="text-gradient-gold">underwriting and claims.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg"
        >
          Aegis pairs a deterministic insurance risk engine with an explainable
          AI layer. Every decision is grounded in your rules, logged with full
          rationale, and ready for state DOI examiners, internal audit, and your
          reinsurance partners.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/app">
              Open the dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="mailto:hello@deciwa.com?subject=Aegis%20enterprise%20inquiry">
              Talk to the team
            </a>
          </Button>
        </motion.div>

        <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          {TRUST_SIGNALS.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              {s}
            </li>
          ))}
        </ul>

        <motion.div
          id="sample"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative mx-auto mt-20 max-w-4xl"
        >
          <div className="glass rounded-2xl p-6 text-left md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0B2545]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    POST /decide/underwrite
                  </p>
                  <p className="font-display text-lg font-semibold text-[#0B2545]">
                    Personal auto · age 19 · high-risk profile
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-700">
                {DECISION_SAMPLE.decision}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <Stat
                label="Risk score"
                value={`${DECISION_SAMPLE.risk_score}/100`}
              />
              <Stat
                label="Confidence"
                value={`${Math.round(DECISION_SAMPLE.confidence * 100)}%`}
              />
              <Stat
                label="Suggested premium"
                value={`$${DECISION_SAMPLE.suggested_premium.toFixed(2)}`}
              />
              <Stat label="Model" value={DECISION_SAMPLE.model} />
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-mono mb-2 text-xs uppercase tracking-wider text-slate-500">
                Rationale
              </p>
              <ul className="space-y-1.5 font-mono text-[13px] leading-relaxed text-slate-700">
                {DECISION_SAMPLE.reasoning.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#0B2545]">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="platform"
        className="relative z-10 mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1E4D8C]">
            Platform
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B2545] md:text-4xl">
            Everything underwriting and claims teams need
            <br />
            to deploy AI responsibly.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass group rounded-2xl p-6 transition hover:border-slate-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0B2545]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-[#0B2545]">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="glass rounded-2xl p-8 md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1E4D8C]">
                Architecture
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B2545] md:text-4xl">
                Rules first.{" "}
                <span className="text-gradient-gold">AI second.</span>
              </h2>
              <p className="mt-4 text-slate-600">
                A deterministic risk engine computes scores and produces
                structured factors using your carrier&apos;s rules. That block
                is then passed to the language model as grounded context. The
                model&apos;s only job is to issue a decision and summarize the
                rationale — which is written to an append-only decision log you
                control.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/app">
                    Try the dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://github.com/aida-solat/Insurance-API-Marketplace"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read the code
                  </a>
                </Button>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs leading-relaxed text-slate-700">
              <code>{`rule_engine
  └─ risk_score, factors[], suggested_premium
        │
        ▼
llm(system + structured_context)
  └─ { decision, confidence, reasoning[] }
        │
        ▼
Decision table  ◀── audit log, immutable
        │
        ▼
GET /decisions  ─── compliance & dashboards`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section
        id="compliance"
        className="relative z-10 mx-auto max-w-7xl px-6 pb-24"
      >
        <div className="glass rounded-2xl p-8 md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1E4D8C]">
                Compliance &amp; Security
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0B2545] md:text-4xl">
                Designed for the
                <br />
                regulated enterprise.
              </h2>
              <p className="mt-4 text-slate-600">
                Aegis is built around the controls examiners and internal audit
                teams expect from a North American carrier — not a consumer
                chatbot.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                [
                  "Immutable audit trail",
                  "Append-only decision log with input snapshot, model id, and version on every record.",
                ],
                [
                  "Deterministic fallback",
                  "Heuristic engine keeps the platform answering even when the LLM is unavailable.",
                ],
                [
                  "Self-host or VPC",
                  "Deploy on your own cloud or on-prem; no customer PII is required to leave your perimeter.",
                ],
                [
                  "Explainable rationale",
                  "Plain-English reasoning attached to every APPROVE / FLAG / REJECT decision.",
                ],
                [
                  "Role-ready APIs",
                  "Stateless REST endpoints fit cleanly behind your existing IAM, SSO, and rate limiting.",
                ],
                [
                  "Open source core",
                  "MIT-licensed engine you can audit line by line — no vendor black box.",
                ],
              ].map(([title, body]) => (
                <li
                  key={title}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-[#0B2545]">
                    {title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-32 text-center">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-[#0B2545] md:text-4xl">
          Decisions your underwriters,
          <br />
          <span className="text-gradient-gold">auditors, and counsel</span> can
          defend.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          Open the dashboard, submit a sample policy, and watch the underwriting
          agent reason about it in real time. No credit card and no API key
          required to evaluate.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/app">
              Launch dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="mailto:hello@deciwa.com?subject=Aegis%20enterprise%20inquiry">
              Contact sales
            </a>
          </Button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-slate-500 md:flex-row">
          <div className="flex items-center gap-3">
            <Logo showText={false} className="scale-75" />
            <span>
              © {new Date().getFullYear()} Aegis · MIT License · Built by{" "}
              <a
                href="https://deciwa.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#0B2545] hover:underline"
              >
                Deciwa
              </a>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/app" className="hover:text-[#0B2545]">
              Dashboard
            </a>
            <a
              href="https://github.com/aida-solat/Insurance-API-Marketplace"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#0B2545]"
            >
              GitHub
            </a>
            <a
              href="mailto:hello@deciwa.com?subject=Aegis%20enterprise%20inquiry"
              className="hover:text-[#0B2545]"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-base font-semibold text-[#0B2545]">
        {value}
      </p>
    </div>
  );
}
