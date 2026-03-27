

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, ThumbsUp, Copy, Check } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type OrbState = "idle" | "thinking" | "searching" | "streaming" | "done";

type Message =
  | { role: "user"; text: string }
  | { role: "assistant"; text: string; tools?: string[] };

// ─── Glowing Orb ─────────────────────────────────────────────────────────────

function GlowingOrb({ state, size = 100 }: { state: OrbState; size?: number }) {
  const isThinking = state === "thinking";
  const isSearching = state === "searching";

  return (
    <div style={{ width: size, height: size, position: "relative", flexShrink: 0 }}>
      {/* Ambient glow */}
      <motion.div
        style={{
          position: "absolute",
          inset: -size * 0.3,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,100,255,0.2) 0%, transparent 70%)",
          filter: "blur(16px)",
        }}
        animate={{ scale: isThinking ? [1, 1.2, 0.9, 1.15, 1] : [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: isThinking ? 1.4 : 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb body */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 35% 30%, rgba(80,160,255,0.95) 0%, rgba(20,60,200,0.88) 45%, rgba(8,18,110,0.98) 100%)",
          boxShadow: isThinking
            ? "0 0 50px 18px rgba(30,120,255,0.7), 0 0 100px 35px rgba(30,80,255,0.3)"
            : "0 0 60px 22px rgba(30,120,255,0.55), 0 0 120px 50px rgba(20,70,255,0.22)",
          border: "1px solid rgba(100,180,255,0.3)",
        }}
        animate={{
          borderRadius: isThinking
            ? [
              "40% 60% 55% 45%/45% 40% 60% 55%",
              "55% 45% 40% 60%/60% 55% 45% 40%",
              "40% 60% 55% 45%/45% 40% 60% 55%",
            ]
            : isSearching
              ? [
                "48% 52% 46% 54%/50% 48% 52% 50%",
                "52% 48% 54% 46%/50% 52% 48% 50%",
                "48% 52% 46% 54%/50% 48% 52% 50%",
              ]
              : ["50%"],
          rotate: isThinking ? [0, 12, -8, 18, 0] : [0, 4, -2, 0],
          scale: isThinking ? [1, 0.94, 1.06, 0.96, 1] : [1, 1.02, 1],
        }}
        transition={{ duration: isThinking ? 1.6 : isSearching ? 2.2 : 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ring 1 */}
      <motion.div
        style={{
          position: "absolute",
          inset: "5%",
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1.5px rgba(120,200,255,0.55)",
        }}
        animate={{ transform: ["rotateX(70deg) rotateZ(0deg)", "rotateX(70deg) rotateZ(360deg)"] }}
        transition={{ duration: isThinking ? 1.8 : 5.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Ring 2 */}
      <motion.div
        style={{
          position: "absolute",
          inset: "12%",
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1.5px rgba(140,220,255,0.45)",
        }}
        animate={{
          transform: [
            "rotateX(55deg) rotateY(30deg) rotateZ(0deg)",
            "rotateX(55deg) rotateY(30deg) rotateZ(360deg)",
          ],
        }}
        transition={{ duration: isThinking ? 1.3 : 4.2, repeat: Infinity, ease: "linear" }}
      />

      {/* Ring 3 – cyan */}
      <motion.div
        style={{
          position: "absolute",
          inset: "22%",
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1.5px rgba(0,230,255,0.65)",
        }}
        animate={{
          transform: [
            "rotateX(20deg) rotateY(60deg) rotateZ(0deg)",
            "rotateX(20deg) rotateY(60deg) rotateZ(360deg)",
          ],
        }}
        transition={{ duration: isThinking ? 1 : 3.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Specular highlight */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "18%",
          width: "28%",
          height: "18%",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(200,230,255,0.7) 0%, transparent 100%)",
          filter: "blur(3px)",
        }}
      />

      {/* Searching tendrils */}
      {isSearching &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              bottom: -14 - i * 8,
              left: `${28 + i * 22}%`,
              width: 2,
              height: 8 + i * 5,
              background: "linear-gradient(to bottom, rgba(80,160,255,0.8), transparent)",
              borderRadius: 4,
            }}
            animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.8, 1.3, 0.8] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
    </div>
  );
}

