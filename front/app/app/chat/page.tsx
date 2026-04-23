"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import {
  Button,
  Card,
  CardDescription,
  CardTitle,
  Textarea,
} from "@/components/ui";
import { CHAT_URL } from "@/lib/api";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm the Aegis copilot. Ask me about any policy, claim, or decision in the system.",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    const next: Msg[] = [
      ...messages,
      { role: "user", content: text },
      { role: "assistant", content: "" },
    ];
    setMessages(next);
    setStreaming(true);

    try {
      const res = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .slice(0, -1)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;
          try {
            const token = JSON.parse(payload) as string;
            setMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = {
                role: "assistant",
                content: copy[copy.length - 1].content + token,
              };
              return copy;
            });
          } catch {
            /* ignore non-JSON */
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `Error: ${err instanceof Error ? err.message : String(err)}`,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col gap-4">
      <header>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-400/80">
          Copilot
        </p>
        <h1 className="mt-1 font-display text-4xl text-gold-100">Chat</h1>
        <p className="mt-1 text-sm text-forest-300/80">
          A grounded assistant with live context from your policies, claims, and
          decisions.
        </p>
      </header>

      <Card className="flex flex-1 flex-col gap-0 p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[78%] rounded-2xl rounded-tr-sm bg-gradient-to-b from-gold-400 to-gold-500 px-4 py-2.5 text-sm text-forest-950"
                  : "max-w-[78%] rounded-2xl rounded-tl-sm border border-gold-500/15 bg-forest-900/60 px-4 py-2.5 text-sm text-gold-100"
              }
            >
              {m.role === "assistant" && (
                <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-gold-400/80">
                  <Sparkles className="h-3 w-3" /> Copilot
                </div>
              )}
              <p className="whitespace-pre-wrap">
                {m.content ||
                  (streaming && i === messages.length - 1 ? "…" : "")}
              </p>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-gold-500/10 p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about a claim, a risk score, or a recent decision…"
              className="min-h-[52px] max-h-32"
            />
            <Button
              onClick={send}
              disabled={streaming || !input.trim()}
              size="lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-forest-300/60">
            Enter to send · Shift+Enter for newline
          </p>
        </div>
      </Card>
    </div>
  );
}
