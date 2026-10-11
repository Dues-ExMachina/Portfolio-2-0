"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Copy, Check, Sparkles, RotateCcw, ChevronDown } from "lucide-react";
import type { BackendStatus } from "@/components/KeepAlive";

// ─── Theme (matches globals.css tokens) ──────────────────────────────────────

const C = {
  navy: "#050B1F",
  navySecondary: "#080F28",
  card: "#0C1535",
  border: "#1A2540",
  coral: "#FF3D5A",
  orange: "#FF6B35",
  cyan: "#00C8FF",
  violet: "#8B5CF6",
  text: "#F0F4FF",
  muted: "#8A9AC4",
  label: "#4A5D90",
};
const MONO = "var(--font-space-mono), ui-monospace, monospace";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrbState = "idle" | "thinking" | "streaming" | "error";

type Message =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; tools?: string[]; error?: boolean };

const SUGGESTIONS = [
  "What does Anubhab work on at AIVOA.ai?",
  "Show me his strongest AI projects",
  "What's his tech stack for agentic AI?",
  "How can I contact him?",
];

const MAX_CHARS = 280;

function newSessionId() {
  return `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Status orb ──────────────────────────────────────────────────────────────

function StatusOrb({ state, size = 30 }: { state: OrbState; size?: number }) {
  const busy = state === "thinking" || state === "streaming";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${C.coral}, ${C.violet}, ${C.cyan}, ${C.coral})`,
          padding: 1.5,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: busy ? 1.4 : 6, repeat: Infinity, ease: "linear" }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.navySecondary }} />
      </motion.div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.coral,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: size * 0.34,
        }}
      >
        AD
      </div>
      <span
        style={{
          position: "absolute",
          right: -1,
          bottom: -1,
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: "50%",
          border: `2px solid ${C.navySecondary}`,
          background: state === "error" ? "#f87171" : busy ? "#facc15" : "#34d399",
        }}
      />
    </div>
  );
}

// ─── Typing dots ─────────────────────────────────────────────────────────────

