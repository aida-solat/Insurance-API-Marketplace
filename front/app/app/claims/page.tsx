"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FilePlus, Gavel, Loader2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  decisionTone,
} from "@/components/ui";
import { api } from "@/lib/api";
import type { Claim, Decision, Policy } from "@/lib/types";
import useSWRLike from "@/lib/use-swr-like";

export default function ClaimsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-400/80">
          Claims
        </p>
        <h1 className="mt-1 font-display text-4xl text-gold-100">
          File & triage claims
        </h1>
        <p className="mt-1 text-sm text-forest-300/80">
          File a claim against an existing policy, then trigger the AI triage
          agent to score it for fraud and recommend an action.
        </p>
      </header>

      <Tabs defaultValue="triage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="triage">
            <Gavel className="h-4 w-4" /> Triage
          </TabsTrigger>
          <TabsTrigger value="file">
            <FilePlus className="h-4 w-4" /> File new
          </TabsTrigger>
        </TabsList>

        <TabsContent value="triage">
          <TriageTab />
        </TabsContent>
        <TabsContent value="file">
          <FileTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TriageTab() {
  const claims = useSWRLike(["claims"], () => api.listClaims());
  const [busy, setBusy] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, Decision>>({});
  const [error, setError] = useState<string | null>(null);

  async function triage(c: Claim) {
    setBusy(c.id);
    setError(null);
    try {
      const d = await api.triageClaim(c.id);
      setResults((prev) => ({ ...prev, [c.id]: d }));
      claims.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  if (claims.loading)
    return <p className="text-sm text-forest-300/70">Loading claims…</p>;
  if (claims.error)
    return (
      <Card>
        <CardTitle>Backend unreachable</CardTitle>
        <CardDescription>{String(claims.error.message)}</CardDescription>
      </Card>
    );
  if (!claims.data?.length)
    return (
      <Card>
        <CardTitle>No claims yet</CardTitle>
        <CardDescription>File one in the other tab to begin.</CardDescription>
      </Card>
    );

  return (
    <div className="space-y-3">
      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-900/20 p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      {claims.data.map((c) => {
        const res = results[c.id];
        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-forest-300/70">
                  Claim · {c.id.slice(0, 8)}
                </p>
                <p className="mt-0.5 font-display text-lg text-gold-200">
                  ${c.claim_amount.toFixed(2)} · {c.incident_type || "no type"}
                </p>
                <p className="text-xs text-forest-300/70">
                  Filed {new Date(c.filed_date).toLocaleDateString()} ·{" "}
                  {c.evidence_count} evidence
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  tone={
                    c.status === "Approved"
                      ? "green"
                      : c.status === "Rejected"
                        ? "red"
                        : c.status === "Flagged"
                          ? "amber"
                          : "neutral"
                  }
                >
                  {c.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => triage(c)}
                  disabled={busy === c.id}
                >
                  {busy === c.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Gavel className="h-4 w-4" />
                  )}
                  {res ? "Re-run" : "Run AI triage"}
                </Button>
              </div>
            </div>
            {res && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 rounded-xl border border-gold-500/15 bg-forest-900/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-wider text-gold-300/80">
                    AI decision · {res.model}
                  </p>
                  <Badge tone={decisionTone(res.decision)}>
                    {res.decision}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <MiniStat
                    label="Fraud score"
                    value={`${res.fraud_score?.toFixed(0) ?? "—"}/100`}
                  />
                  <MiniStat
                    label="Confidence"
                    value={`${Math.round(res.confidence * 100)}%`}
                  />
                  <MiniStat
                    label="Risk"
                    value={`${res.risk_score.toFixed(0)}`}
                  />
                </div>
                <ul className="mt-3 space-y-1 font-mono text-[11px] leading-relaxed text-forest-300/90">
                  {res.reasoning.slice(0, 5).map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-gold-500">▸</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gold-500/15 bg-forest-950/40 px-2 py-1.5">
      <p className="font-mono text-[9px] uppercase tracking-widest text-forest-300/60">
        {label}
      </p>
      <p className="font-mono text-gold-200">{value}</p>
    </div>
  );
}

function FileTab() {
  const policies = useSWRLike(["policies"], () => api.listPolicies());
  const [form, setForm] = useState({
    policy_id: "",
    claim_amount: 1000,
    filed_date: new Date().toISOString().slice(0, 10),
    description: "",
    incident_type: "collision",
    evidence_count: 1,
  });
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Claim | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.policy_id) {
      setError("Select a policy first.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const c = await api.createClaim({
        ...form,
        filed_date: new Date(form.filed_date).toISOString(),
      });
      setCreated(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>New claim</CardTitle>
          <CardDescription>
            Attach the claim to an existing policy. The triage tab picks it up
            automatically.
          </CardDescription>
        </CardHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Policy</Label>
            {policies.loading ? (
              <p className="text-sm text-forest-300/70">Loading policies…</p>
            ) : !policies.data?.length ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-900/20 p-3 text-sm text-amber-200">
                No policies exist yet. Go to{" "}
                <a
                  href="/app/underwrite"
                  className="underline hover:text-amber-100"
                >
                  Underwriting
                </a>{" "}
                and submit one first.
              </p>
            ) : (
              <Select
                value={form.policy_id || undefined}
                onValueChange={(v) => setForm({ ...form, policy_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a policy" />
                </SelectTrigger>
                <SelectContent>
                  {policies.data.map((p: Policy) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.customer_name} · {p.policy_type} · ${p.premium}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Claim amount</Label>
              <Input
                type="number"
                step="0.01"
                value={form.claim_amount}
                onChange={(e) =>
                  setForm({ ...form, claim_amount: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Filed date</Label>
              <Input
                type="date"
                value={form.filed_date}
                onChange={(e) =>
                  setForm({ ...form, filed_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Incident type</Label>
              <Input
                value={form.incident_type}
                onChange={(e) =>
                  setForm({ ...form, incident_type: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Evidence count</Label>
              <Input
                type="number"
                value={form.evidence_count}
                onChange={(e) =>
                  setForm({ ...form, evidence_count: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What happened?"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/40 bg-red-900/20 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            <FilePlus className="h-4 w-4" />
            {loading ? "Filing…" : "File claim"}
          </Button>
        </form>
      </Card>

      <Card className="flex min-h-[300px] flex-col justify-center">
        {created ? (
          <>
            <Badge tone="green" className="mb-3 self-start">
              Claim filed
            </Badge>
            <p className="font-display text-xl text-gold-200">
              ${created.claim_amount.toFixed(2)}
            </p>
            <p className="mt-1 font-mono text-xs text-forest-300/70">
              ID: {created.id}
            </p>
            <p className="mt-4 text-sm text-forest-300/90">
              Switch to the Triage tab to run the AI adjuster.
            </p>
          </>
        ) : (
          <div className="text-center text-forest-300/70">
            <FilePlus className="mx-auto mb-3 h-8 w-8 text-gold-400" />
            <p>Filed claims will appear here.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
