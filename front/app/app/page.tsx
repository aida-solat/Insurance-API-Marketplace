"use client";

import useSWRLike from "@/lib/use-swr-like";
import { api } from "@/lib/api";
import { Card, CardDescription, CardHeader, CardTitle, Badge, decisionTone } from "@/components/ui";
import { DecisionCard } from "@/components/decision-card";
import { ArrowUpRight, FileCheck, ScrollText, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function OverviewPage() {
  const policies = useSWRLike(["policies"], () => api.listPolicies());
  const claims = useSWRLike(["claims"], () => api.listClaims());
  const decisions = useSWRLike(["decisions"], () =>
    api.listDecisions({ limit: 6 })
  );
  const info = useSWRLike(["root"], () => api.root());

  const approveRate = (() => {
    const d = decisions.data || [];
    if (!d.length) return 0;
    return Math.round((d.filter((x) => x.decision === "APPROVE").length / d.length) * 100);
  })();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gold-400/80">
            Overview
          </p>
          <h1 className="mt-1 font-display text-4xl text-gold-100">Dashboard</h1>
          <p className="mt-1 text-sm text-forest-300/80">
            Real-time snapshot of policies, claims, and AI decisions.
          </p>
        </div>
        {info.data && (
          <Badge tone="gold">LLM: {info.data.llm_provider}</Badge>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={ShieldCheck}
          label="Policies"
          value={policies.data?.length ?? "—"}
          href="/app/underwrite"
        />
        <StatCard
          icon={FileCheck}
          label="Claims"
          value={claims.data?.length ?? "—"}
          href="/app/claims"
        />
        <StatCard
          icon={ScrollText}
          label="Decisions"
          value={decisions.data?.length ?? "—"}
          href="/app/decisions"
        />
        <StatCard
          icon={ShieldCheck}
          label="Approve rate"
          value={decisions.data?.length ? `${approveRate}%` : "—"}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl text-gold-200">Recent decisions</h2>
          <Link
            href="/app/decisions"
            className="text-xs text-gold-300 hover:text-gold-200"
          >
            View all →
          </Link>
        </div>
        {decisions.loading && <SkeletonGrid />}
        {decisions.error && (
          <Card>
            <CardTitle>Backend unreachable</CardTitle>
            <CardDescription>
              Start the API with <code>uvicorn app.main:app</code> on port 8000.
            </CardDescription>
          </Card>
        )}
        {decisions.data && decisions.data.length === 0 && (
          <Card>
            <CardTitle>No decisions yet</CardTitle>
            <CardDescription>
              Head to{" "}
              <Link href="/app/underwrite" className="text-gold-300 hover:text-gold-200">
                Underwriting
              </Link>{" "}
              and submit your first policy.
            </CardDescription>
          </Card>
        )}
        {decisions.data && decisions.data.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {decisions.data.map((d, i) => (
              <DecisionCard key={d.id} d={d} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string | number;
  href?: string;
}) {
  const inner = (
    <div className="glass group flex items-center justify-between rounded-2xl p-5 transition hover:border-gold-500/40">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-forest-300/70">
          {label}
        </p>
        <p className="mt-1 font-display text-3xl text-gold-200">{value}</p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-300">
        <Icon className="h-5 w-5" />
      </div>
      {href && (
        <ArrowUpRight className="ml-2 h-4 w-4 text-forest-300/40 transition group-hover:text-gold-300" />
      )}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="glass h-48 animate-pulse rounded-2xl opacity-50"
        />
      ))}
    </div>
  );
}