function TypingDots({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px" }}>
      <div style={{ display: "flex", gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{ width: 6, height: 6, borderRadius: "50%", background: C.coral }}
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </div>
      <span style={{ color: C.muted, fontSize: 11, fontFamily: MONO, letterSpacing: "0.06em" }}>{label}</span>
    </div>
  );
}

// ─── Tool badges ─────────────────────────────────────────────────────────────

const TOOL_COLORS: Record<string, string> = {
  Pinecone: C.violet,
  GitHub: "#9aa4b2",
  Web: C.cyan,
  Profile: C.orange,
};

function ToolBadges({ tools }: { tools: string[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
      <span style={{ color: C.label, fontSize: 9.5, fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Sources
      </span>
      {tools.map((t) => {
        const color = TOOL_COLORS[t] ?? C.muted;
        return (
          <span
            key={t}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              fontWeight: 600,
              color,
              background: `${color}14`,
              border: `1px solid ${color}33`,
              borderRadius: 999,
              padding: "1px 8px",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
            {t}
          </span>
        );
      })}
    </div>
  );
}

// ─── Lightweight markdown (bold, code, links, bullet / numbered lists) ──────

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+)/g;
  return text.split(pattern).filter(Boolean).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key} style={{ color: C.text, fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} style={{ fontFamily: MONO, fontSize: "0.88em", background: "rgba(255,255,255,0.07)", padding: "1px 5px", borderRadius: 4 }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    const md = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    const href = md ? md[2] : /^https?:\/\//.test(part) ? part : null;
    if (href) {
      return (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" style={{ color: C.coral, textDecoration: "underline", textUnderlineOffset: 2, wordBreak: "break-word" }}>
          {md ? md[1] : part}
        </a>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function RichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushList = () => {
    if (!list) return;
    const { ordered, items } = list;
    const Tag = ordered ? "ol" : "ul";
    blocks.push(
      <Tag key={`l-${blocks.length}`} style={{ margin: "4px 0", paddingLeft: 18, display: "flex", flexDirection: "column", gap: 3, listStyle: ordered ? "decimal" : "disc" }}>
        {items.map((it, i) => (
          <li key={i} style={{ paddingLeft: 2 }}>{renderInline(it, `li-${blocks.length}-${i}`)}</li>
        ))}
      </Tag>
    );
    list = null;
  };

  text.split("\n").forEach((raw, idx) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const ordered = !!numbered;
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      return;
    }
    flushList();
    if (!line.trim()) return;
    const heading = line.match(/^#{1,4}\s+(.*)$/);
    blocks.push(
      <p key={`p-${idx}`} style={{ margin: "2px 0", fontWeight: heading ? 600 : undefined, color: heading ? C.text : undefined }}>
        {renderInline(heading ? heading[1] : line, `p-${idx}`)}
      </p>
    );
  });
  flushList();
  return <>{blocks}</>;
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [streamingText, setStreamingText] = useState("");
  const [streamingTools, setStreamingTools] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState(newSessionId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [backend, setBackend] = useState<BackendStatus | undefined>(() =>
    typeof window !== "undefined" ? window.__backendStatus : undefined
  );

  useEffect(() => {
    const onStatus = (e: Event) => setBackend((e as CustomEvent<BackendStatus>).detail);
    window.addEventListener("backend-status", onStatus);
    return () => window.removeEventListener("backend-status", onStatus);
  }, []);

  const isBusy = orbState === "thinking" || orbState === "streaming";
  const agentUrl = process.env.NEXT_PUBLIC_AGENT_URL;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, streamingText, orbState]);

  useEffect(() => {
    if (!isBusy) inputRef.current?.focus();
  }, [isBusy]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Auto-grow the textarea up to ~4 lines
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [input]);

  const handleSend = useCallback(
    async (override?: string, baseMessages?: Message[]) => {
      const q = (override ?? input).trim();
      if (!q || isBusy || q.length > MAX_CHARS) return;

      const prior = baseMessages ?? messages;
      setMessages([...prior, { role: "user", text: q }]);
      setInput("");
      setOrbState("thinking");
      setStreamingText("");
      setStreamingTools([]);

      const history = prior
        .filter((m) => !(m.role === "assistant" && m.error))
        .map((m) => ({ role: m.role, content: m.text }));

      const fail = (text: string) => {
        setOrbState("error");
        setStreamingText("");
        setMessages((prev) => [...prev, { role: "assistant", text, error: true }]);
      };

      if (!agentUrl) {
        fail("The agent backend isn't configured yet (NEXT_PUBLIC_AGENT_URL is missing). Meanwhile, you can reach Anubhab via the Contact page or LinkedIn.");
        return;
      }

      const controller = new AbortController();
      abortRef.current = controller;

      let fullText = "";
      let tools: string[] = [];
      let finished = false;

      try {
        const res = await fetch(`${agentUrl}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q, session_id: sessionId, history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) throw new Error(`Backend responded with ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (!finished) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();

            if (data === "[DONE]") {
              finished = true;
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "tools") {
                tools = parsed.tools || [];
                setStreamingTools(tools);
              } else if (parsed.type === "text") {
                fullText += parsed.token;
                setOrbState("streaming");
                setStreamingText(fullText);
              } else if (parsed.type === "error") {
                throw new Error(parsed.message || "Agent error");
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue;
              throw e;
            }
          }
        }

        if (!fullText.trim()) throw new Error("Empty response");

        setMessages((prev) => [...prev, { role: "assistant", text: fullText, tools }]);
        setStreamingText("");
        setOrbState("idle");
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        if (fullText.trim()) {
          // Keep whatever was streamed before the connection dropped
          setMessages((prev) => [...prev, { role: "assistant", text: `${fullText}\n\n(response interrupted)`, tools }]);
          setStreamingText("");
          setOrbState("idle");
        } else {
          fail("I couldn't reach the agent right now — the server may be waking up (free hosting sleeps when idle). Give it ~30 seconds and hit retry.");
        }
      } finally {
        abortRef.current = null;
      }
    },
    [input, isBusy, messages, agentUrl, sessionId]
  );

  function handleRetry() {
    // Drop the failed answer and the question it belonged to, then re-ask
    const lastUserIdx = messages.map((m) => m.role).lastIndexOf("user");
    if (lastUserIdx < 0) return;
    const q = messages[lastUserIdx].text;
    const base = messages.slice(0, lastUserIdx);
    handleSend(q, base);
  }

  function handleReset() {
    abortRef.current?.abort();
    setMessages([]);
    setStreamingText("");
    setStreamingTools([]);
    setOrbState("idle");
    setSessionId(newSessionId());
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text.replace(/\*\*/g, ""));
    setCopied(idx);
    setTimeout(() => setCopied(null), 1600);
  }

  const charCount = input.length;
  const charOverLimit = charCount > MAX_CHARS;
  const canSend = !isBusy && charCount > 0 && !charOverLimit;
  const statusText =
    orbState === "thinking" ? "Searching his profile…" : orbState === "streaming" ? "Typing…" : orbState === "error" ? "Connection issue" : backend === "waking" ? "Waking up the server (free tier, ~30s)…" : backend === "offline" ? "Server is offline right now" : "Online · answers from his resume & GitHub";

  return (
    <div
      role="dialog"
      aria-label="Chat with Anubhab's portfolio agent"
      style={{
        width: "min(400px, calc(100vw - 24px))",
        height: "min(620px, calc(100dvh - 160px))",
        background: `linear-gradient(180deg, ${C.navySecondary} 0%, ${C.navy} 100%)`,
        borderRadius: 18,
        border: `1px solid ${C.border}`,
        boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,61,90,0.06), 0 0 60px rgba(255,61,90,0.08)`,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Coral top accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.coral}, ${C.violet}, ${C.cyan})` }} />

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 14px 12px 16px",
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
          <StatusOrb state={orbState === "idle" && backend === "waking" ? "thinking" : orbState === "idle" && backend === "offline" ? "error" : orbState} />
          <div style={{ minWidth: 0 }}>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>Anubhab&apos;s AI Agent</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {statusText}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {messages.length > 0 && (
            <IconButton onClick={handleReset} label="New chat">
              <RotateCcw size={14} />
            </IconButton>
          )}
          <IconButton onClick={onClose} label="Minimise chat">
            <ChevronDown size={16} />
          </IconButton>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 14px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          scrollbarWidth: "thin",
          scrollbarColor: `${C.border} transparent`,
        }}
      >
        {/* Empty state */}
        {messages.length === 0 && !isBusy && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 6 }}>
            <div>
              <div style={{ color: C.label, fontSize: 10, fontFamily: MONO, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>
                · Portfolio Agent
              </div>
              <div style={{ color: C.text, fontSize: 20, fontWeight: 700, lineHeight: 1.25, marginBottom: 8 }}>
                Hi! I know everything about{" "}
                <span style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.orange})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Anubhab&apos;s work.
                </span>
              </div>
              <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.55 }}>
                Ask about his experience at AIVOA.ai, his projects, or his skills. Answers come from his resume, project index and live GitHub.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ color: C.label, fontSize: 10, fontFamily: MONO, letterSpacing: "0.2em", textTransform: "uppercase" }}>Try asking</div>
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i }}
                  onClick={() => handleSend(s)}
                  className="group"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    padding: "10px 13px",
                    color: "#C3CDE8",
                    fontSize: 12.5,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s, background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${C.coral}66`;
                    e.currentTarget.style.background = "rgba(255,61,90,0.06)";
                    e.currentTarget.style.color = C.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background = C.card;
                    e.currentTarget.style.color = "#C3CDE8";
                  }}
                >
                  {s}
                  <span style={{ color: C.coral, flexShrink: 0 }}>→</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message history */}
        {messages.map((msg, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            {msg.role === "user" ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: `linear-gradient(135deg, ${C.coral}, #E8344F)`,
                    borderRadius: "16px 16px 4px 16px",
                    padding: "9px 14px",
                    color: "#fff",
                    fontSize: 13.5,
                    maxWidth: "82%",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    boxShadow: "0 4px 18px rgba(255,61,90,0.2)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                {msg.tools && msg.tools.length > 0 && <ToolBadges tools={msg.tools} />}
                <div
                  style={{
                    background: msg.error ? "rgba(248,113,113,0.08)" : C.card,
                    border: `1px solid ${msg.error ? "rgba(248,113,113,0.3)" : C.border}`,
                    borderRadius: "4px 16px 16px 16px",
                    padding: "10px 14px",
                    color: msg.error ? "#fecaca" : "#C9D3EE",
                    fontSize: 13.5,
                    maxWidth: "92%",
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  <RichText text={msg.text} />
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {msg.error ? (
                    idx === messages.length - 1 && (
                      <SmallAction onClick={handleRetry} disabled={isBusy}>
                        <RotateCcw size={11} /> Retry
                      </SmallAction>
                    )
                  ) : (
                    <SmallAction onClick={() => handleCopy(msg.text, idx)} active={copied === idx}>
                      {copied === idx ? <Check size={11} /> : <Copy size={11} />}
                      {copied === idx ? "Copied" : "Copy"}
                    </SmallAction>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {/* In-flight answer */}
        <AnimatePresence>
          {isBusy && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}
            >
              {streamingTools.length > 0 && <ToolBadges tools={streamingTools} />}
              <div
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: "4px 16px 16px 16px",
                  color: "#C9D3EE",
                  fontSize: 13.5,
                  maxWidth: "92%",
                  lineHeight: 1.6,
                  padding: streamingText ? "10px 14px" : 0,
                  wordBreak: "break-word",
                }}
              >
                {streamingText ? (
                  <>
                    <RichText text={streamingText} />
                    <motion.span
                      style={{ display: "inline-block", width: 7, height: 14, background: C.coral, marginTop: 2, borderRadius: 1 }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  </>
                ) : (
                  <TypingDots label={streamingTools.length ? "Reading sources" : "Thinking"} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input ── */}
      <div style={{ padding: "10px 12px 12px", flexShrink: 0, borderTop: `1px solid ${C.border}` }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            background: C.card,
            border: `1px solid ${charOverLimit ? "rgba(248,113,113,0.6)" : C.border}`,
            borderRadius: 12,
            padding: "8px 8px 8px 14px",
            transition: "border-color 0.2s",
          }}
          onFocusCapture={(e) => !charOverLimit && (e.currentTarget.style.borderColor = `${C.coral}80`)}
          onBlurCapture={(e) => !charOverLimit && (e.currentTarget.style.borderColor = C.border)}
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS + 20))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
              if (e.key === "Escape") onClose();
            }}
            placeholder={isBusy ? "Waiting for the answer…" : "Ask about Anubhab…"}
            disabled={isBusy}
            aria-label="Message"
            style={{
              flex: 1,
              resize: "none",
              background: "transparent",
              border: "none",
              outline: "none",
              color: C.text,
              fontSize: 13.5,
              lineHeight: 1.5,
              fontFamily: "inherit",
              padding: "5px 0",
              maxHeight: 96,
              opacity: isBusy ? 0.5 : 1,
            }}
          />
          {charCount > MAX_CHARS * 0.8 && (
            <span style={{ fontSize: 10.5, fontFamily: MONO, color: charOverLimit ? "#f87171" : C.label, alignSelf: "center", flexShrink: 0 }}>
              {MAX_CHARS - charCount}
            </span>
          )}
          <motion.button
            onClick={() => handleSend()}
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.06 } : {}}
            whileTap={canSend ? { scale: 0.92 } : {}}
            aria-label="Send message"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: canSend ? `linear-gradient(135deg, ${C.coral}, ${C.orange})` : "rgba(255,255,255,0.05)",
              border: "none",
              cursor: canSend ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: canSend ? "0 0 16px rgba(255,61,90,0.35)" : "none",
              transition: "background 0.2s, box-shadow 0.2s",
            }}
          >
            {isBusy ? (
              <motion.div
                style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)", borderTopColor: C.coral }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Send size={14} style={{ color: canSend ? "#fff" : C.label, marginLeft: 1 }} />
            )}
          </motion.button>
        </div>
        <div style={{ textAlign: "center", color: C.label, fontSize: 10, marginTop: 7, fontFamily: MONO, letterSpacing: "0.04em" }}>
          LangGraph · Pinecone · Groq — AI can make mistakes
        </div>
      </div>
    </div>
  );
}

