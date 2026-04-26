"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
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
  Textarea,
  Badge,
  decisionTone,
} from "@/components/ui";
import { api } from "@/lib/api";
import type { Decision, UnderwriteRequest } from "@/lib/types";

const POLICY_TYPES = ["health", "auto", "home", "life", "travel"];

export default function UnderwritePage() {
  const [form, setForm] = useState<UnderwriteRequest>({
    customer_name: "",
    policy_type: "auto",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10),
    age: 30,
    risk_profile: "medium",
    requested_premium: undefined,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Decision | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const d = await api.underwrite({
        ...form,
        start_date: new Date(form.start_date).toISOString(),
        end_date: new Date(form.end_date).toISOString(),
      });
      setResult(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-400/80">
          Decision engine
        </p>
        <h1 className="mt-1 font-display text-4xl text-gold-100">
          Underwriting
        </h1>
        <p className="mt-1 text-sm text-forest-300/80">
          Score a policy application, recommend a premium, and persist the
          decision with its full rationale.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>New application</CardTitle>
            <CardDescription>
              Every field feeds the risk model. The LLM only decides on top of
              the grounded assessment.
            </CardDescription>
          </CardHeader>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Customer name">
              <Input
                required
                value={form.customer_name}
                onChange={(e) =>
                  setForm({ ...form, customer_name: e.target.value })
                }
                placeholder="Alice Johnson"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Policy type">
                <Select
                  value={form.policy_type}
                  onValueChange={(v) => setForm({ ...form, policy_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {POLICY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Risk profile">
                <Select
                  value={form.risk_profile || "medium"}
                  onValueChange={(v) =>
                    setForm({ ...form, risk_profile: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["low", "medium", "high"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Age">
                <Input
                  type="number"
                  value={form.age ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      age: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </Field>
              <Field label="Start date">
                <Input
                  type="date"
                  required
                  value={form.start_date.slice(0, 10)}
                  onChange={(e) =>
                    setForm({ ...form, start_date: e.target.value })
                  }
                />
              </Field>
              <Field label="End date">
                <Input
                  type="date"
                  required
                  value={form.end_date.slice(0, 10)}
                  onChange={(e) =>
                    setForm({ ...form, end_date: e.target.value })
                  }
                />
              </Field>
            </div>

            <Field label="Requested premium (optional)">
              <Input
                type="number"
                step="0.01"
                placeholder="e.g. 250.00"
                value={form.requested_premium ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    requested_premium: e.target.value
                      ? Number(e.target.value)
                      : null,
                  })
                }
              />
            </Field>

            <Field label="Notes">
              <Textarea
                value={form.notes ?? ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Anything the underwriter should know…"
              />
            </Field>

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Analyzing…" : "Run AI decision"}
            </Button>
          </form>
        </Card>

        <div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
              >
                <DecisionPanel d={result} />
              </motion.div>
            ) : (
              <Card className="flex h-full min-h-[420px] items-center justify-center text-center">
                <div>
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-gold-400" />
                  <p className="font-display text-xl text-gold-200">
                    Ready when you are
                  </p>
                  <p className="mt-2 text-sm text-forest-300/80">
                    Submit the form and the decision will materialize here.
                  </p>
                </div>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function DecisionPanel({ d }: { d: Decision }) {
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-forest-300/70">
            Decision · {d.model}
          </p>
          <p className="mt-0.5 font-display text-2xl text-gold-100">
            {d.kind.replace("_", " ")}
          </p>
        </div>
        <Badge tone={decisionTone(d.decision)} className="text-sm">
          {d.decision}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MeterBar label="Risk score" value={d.risk_score} max={100} />
        <MeterBar
          label="Confidence"
          value={d.confidence * 100}
          max={100}
          format={(v) => `${Math.round(v)}%`}
        />
        {d.suggested_premium !== null && (
          <StatBox
            label="Suggested premium"
            value={`$${d.suggested_premium.toFixed(2)}`}
          />
        )}
        <StatBox
          label="Decision ID"
          value={d.id.slice(0, 8)}
          subtle={d.id.slice(8, 16)}
        />
      </div>

      <div>
        <p className="font-mono mb-2 text-xs uppercase tracking-wider text-gold-300/80">
          Reasoning
        </p>
        <ul className="space-y-1.5 font-mono text-[13px] leading-relaxed text-forest-300/90">
          {d.reasoning.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold-500">▸</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function MeterBar({
  label,
  value,
  max,
  format,
}: {
  label: string;
  value: number;
  max: number;
  format?: (v: number) => string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="rounded-xl border border-gold-500/15 bg-forest-900/40 p-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-forest-300/70">
          {label}
        </span>
        <span className="font-mono text-sm text-gold-200">
          {format ? format(value) : value.toFixed(0)}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-forest-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-gold-400 to-gold-500"
        />
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: string;
}) {
  return (
    <div className="rounded-xl border border-gold-500/15 bg-forest-900/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-forest-300/70">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg text-gold-200">{value}</p>
      {subtle && (
        <p className="font-mono text-[10px] text-forest-300/60">{subtle}</p>
      )}
    </div>
  );
}
