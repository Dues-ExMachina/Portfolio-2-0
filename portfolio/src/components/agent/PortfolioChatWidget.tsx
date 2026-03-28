"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Copy, Check, Sparkles, ChevronDown } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrbState = "idle" | "thinking" | "searching" | "streaming" | "done";

type Message =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; tools?: string[] };

// ─── Mini orb for header ─────────────────────────────────────────────────────
function MiniOrb({ state }: { state: OrbState }) {
  const isBusy = state === "thinking" || state === "searching" || state === "streaming";
  return (
    <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 35% 30%, rgba(100,180,255,0.95) 0%, rgba(30,80,220,0.9) 45%, rgba(8,20,120,0.98) 100%)",
          boxShadow: isBusy
            ? "0 0 14px 5px rgba(50,130,255,0.65)"
            : "0 0 10px 3px rgba(30,100,255,0.4)",
        }}
        animate={isBusy ? { scale: [1, 1.08, 0.95, 1] } : { scale: 1 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1.5px rgba(120,210,255,0.7)",
        }}
        animate={{ transform: ["rotateX(65deg) rotateZ(0deg)", "rotateX(65deg) rotateZ(360deg)"] }}
        transition={{ duration: isBusy ? 1.2 : 4, repeat: Infinity, ease: "linear" }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: "24%",
          height: "16%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(220,240,255,0.75) 0%, transparent 100%)",
          filter: "blur(1px)",
        }}
      />
    </div>
  );
}

// ─── Typing dots ─────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 16px" }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(100,160,255,0.7)" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Tool badge ──────────────────────────────────────────────────────────────
function ToolBadge({ tools }: { tools: string[] }) {
  const colors: Record<string, string> = {
    Pinecone: "#a855f7",
    GitHub: "#6e7681",
    "Web Fetch": "#22d3ee",
    Profile: "#f59e0b",
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", marginBottom: 6 }}>
      {tools.map((t) => (
        <span
          key={t}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10.5,
            fontWeight: 600,
            color: colors[t] ?? "#888",
            background: `${colors[t] ?? "#888"}15`,
            border: `1px solid ${colors[t] ?? "#888"}30`,
            borderRadius: 999,
            padding: "2px 8px",
            letterSpacing: "0.02em",
          }}
        >
          <div
            style={{ width: 5, height: 5, borderRadius: "50%", background: colors[t] ?? "#888" }}
          />
          {t}
        </span>
      ))}
    </div>
  );
}

