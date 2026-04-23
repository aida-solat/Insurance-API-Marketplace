"use client";

import { motion } from "framer-motion";
import { Badge, decisionTone } from "./ui";
import type { Decision } from "@/lib/types";

export function DecisionCard({
  d,
  index = 0,
}: {
  d: Decision;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-forest-300/70">
            {d.kind.replace("_", " ")} · {d.model}
          </p>
          <p className="mt-0.5 truncate font-display text-lg font-semibold tracking-tightest text-gold-200">
            {d.subject_type}
            {d.subject_id ? (
              <span className="font-mono text-base text-gold-300/80">
                {" · "}
                {d.subject_id.slice(0, 8)}
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
        <Badge tone={decisionTone(d.decision)}>{d.decision}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <Stat label="Risk" value={`${d.risk_score.toFixed(0)}/100`} />
        <Stat label="Confidence" value={`${Math.round(d.confidence * 100)}%`} />
        {d.fraud_score !== null && (
          <Stat label="Fraud" value={`${d.fraud_score.toFixed(0)}/100`} />
        )}
        {d.suggested_premium !== null && (
          <Stat label="Premium" value={`$${d.suggested_premium.toFixed(2)}`} />
        )}
      </div>

      {d.reasoning.length > 0 && (
        <ul className="mt-4 space-y-1.5 font-mono text-[11px] leading-relaxed text-forest-300/85">
          {d.reasoning.slice(0, 4).map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-gold-500">▸</span>
              <span>{r}</span>
            </li>
          ))}
          {d.reasoning.length > 4 && (
            <li className="text-forest-300/60">
              + {d.reasoning.length - 4} more
            </li>
          )}
        </ul>
      )}
      <p className="mt-4 font-mono text-[10px] text-forest-300/60">
        {new Date(d.created_at).toLocaleString()}
      </p>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gold-500/15 bg-forest-900/40 px-2.5 py-1.5">
      <p className="font-mono text-[9px] uppercase tracking-widest text-forest-300/60">
        {label}
      </p>
      <p className="font-mono text-sm text-gold-200">{value}</p>
    </div>
  );
}
