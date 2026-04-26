"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  FileCheck,
  GitBranch as GithubIcon,
  Layers,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/logo";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Grounded Decisions",
    body: "Every AI call is anchored in deterministic risk and fraud rules, so the LLM works from structured facts rather than free-form prompts.",
  },
  {
    icon: ScrollText,
    title: "Auditable by Design",
    body: "Every decision is persisted with inputs, reasoning, model, and confidence, so the full trail is reviewable later.",
  },
  {
    icon: Layers,
    title: "Provider-Agnostic",
    body: "Swap OpenAI, Anthropic, or a local Ollama model with one env var. Ships with a zero-config heuristic fallback.",
  },
  {
    icon: FileCheck,
    title: "Real Underwriting",
    body: "Risk score, premium recommendation, and explainable rationale on every policy application.",
  },
  {
    icon: Sparkles,
    title: "Claim Fraud Triage",
    body: "Fraud score, leverage analysis, and out-of-window detection feed into a FLAG / REJECT / APPROVE outcome with a documented rationale.",
  },
  {
    icon: Brain,
    title: "Streaming Copilot",
    body: "An SSE chat endpoint gives operators a natural-language copilot grounded in the live decision log.",
  },
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

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-forest-300/80 md:flex">
          <a href="#features" className="hover:text-gold-200">
            Features
          </a>
          <a href="#how" className="hover:text-gold-200">
            How it works
          </a>
          <a href="#sample" className="hover:text-gold-200">
            Sample decision
          </a>
          <a
            href="https://github.com/aida-solat/insurance-api-marketplace"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gold-200"
          >
            GitHub
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <a
              href="https://github.com/sponsors/aida-solat"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon className="h-4 w-4" /> Sponsor
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/app">
              Launch app <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-forest-900/60 px-3 py-1 text-xs text-gold-200"
        >
          <Zap className="h-3.5 w-3.5" />
          Open-source · Auditable · Offline-ready
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          AI underwriting & claims
          <br />
          <span className="text-gradient-gold">you can actually audit.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-base text-forest-300/90 md:text-lg"
        >
          Aegis is a hybrid rules-plus-LLM decision platform for insurance
          operators. Every decision is grounded in deterministic risk models,
          logged with full rationale, and works offline out-of-the-box.
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
            <a
              href="https://github.com/aida-solat/insurance-api-marketplace"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon className="h-4 w-4" /> Star on GitHub
            </a>
          </Button>
        </motion.div>

        <motion.div
          id="sample"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative mx-auto mt-20 max-w-4xl"
        >
          <div className="glass rounded-3xl p-6 text-left md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-500/15 text-gold-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-forest-300/80">
                    POST /decide/underwrite
                  </p>
                  <p className="font-display text-lg text-gold-200">
                    Auto policy · age 19 · high risk
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-red-500/40 bg-red-900/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-300">
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

            <div className="mt-6 rounded-xl border border-gold-500/15 bg-forest-900/50 p-4">
              <p className="font-mono mb-2 text-xs uppercase tracking-wider text-gold-300/80">
                Reasoning
              </p>
              <ul className="space-y-1.5 font-mono text-[13px] leading-relaxed text-forest-300/90">
                {DECISION_SAMPLE.reasoning.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gold-500">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      <section
        id="features"
        className="relative z-10 mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-400/80">
            Platform
          </p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Everything you need to ship{" "}
            <span className="text-gradient-gold">auditable AI</span>.
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
              className="group glass rounded-2xl p-6 transition hover:border-gold-500/40"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300 transition group-hover:bg-gold-500/25">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl text-gold-200">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-forest-300/85">
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold-400/80">
                Architecture
              </p>
              <h2 className="mt-3 font-display text-4xl">
                Rules first.{" "}
                <span className="text-gradient-gold">LLM second.</span>
              </h2>
              <p className="mt-4 text-forest-300/90">
                A deterministic risk engine computes the numbers and produces
                structured factors. That block is then passed to the LLM as
                grounded context. The model&apos;s only job is to pick a
                decision and summarize the rationale, which is then stored in an
                append-only audit log.
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild>
                  <Link href="/app">
                    Try the dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href="https://github.com/aida-solat/insurance-api-marketplace"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read the code
                  </a>
                </Button>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-2xl border border-gold-500/20 bg-forest-950/70 p-5 text-xs leading-relaxed text-forest-300/90">
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

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-32 text-center">
        <h2 className="font-display text-4xl md:text-5xl">
          AI decisions with a{" "}
          <span className="text-gradient-gold">paper trail</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-forest-300/90">
          Open the dashboard, file a claim, and watch the underwriter agent
          reason about it in real time. No credit card, no API key required.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/app">
              Launch app <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/sponsors/aida-solat"
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon className="h-4 w-4" /> Sponsor on GitHub
            </a>
          </Button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-gold-500/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-forest-300/60 md:flex-row">
          <div className="flex items-center gap-3">
            <Logo showText={false} className="scale-75" />
            <span>
              © {new Date().getFullYear()} Aegis · MIT License · Built with{" "}
              <a
                href="https://deciwa.com"
                target="_blank"
                rel="noreferrer"
                className="text-gold-300/80 hover:text-gold-200"
              >
                Deciwa
              </a>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="/app" className="hover:text-gold-200">
              Dashboard
            </a>
            <a
              href="https://github.com/aida-solat/insurance-api-marketplace"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gold-200"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gold-500/15 bg-forest-900/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-forest-300/70">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg text-gold-200">{value}</p>
    </div>
  );
}
