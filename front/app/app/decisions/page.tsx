"use client";

import { useState } from "react";
import useSWRLike from "@/lib/use-swr-like";
import { api } from "@/lib/api";
import { DecisionCard } from "@/components/decision-card";
import {
  Card,
  CardDescription,
  CardTitle,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui";

export default function DecisionsPage() {
  const [filter, setFilter] = useState<"all" | "underwrite" | "claim_triage">(
    "all",
  );
  const decisions = useSWRLike(["decisions", filter], () =>
    api.listDecisions({
      kind: filter === "all" ? undefined : filter,
      limit: 100,
    }),
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-400/80">
          Audit log
        </p>
        <h1 className="mt-1 font-display text-4xl text-gold-100">
          All decisions
        </h1>
        <p className="mt-1 text-sm text-forest-300/80">
          Every AI decision (input, reasoning, model, and score), immutable and
          queryable.
        </p>
      </header>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="underwrite">Underwriting</TabsTrigger>
          <TabsTrigger value="claim_triage">Claims</TabsTrigger>
        </TabsList>
      </Tabs>

      {decisions.loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass h-48 animate-pulse rounded-2xl opacity-50"
            />
          ))}
        </div>
      )}
      {decisions.error && (
        <Card>
          <CardTitle>Backend unreachable</CardTitle>
          <CardDescription>{String(decisions.error.message)}</CardDescription>
        </Card>
      )}
      {decisions.data && decisions.data.length === 0 && (
        <Card>
          <CardTitle>No decisions yet</CardTitle>
          <CardDescription>
            Run an underwriting or claim triage to populate this log.
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
    </div>
  );
}
