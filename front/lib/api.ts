import type {
  Claim,
  Decision,
  Policy,
  RootInfo,
  UnderwriteRequest,
} from "./types";

const isServer = typeof window === "undefined";
const API_BASE = isServer
  ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005"
  : "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  root: () => request<RootInfo>("/"),
  health: () => request<{ status: string; llm_provider: string }>("/health"),

  listPolicies: () => request<Policy[]>("/policy/"),
  getPolicy: (id: string) => request<Policy>(`/policy/${id}`),
  createPolicy: (body: Omit<Policy, "id" | "created_at">) =>
    request<Policy>("/policy/", { method: "POST", body: JSON.stringify(body) }),

  listClaims: () => request<Claim[]>("/claim/"),
  getClaim: (id: string) => request<Claim>(`/claim/${id}`),
  createClaim: (body: Omit<Claim, "id" | "status" | "created_at">) =>
    request<Claim>("/claim/", { method: "POST", body: JSON.stringify(body) }),

  underwrite: (body: UnderwriteRequest) =>
    request<Decision>("/decide/underwrite", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  triageClaim: (claimId: string) =>
    request<Decision>(`/decide/claim/${claimId}`, { method: "POST" }),

  listDecisions: (params?: {
    subject_type?: string;
    kind?: string;
    limit?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.subject_type) q.set("subject_type", params.subject_type);
    if (params?.kind) q.set("kind", params.kind);
    if (params?.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    return request<Decision[]>(`/decisions${qs ? `?${qs}` : ""}`);
  },
  getDecision: (id: string) => request<Decision>(`/decisions/${id}`),
};

export const CHAT_URL = `${API_BASE}/chat`;