// ─── renderText helper ────────────────────────────────────────────────────────
function renderText(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i} style={{ color: "#c8e0ff" }}>{part}</strong> : <span key={i}>{part}</span>
  );
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_CHARS = 280;

  const SUGGESTIONS = [
    "What's Anubhab's most complex project?",
    "What backend tech does he use?",
    "Has he worked with RAG before?",
  ];

  const isBusy = orbState === "thinking" || orbState === "searching" || isStreaming;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, isStreaming]);

  useEffect(() => {
    if (!isBusy) inputRef.current?.focus();
  }, [isBusy]);

  async function handleSend(overrideInput?: string) {
    const q = (overrideInput ?? input).trim();
    if (!q || isBusy) return;

    const newMessages: Message[] = [...messages, { role: "user", text: q }];
    setMessages(newMessages);
    setInput("");
    setOrbState("thinking");
    setStreamingText("");
    setIsStreaming(false);

    const history = messages.map((m) => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AGENT_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, session_id: "portfolio-session", history }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let tools: string[] = [];
      let buffer = "";

      setOrbState("streaming");
      setIsStreaming(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.replace("data:", "").trim();

          if (data === "[DONE]") {
            setIsStreaming(false);
            setOrbState("done");
            setMessages((prev) => [...prev, { role: "assistant", text: fullText, tools }]);
            setStreamingText("");
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "tools") tools = parsed.tools || [];
            if (parsed.type === "text") {
              fullText += parsed.token;
              setStreamingText(fullText);
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error(err);
      setOrbState("idle");
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't connect to the backend. Please try again." },
      ]);
    }
  }

  function handleCopy(text: string, idx: number) {
    navigator.clipboard.writeText(text.replace(/\*\*/g, ""));
    setCopied(idx);
    setTimeout(() => setCopied(null), 1800);
  }

  const charCount = input.length;
  const charOverLimit = charCount > MAX_CHARS;

  return (
    <div
      style={{
        width: 360,
        height: 560,
        background: "rgba(6, 9, 20, 0.97)",
        borderRadius: 24,
        border: "1px solid rgba(80,140,255,0.18)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.05), 0 24px 80px rgba(0,0,0,0.75), 0 0 60px rgba(30,80,255,0.12)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Ambient gradient */}
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: "140%",
          height: 260,
          background:
            "radial-gradient(ellipse at center bottom, rgba(20,60,200,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MiniOrb state={orbState} />
          <div>
            <div style={{ color: "#fff", fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>
              Portfolio Agent
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 1 }}>
              {isBusy
                ? orbState === "thinking"
                  ? "Thinking…"
                  : orbState === "searching"
                  ? "Searching…"
                  : "Writing…"
                : "Online · Ask me anything"}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: 30,
            height: 30,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.5)",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)")
          }
          aria-label="Close chat"
        >
          <ChevronDown size={15} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 14px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          position: "relative",
          zIndex: 1,
          scrollbarWidth: "none",
        }}
      >
        {/* Empty state */}
        {messages.length === 0 && !isBusy && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              paddingTop: 12,
            }}
          >
            {/* Hero orb */}
            <div style={{ position: "relative", width: 72, height: 72 }}>
              <motion.div
                style={{
                  position: "absolute",
                  inset: -16,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(30,100,255,0.18) 0%, transparent 70%)",
                  filter: "blur(12px)",
                }}
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(ellipse at 35% 30%, rgba(100,185,255,0.95) 0%, rgba(25,75,220,0.9) 45%, rgba(8,18,110,0.98) 100%)",
                  boxShadow:
                    "0 0 40px 10px rgba(30,100,255,0.4), 0 0 80px 30px rgba(20,60,220,0.18)",
                  border: "1px solid rgba(100,180,255,0.25)",
                }}
                animate={{ rotate: [0, 4, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                style={{
                  position: "absolute",
                  inset: "8%",
                  borderRadius: "50%",
                  boxShadow: "inset 0 0 0 1.5px rgba(120,210,255,0.6)",
                }}
                animate={{ transform: ["rotateX(65deg) rotateZ(0deg)", "rotateX(65deg) rotateZ(360deg)"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "13%",
                  left: "18%",
                  width: "26%",
                  height: "16%",
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse, rgba(210,235,255,0.7) 0%, transparent 100%)",
                  filter: "blur(2px)",
                }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
                Hey, I&apos;m Anubhab&apos;s AI
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, lineHeight: 1.5 }}>
                Ask me about his projects, skills,
                <br />
                or anything else on the portfolio.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: "9px 14px",
                    color: "rgba(255,255,255,0.65)",
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "background 0.2s, border-color 0.2s, color 0.2s",
                    lineHeight: 1.4,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "rgba(60,120,255,0.12)";
                    el.style.borderColor = "rgba(80,140,255,0.35)";
                    el.style.color = "rgba(255,255,255,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = "rgba(255,255,255,0.05)";
                    el.style.borderColor = "rgba(255,255,255,0.1)";
                    el.style.color = "rgba(255,255,255,0.65)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message history */}
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {msg.role === "user" ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: "rgba(50,100,255,0.18)",
                    border: "1px solid rgba(80,140,255,0.22)",
                    borderRadius: "18px 18px 4px 18px",
                    padding: "9px 14px",
                    color: "rgba(255,255,255,0.92)",
                    fontSize: 13.5,
                    maxWidth: "80%",
                    lineHeight: 1.55,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {msg.tools && msg.tools.length > 0 && <ToolBadge tools={msg.tools} />}
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "4px 18px 18px 18px",
                    padding: "10px 14px",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 13.5,
                    maxWidth: "88%",
                    lineHeight: 1.65,
                    letterSpacing: "0.01em",
                  }}
                >
                  {renderText(msg.text)}
                </div>
                {/* Copy button */}
                <button
                  onClick={() => handleCopy(msg.text, idx)}
                  style={{
                    alignSelf: "flex-start",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.28)",
                    fontSize: 11,
                    fontFamily: "inherit",
                    padding: "2px 4px",
                    borderRadius: 6,
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      copied === idx ? "#22d3ee" : "rgba(255,255,255,0.28)")
                  }
                >
                  {copied === idx ? (
                    <Check size={11} style={{ color: "#22d3ee" }} />
                  ) : (
                    <Copy size={11} />
                  )}
                  <span style={{ color: copied === idx ? "#22d3ee" : "inherit" }}>
                    {copied === idx ? "Copied!" : "Copy"}
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {/* Thinking / streaming indicator */}
        <AnimatePresence>
          {isBusy && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              {streamingText ? (
                <div>
                  <div
                    style={{
                      alignSelf: "flex-start",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: "4px 18px 18px 18px",
                      padding: "10px 14px",
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 13.5,
                      maxWidth: "88%",
                      lineHeight: 1.65,
                      display: "inline-block",
                    }}
                  >
                    {renderText(streamingText)}
                    <motion.span
                      style={{
                        display: "inline-block",
                        width: 2,
                        height: "0.9em",
                        background: "rgba(80,160,255,0.85)",
                        borderRadius: 1,
                        marginLeft: 2,
                        verticalAlign: "text-bottom",
                      }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.65, repeat: Infinity }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "4px 18px 18px 18px",
                    display: "inline-flex",
                  }}
                >
                  <TypingDots />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div
        style={{
          padding: "10px 12px 14px",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.06)",
            border: charOverLimit
              ? "1px solid rgba(255,80,80,0.5)"
              : "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: "10px 10px 10px 16px",
            transition: "border-color 0.2s",
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => !isBusy && setInput(e.target.value.slice(0, MAX_CHARS + 10))}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={isBusy ? "Waiting for response…" : "Ask anything…"}
            disabled={isBusy}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: isBusy ? "rgba(255,255,255,0.3)" : "#fff",
              fontSize: 13.5,
              fontFamily: "inherit",
              cursor: isBusy ? "not-allowed" : "text",
            }}
          />

          {!isBusy && charCount > MAX_CHARS * 0.75 && (
            <span
              style={{
                fontSize: 10.5,
                color: charOverLimit ? "#f87171" : "rgba(255,255,255,0.3)",
                flexShrink: 0,
              }}
            >
              {charOverLimit ? `-${charCount - MAX_CHARS}` : MAX_CHARS - charCount}
            </span>
          )}

          <motion.button
            onClick={() => handleSend()}
            disabled={isBusy || charOverLimit || charCount === 0}
            whileHover={!isBusy && charCount > 0 && !charOverLimit ? { scale: 1.08 } : {}}
            whileTap={!isBusy && charCount > 0 && !charOverLimit ? { scale: 0.92 } : {}}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background:
                isBusy || charCount === 0 || charOverLimit
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(50,110,255,0.75)",
              border: "none",
              cursor: isBusy || charCount === 0 || charOverLimit ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
              boxShadow:
                !isBusy && charCount > 0 && !charOverLimit
                  ? "0 0 14px 2px rgba(50,110,255,0.4)"
                  : "none",
            }}
            aria-label="Send message"
          >
            {isBusy ? (
              <motion.div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,0.15)",
                  borderTopColor: "rgba(255,255,255,0.5)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Send
                size={14}
                style={{
                  color: charCount === 0 || charOverLimit ? "rgba(255,255,255,0.2)" : "#fff",
                  marginLeft: 1,
                  transition: "color 0.2s",
                }}
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ─── Floating Button ──────────────────────────────────────────────────────────
export default function PortfolioChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{
              position: "fixed",
              bottom: 82,
              right: 24,
              zIndex: 9999,
            }}
          >
            <ChatPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          height: 46,
          borderRadius: 999,
          background: open
            ? "rgba(10,14,28,0.95)"
            : "linear-gradient(135deg, #1a56ff 0%, #0a2acc 100%)",
          boxShadow: open
            ? "0 0 0 1.5px rgba(80,140,255,0.4), 0 8px 24px rgba(0,0,0,0.5)"
            : "0 0 24px 6px rgba(30,80,255,0.35), 0 8px 24px rgba(0,0,0,0.45)",
          border: open
            ? "1px solid rgba(80,140,255,0.3)"
            : "1px solid rgba(100,160,255,0.3)",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "0 20px",
          fontFamily: "'Inter', system-ui, sans-serif",
          overflow: "hidden",
        }}
        aria-label="Open Portfolio Agent"
      >
        {/* Shimmer on closed state */}
        {!open && (
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "-60%",
              width: "35%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
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
              <X size={14} style={{ color: "rgba(255,255,255,0.55)" }} />
              <span
                style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                Close
              </span>
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
              <Sparkles size={14} style={{ color: "rgba(255,255,255,0.9)" }} />
              <span
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                Ask my Agent
              </span>
              <motion.div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(150,220,255,0.9)",
                  flexShrink: 0,
                }}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.75, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}