// ─── Frosted Glass Pill ───────────────────────────────────────────────────────

function FrostPill({
  children,
  style,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.14)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 999,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Tool Row ────────────────────────────────────────────────────────────────

function ToolRow({
  color,
  icon,
  label,
  subtitle,
  result,
  done,
  active,
}: {
  color: string;
  icon: string;
  label: string;
  subtitle: string;
  result: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <motion.div
      animate={
        active
          ? {
            boxShadow: [
              `0 0 0px 0px ${color}00`,
              `0 0 12px 2px ${color}55`,
              `0 0 6px 1px ${color}33`,
            ],
          }
          : { boxShadow: "0 0 0px 0px transparent" }
      }
      transition={{ duration: 1.4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: active ? `${color}12` : "rgba(255,255,255,0.04)",
        border: active
          ? `1px solid ${color}55`
          : done
            ? `1px solid ${color}30`
            : "1px solid rgba(255,255,255,0.08)",
        borderLeft: `3px solid ${color}`,
        borderRadius: 16,
        padding: "10px 14px",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: `${color}22`,
          border: `1.5px solid ${color}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          flexShrink: 0,
          boxShadow: active ? `0 0 10px 2px ${color}44` : "none",
          transition: "box-shadow 0.3s",
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: active ? "#fff" : done ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.6)",
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.2,
            transition: "color 0.3s",
          }}
        >
          {label}
          {active && (
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              style={{
                display: "inline-block",
                marginLeft: 6,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                verticalAlign: "middle",
              }}
            />
          )}
        </div>
        <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 11, marginTop: 2 }}>
          {subtitle}
        </div>
      </div>

      {done ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color,
            fontSize: 11,
            fontWeight: 600,
            background: `${color}18`,
            border: `1px solid ${color}33`,
            borderRadius: 999,
            padding: "3px 8px",
          }}
        >
          <Check size={10} strokeWidth={2.5} />
          <span>{result}</span>
        </div>
      ) : (
        <motion.div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: `2px solid ${color}55`,
            borderTopColor: color,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.div>
  );
}

// ─── Chat Panel Content ───────────────────────────────────────────────────────

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<OrbState>("idle");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [showTools, setShowTools] = useState(false);
  const [toolsDone, setToolsDone] = useState([false, false, false]);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_CHARS = 280;

  const SUGGESTIONS = [
    "What's Anubhab's most complex project?",
    "What backend tech does he use?",
    "Has he worked with RAG before?",
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, showTools]);

  async function handleSend(overrideInput?: string) {
    const q = (overrideInput ?? input).trim();
    if (!q || isBusy) return;

    const newMessages = [...messages, { role: "user" as const, text: q }];
    setMessages(newMessages);
    setInput("");

    setOrbState("thinking");
    setShowTools(false);
    setStreamingText("");
    setIsStreaming(true);

    const history = messages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AGENT_URL}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: q,
            session_id: "portfolio-session",
            history,
          }),
        }
      );

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      let tools: string[] = [];
      let buffer = "";

      setOrbState("streaming");

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
            setMessages((prev) => [
              ...prev,
              { role: "assistant", text: fullText, tools },
            ]);
            setStreamingText("");
            return;
          }

          try {
            const parsed = JSON.parse(data);

            if (parsed.type === "tools") {
              setShowTools(true);
              setToolsDone([true, true, true]);
              tools = parsed.tools || [];
            }

            if (parsed.type === "text") {
              fullText += parsed.token;
              setStreamingText(fullText);
            }
          } catch (err) {
            console.error("Parse error:", err);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setOrbState("idle");
      setIsStreaming(false);
    }
  }

  function handleSuggestion(s: string) {
    if (isBusy) return;
    setInput(s); // Update UI so it's visible in input
    handleSend(s); // Pass string directly to bypass async state update
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text.replace(/\*\*/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const isBusy = orbState === "thinking" || orbState === "searching" || isStreaming;
  const charCount = input.length;
  const charNearLimit = charCount > MAX_CHARS * 0.8;
  const charOverLimit = charCount > MAX_CHARS;

  const activeToolIndex = !toolsDone[0] ? 0 : !toolsDone[1] ? 1 : !toolsDone[2] ? 2 : -1;

  function renderText(text: string) {
    return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
    );
  }

  return (
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0px 1px rgba(255,255,255,0.08), 0 0 18px 2px rgba(30,100,255,0.25), 0 32px 80px rgba(0,0,0,0.7)",
          "0 0 0px 1px rgba(100,160,255,0.3),  0 0 32px 8px rgba(30,100,255,0.55), 0 32px 80px rgba(0,0,0,0.7)",
          "0 0 0px 1px rgba(0,220,255,0.25),   0 0 22px 4px rgba(0,180,255,0.35),  0 32px 80px rgba(0,0,0,0.7)",
          "0 0 0px 1px rgba(255,255,255,0.08), 0 0 18px 2px rgba(30,100,255,0.25), 0 32px 80px rgba(0,0,0,0.7)",
        ],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: 340,
        height: 520,
        background: "#050810",
        borderRadius: 28,
        border: "1px solid rgba(80,160,255,0.2)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        fontFamily: "'Inter', sans-serif",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 420,
          height: 280,
          background:
            "radial-gradient(ellipse at center bottom, rgba(20,80,220,0.5) 0%, rgba(10,30,120,0.15) 55%, transparent 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "13px 18px 11px",
          zIndex: 1,
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: orbState === "idle" || orbState === "done" ? "#22d3ee" : "#a855f7",
            }}
          >
            <motion.div
              style={{ width: 8, height: 8, borderRadius: "50%", background: "inherit" }}
              animate={{ opacity: isBusy ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 1.1, repeat: isBusy ? Infinity : 0 }}
            />
          </div>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Portfolio Agent</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "50%",
            width: 30,
            height: 30,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.length === 0 && !isBusy && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              paddingTop: 8,
              paddingBottom: 4,
            }}
          >
            <GlowingOrb state="idle" size={76} />
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12.5, marginBottom: 4 }}>
                Portfolio Agent
              </div>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>
                How can I help
                <br />
                you today?
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%", marginTop: 4 }}>
              {SUGGESTIONS.map((s) => (
                <FrostPill
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  style={{
                    padding: "8px 14px",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 11.5,
                    textAlign: "center",
                  }}
                >
                  {s}
                </FrostPill>
              ))}
            </div>
          </div>
        )}

        {orbState === "thinking" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "12px 0",
            }}
          >
            <GlowingOrb state="thinking" size={64} />
          </div>
        )}

        {showTools && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 12,
              }}
            >
              <motion.div
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#a855f7" }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
              <span
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                Agent is working
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <ToolRow
                color="#a855f7"
                icon="🗂️"
                label="Pinecone"
                subtitle="Searching knowledge base..."
                result="5 chunks"
                done={toolsDone[0]}
                active={activeToolIndex === 0}
              />
              <ToolRow
                color="#6e7681"
                icon="⬡"
                label="GitHub"
                subtitle="Fetching latest repos..."
                result="3 repos"
                done={toolsDone[1]}
                active={activeToolIndex === 1}
              />
              <ToolRow
                color="#22d3ee"
                icon="🌐"
                label="Web Fetch"
                subtitle="Reading ycloude.com..."
                result="Content extracted"
                done={toolsDone[2]}
                active={activeToolIndex === 2}
              />
            </div>
          </motion.div>
        )}

        {isStreaming && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <GlowingOrb state="streaming" size={44} />
            </div>
            <FrostPill
              style={{
                padding: "5px 12px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                alignSelf: "flex-start",
              }}
            >
              {["#a855f7", "#6e7681", "#22d3ee"].map((c) => (
                <div
                  key={c}
                  style={{ width: 6, height: 6, borderRadius: "50%", background: c }}
                />
              ))}
              <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 11 }}>
                Pinecone · GitHub · Web
              </span>
            </FrostPill>
            <div
              style={{
                alignSelf: "flex-start",
                background: "rgba(30,35,55,0.7)",
                border: "1px solid rgba(100,160,255,0.15)",
                borderRadius: "5px 20px 20px 20px",
                padding: "10px 16px",
                color: "#fff",
                fontSize: 13.5,
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                maxWidth: "88%",
              }}
            >
              {renderText(streamingText)}
              <motion.span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "1em",
                  background: "rgba(80,160,255,0.9)",
                  borderRadius: 1,
                  marginLeft: 2,
                  verticalAlign: "text-bottom",
                }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.role === "user" ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    background: "#1c1e2a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "20px 20px 5px 20px",
                    padding: "10px 16px",
                    color: "#fff",
                    fontSize: 13.5,
                    maxWidth: "82%",
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <GlowingOrb state="done" size={44} />
                </div>
                {msg.tools && (
                  <FrostPill
                    style={{
                      padding: "5px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      alignSelf: "flex-start",
                    }}
                  >
                    {["#a855f7", "#6e7681", "#22d3ee"].map((c) => (
                      <div
                        key={c}
                        style={{ width: 6, height: 6, borderRadius: "50%", background: c }}
                      />
                    ))}
                    <span style={{ color: "rgba(255,255,255,0.42)", fontSize: 11 }}>
                      {msg.tools.join(" · ")}
                    </span>
                  </FrostPill>
                )}
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "rgba(30,35,55,0.7)",
                    border: "1px solid rgba(100,160,255,0.15)",
                    borderRadius: "5px 20px 20px 20px",
                    padding: "10px 16px",
                    color: "#fff",
                    fontSize: 13.5,
                    lineHeight: 1.7,
                    letterSpacing: "0.01em",
                    maxWidth: "88%",
                  }}
                >
                  {renderText(msg.text)}
                </div>
                <div style={{ display: "flex", gap: 7 }}>
                  <FrostPill style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                    <ThumbsUp size={12} style={{ color: "rgba(255,255,255,0.6)" }} />
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Helpful</span>
                  </FrostPill>
                  <FrostPill
                    onClick={() => handleCopy(msg.text)}
                    style={{ padding: "6px 12px", display: "flex", alignItems: "center", gap: 5 }}
                  >
                    {copied ? (
                      <Check size={12} style={{ color: "#22d3ee" }} />
                    ) : (
                      <Copy size={12} style={{ color: "rgba(255,255,255,0.6)" }} />
                    )}
                    <span style={{ color: copied ? "#22d3ee" : "rgba(255,255,255,0.6)", fontSize: 12 }}>
                      {copied ? "Copied!" : "Copy"}
                    </span>
                  </FrostPill>
                </div>
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: "8px 14px 0px", zIndex: 1, flexShrink: 0 }}>
        <AnimatePresence>
          {isBusy && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <motion.div
                style={{ width: 5, height: 5, borderRadius: "50%", background: "#a855f7" }}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 11.5, fontWeight: 500 }}>
                {orbState === "thinking"
                  ? "Thinking…"
                  : orbState === "searching"
                    ? "Searching sources…"
                    : "Generating answer…"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 14px",
            background: isBusy ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
            border: isBusy
              ? "1px solid rgba(255,255,255,0.07)"
              : charOverLimit
                ? "1px solid rgba(255,80,80,0.5)"
                : "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: 999,
            transition: "background 0.3s, border-color 0.3s, opacity 0.3s",
            opacity: isBusy ? 0.55 : 1,
            cursor: isBusy ? "not-allowed" : "text",
            filter: isBusy ? "grayscale(0.3)" : "none",
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => !isBusy && setInput(e.target.value.slice(0, MAX_CHARS + 10))}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              isBusy
                ? orbState === "streaming"
                  ? "Generating…"
                  : orbState === "searching"
                    ? "Fetching sources…"
                    : "Thinking…"
                : "Ask anything…"
            }
            disabled={isBusy}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: isBusy ? "rgba(255,255,255,0.35)" : "#fff",
              fontSize: 14,
              fontFamily: "inherit",
              cursor: isBusy ? "not-allowed" : "text",
            }}
          />

          {!isBusy && charCount > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: charOverLimit ? "#f87171" : charNearLimit ? "#fbbf24" : "rgba(255,255,255,0.3)",
                transition: "color 0.2s",
                flexShrink: 0,
                minWidth: 30,
                textAlign: "right",
              }}
            >
              {charOverLimit ? `-${charCount - MAX_CHARS}` : MAX_CHARS - charCount}
            </span>
          )}

          <motion.button
            onClick={() => handleSend()}
            disabled={isBusy || charOverLimit || charCount === 0}
            whileHover={!isBusy && charCount > 0 && !charOverLimit ? { scale: 1.1 } : {}}
            whileTap={!isBusy && charCount > 0 && !charOverLimit ? { scale: 0.93 } : {}}
            style={{
              background:
                isBusy || charCount === 0 || charOverLimit
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(80,140,255,0.28)",
              border:
                isBusy || charCount === 0 || charOverLimit
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(80,140,255,0.45)",
              borderRadius: "50%",
              width: 34,
              height: 34,
              cursor: isBusy || charCount === 0 || charOverLimit ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.25s, border-color 0.25s",
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
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <Send
                size={14}
                style={{
                  color: charCount === 0 || charOverLimit ? "rgba(255,255,255,0.25)" : "#7db5ff",
                  transition: "color 0.2s",
                  marginLeft: 1,
                }}
              />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
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
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{
              position: "fixed",
              bottom: 78,
              right: 24,
              zIndex: 9999,
              filter: "drop-shadow(0 0 40px rgba(30,100,255,0.22))",
            }}
          >
            <ChatPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: "auto",
          height: 44,
          borderRadius: 999,
          background: open ? "#0d1224" : "#e8362a",
          boxShadow: open
            ? "0 0 0 1.5px rgba(232,54,42,0.6), 0 8px 32px rgba(0,0,0,0.5)"
            : "0 0 24px 6px rgba(232,54,42,0.35), 0 8px 24px rgba(0,0,0,0.4)",
          border: open ? "1.5px solid rgba(232,54,42,0.5)" : "1.5px solid rgba(255,100,88,0.4)",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "0 18px",
          fontFamily: "'Inter', sans-serif",
          transition: "background 0.25s, box-shadow 0.25s",
          overflow: "hidden",
        }}
        aria-label="Open Portfolio Agent chat"
      >
        {!open && (
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "-60%",
              width: "40%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              borderRadius: 999,
              pointerEvents: "none",
            }}
            animate={{ left: ["−60%", "160%"] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
          />
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -80, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 80, scale: 0.7 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: 7 }}
            >
              <X size={15} style={{ color: "#e8362a" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12.5, fontWeight: 500, letterSpacing: "0.03em" }}>
                Close
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div style={{ position: "relative", width: 18, height: 18, flexShrink: 0 }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(ellipse at 35% 30%, rgba(160,210,255,0.9) 0%, rgba(40,100,220,0.85) 50%, rgba(8,20,100,0.95) 100%)",
                    border: "1px solid rgba(120,190,255,0.4)",
                  }}
                />
                <motion.div
                  style={{ position: "absolute", inset: "4%", borderRadius: "50%", boxShadow: "inset 0 0 0 1px rgba(0,220,255,0.7)" }}
                  animate={{ transform: ["rotateX(60deg) rotateZ(0deg)", "rotateX(60deg) rotateZ(360deg)"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <span style={{ color: "#fff", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
                Ask my Agent
              </span>
              <motion.div
                style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)", flexShrink: 0 }}
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}