// ─── Small UI helpers ─────────────────────────────────────────────────────────

function IconButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        width: 30,
        height: 30,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: C.muted,
        transition: "color 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = C.text;
        e.currentTarget.style.borderColor = `${C.coral}66`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = C.muted;
        e.currentTarget.style.borderColor = C.border;
      }}
    >
      {children}
    </button>
  );
}

function SmallAction({ onClick, children, active, disabled }: { onClick: () => void; children: React.ReactNode; active?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: "none",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        color: active ? C.cyan : C.label,
        fontSize: 11,
        fontFamily: "inherit",
        padding: "2px 4px",
        borderRadius: 6,
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => !active && (e.currentTarget.style.color = C.text)}
      onMouseLeave={(e) => !active && (e.currentTarget.style.color = C.label)}
    >
      {children}
    </button>
  );
}

// ─── Floating launcher ────────────────────────────────────────────────────────

export default function PortfolioChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{ position: "fixed", bottom: 80, right: 12, zIndex: 9999, transformOrigin: "bottom right" }}
            className="sm:right-6!"
          >
            <ChatPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        className="right-3! sm:right-6!"
        style={{
          position: "fixed",
          bottom: 20,
          right: 24,
          height: 46,
          borderRadius: 999,
          background: open ? C.navySecondary : `linear-gradient(135deg, ${C.coral} 0%, ${C.orange} 100%)`,
          boxShadow: open
            ? `0 0 0 1px ${C.border}, 0 8px 24px rgba(0,0,0,0.5)`
            : "0 0 26px 4px rgba(255,61,90,0.35), 0 8px 24px rgba(0,0,0,0.45)",
          border: open ? `1px solid ${C.border}` : "1px solid rgba(255,255,255,0.18)",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "0 18px",
          fontFamily: "'Inter', system-ui, sans-serif",
          overflow: "hidden",
        }}
        aria-label={open ? "Close portfolio agent" : "Open portfolio agent"}
        aria-expanded={open}
      >
        {!open && (
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "-60%",
              width: "35%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              pointerEvents: "none",
            }}
            animate={{ left: ["-60%", "160%"] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          />
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.18 }}
              style={{ display: "flex", alignItems: "center", gap: 7 }}
            >
              <X size={14} style={{ color: C.muted }} />
              <span style={{ color: C.muted, fontSize: 12.5, fontWeight: 500 }}>Close</span>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <Sparkles size={15} style={{ color: "#fff" }} />
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
                Ask my Agent
              </span>
              <span style={{ position: "relative", display: "flex", width: 7, height: 7 }}>
                <motion.span
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff" }}
                  animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                />
                <span style={{ position: "relative", width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
