export type DecisionOutcome = "APPROVE" | "REJECT" | "REVIEW" | "FLAG";

export interface Policy {
  id: string;
  customer_name: string;
  policy_type: string;
  premium: number;
  start_date: string;
  end_date: string;
  age?: number | null;
  risk_profile?: "low" | "medium" | "high" | null;
  created_at: string;
}

export interface Claim {
  id: string;
  policy_id: string;
  claim_amount: number;
  status: string;
  filed_date: string;
  description?: string | null;
  incident_type?: string | null;
  evidence_count: number;
  created_at: string;
}

export interface Decision {
  id: string;
  subject_type: "policy" | "claim";
  subject_id: string | null;
  kind: "underwrite" | "claim_triage";
  decision: DecisionOutcome;
  confidence: number;
  risk_score: number;
  fraud_score: number | null;
  suggested_premium: number | null;
  reasoning: string[];
  model: string;
  created_at: string;
}

export interface UnderwriteRequest {
  customer_name: string;
  policy_type: string;
  requested_premium?: number | null;
  start_date: string;
  end_date: string;
  age?: number | null;
  risk_profile?: "low" | "medium" | "high" | null;
  notes?: string | null;
}

export interface RootInfo {
  name: string;
  version: string;
  llm_provider: string;
  docs: string;
}
