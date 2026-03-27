"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic2, Github, Globe, Check, Copy, ThumbsUp } from "lucide-react";

// ─── Glowing Orb ────────────────────────────────────────────────────────────

type OrbState = "idle" | "thinking" | "searching" | "streaming" | "done";

function GlowingOrb({
  state,
  size = 160,
}: {
  state: OrbState;
  size?: number;
}) {
  const isThinking = state === "thinking";
  const isSearching = state === "searching";
  const isSmall = state === "streaming" || state === "done";

  const baseGlow = isThinking
    ? "0 0 60px 20px rgba(30,120,255,0.7), 0 0 120px 40px rgba(30,80,255,0.35)"
    : isSearching
    ? "0 0 50px 15px rgba(40,130,255,0.65), 0 0 100px 35px rgba(30,70,255,0.3)"
    : "0 0 80px 30px rgba(30,120,255,0.55), 0 0 150px 60px rgba(20,70,255,0.25)";

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Outer ambient glow */}
      <motion.div
        style={{
          position: "absolute",
          inset: -size * 0.25,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(30,100,255,0.18) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{
          scale: isThinking ? [1, 1.15, 0.95, 1.1, 1] : isSearching ? [1, 1.08, 1] : [1, 1.05, 1],
          opacity: isThinking ? [0.7, 1, 0.8, 1, 0.7] : [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: isThinking ? 1.5 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* The orb body */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: isThinking ? "40% 60% 55% 45% / 45% 40% 60% 55%" : "50%",
          background:
            "radial-gradient(ellipse at 35% 30%, rgba(80,160,255,0.9) 0%, rgba(20,60,200,0.85) 40%, rgba(10,20,120,0.95) 100%)",
          boxShadow: baseGlow,
          border: "1px solid rgba(100,180,255,0.3)",
        }}
        animate={{
          borderRadius: isThinking
            ? [
                "40% 60% 55% 45% / 45% 40% 60% 55%",
                "55% 45% 40% 60% / 60% 55% 45% 40%",
                "45% 55% 60% 40% / 40% 60% 55% 45%",
                "40% 60% 55% 45% / 45% 40% 60% 55%",
              ]
            : isSearching
            ? [
                "48% 52% 46% 54% / 50% 48% 52% 50%",
                "52% 48% 54% 46% / 50% 52% 48% 50%",
                "48% 52% 46% 54% / 50% 48% 52% 50%",
              ]
            : ["50%", "50%"],
          rotate: isThinking ? [0, 15, -10, 20, 0] : isSearching ? [0, -8, 5, 0] : [0, 5, -3, 0],
          scale: isThinking ? [1, 0.95, 1.05, 0.97, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: isThinking ? 1.8 : isSearching ? 2.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Ribbon 1 - bright equatorial streak */}
      <motion.div
        style={{
          position: "absolute",
          inset: "4%",
          borderRadius: "50%",
          border: "none",
          boxShadow: "inset 0 0 0 1.5px rgba(120,200,255,0.6)",
          transform: "rotateX(70deg) rotateZ(20deg)",
        }}
        animate={{
          transform: isThinking
            ? [
                "rotateX(70deg) rotateZ(20deg)",
                "rotateX(75deg) rotateZ(200deg)",
                "rotateX(70deg) rotateZ(380deg)",
              ]
            : isSearching
            ? [
                "rotateX(65deg) rotateZ(0deg)",
                "rotateX(68deg) rotateZ(180deg)",
                "rotateX(65deg) rotateZ(360deg)",
              ]
            : [
                "rotateX(70deg) rotateZ(0deg)",
                "rotateX(70deg) rotateZ(180deg)",
                "rotateX(70deg) rotateZ(360deg)",
              ],
        }}
        transition={{
          duration: isThinking ? 2 : isSearching ? 3 : 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Ribbon 2 - tilted streak */}
      <motion.div
        style={{
          position: "absolute",
          inset: "10%",
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 2px rgba(140,220,255,0.5)",
        }}
        animate={{
          transform: isThinking
            ? [
                "rotateX(55deg) rotateY(30deg) rotateZ(-40deg)",
                "rotateX(60deg) rotateY(35deg) rotateZ(140deg)",
                "rotateX(55deg) rotateY(30deg) rotateZ(320deg)",
              ]
            : isSearching
            ? [
                "rotateX(50deg) rotateY(25deg) rotateZ(0deg)",
                "rotateX(55deg) rotateY(30deg) rotateZ(180deg)",
                "rotateX(50deg) rotateY(25deg) rotateZ(360deg)",
              ]
            : [
                "rotateX(55deg) rotateY(30deg) rotateZ(0deg)",
                "rotateX(55deg) rotateY(30deg) rotateZ(180deg)",
                "rotateX(55deg) rotateY(30deg) rotateZ(360deg)",
              ],
        }}
        transition={{
          duration: isThinking ? 1.6 : isSearching ? 2.2 : 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Ribbon 3 - neon cyan highlight arc */}
      <motion.div
        style={{
          position: "absolute",
          inset: "20%",
          borderRadius: "50%",
          boxShadow: "inset 0 0 0 1.5px rgba(0,230,255,0.7)",
        }}
        animate={{
          transform: isThinking
            ? [
                "rotateX(20deg) rotateY(60deg) rotateZ(60deg)",
                "rotateX(25deg) rotateY(65deg) rotateZ(240deg)",
                "rotateX(20deg) rotateY(60deg) rotateZ(420deg)",
              ]
            : isSearching
            ? [
                "rotateX(15deg) rotateY(55deg) rotateZ(0deg)",
                "rotateX(20deg) rotateY(60deg) rotateZ(180deg)",
                "rotateX(15deg) rotateY(55deg) rotateZ(360deg)",
              ]
            : [
                "rotateX(20deg) rotateY(60deg) rotateZ(0deg)",
                "rotateX(20deg) rotateY(60deg) rotateZ(180deg)",
                "rotateX(20deg) rotateY(60deg) rotateZ(360deg)",
              ],
        }}
        transition={{
          duration: isThinking ? 1.2 : isSearching ? 1.8 : 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner specular highlight */}
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "18%",
          width: "30%",
          height: "20%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(200,230,255,0.75) 0%, transparent 100%)",
          filter: "blur(3px)",
        }}
      />

      {/* Searching tendrils */}
      {isSearching && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                bottom: -20 - i * 12,
                left: `${30 + i * 20}%`,
                width: 2,
                height: 12 + i * 6,
                background:
                  "linear-gradient(to bottom, rgba(80,160,255,0.8), transparent)",
                borderRadius: 4,
              }}
              animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

// ─── Frosted Pill ────────────────────────────────────────────────────────────

function FrostedPill({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Tool Row ─────────────────────────────────────────────────────────────────

type ToolRowProps = {
  accentColor: string;
  badgeBg: string;
  badgeIcon: React.ReactNode;
  label: string;
  subtitle: string;
  result: string;
  done?: boolean;
};

function ToolRow({
  accentColor,
  badgeBg,
  badgeIcon,
  label,
  subtitle,
  result,
  done,
}: ToolRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 14,
        padding: "8px 12px",
      }}
    >
      {/* Badge */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: badgeBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: `1px solid ${accentColor}44`,
        }}
      >
        {badgeIcon}
      </div>

      {/* Labels */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 11,
            marginTop: 1,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexShrink: 0,
        }}
      >
        {done ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: accentColor,
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            <Check size={11} style={{ strokeWidth: 2.5 }} />
            <span>{result}</span>
          </div>
        ) : (
          <motion.div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: `2px solid ${accentColor}`,
              borderTopColor: "transparent",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Screen Background ────────────────────────────────────────────────────────

function ScreenBg({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: 390,
        height: 780,
        background: "#050810",
        borderRadius: 36,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Bottom radial glow */}
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: "50%",
          transform: "translateX(-50%)",
          width: 420,
          height: 320,
          background:
            "radial-gradient(ellipse at center bottom, rgba(20,80,220,0.55) 0%, rgba(10,30,120,0.2) 55%, transparent 75%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

// ─── Screen 1: Idle ───────────────────────────────────────────────────────────

function Screen1Idle() {
  const chips = [
    "What's Anubhab's most complex project?",
    "What backend tech does he use?",
    "Has he worked with RAG before?",
  ];

  return (
    <ScreenBg>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "60px 24px 32px",
          gap: 0,
        }}
      >
        {/* Orb section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            gap: 16,
          }}
        >
          <GlowingOrb state="idle" size={160} />
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 15,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            Portfolio Agent
          </span>
          <div
            style={{
              textAlign: "center",
              color: "#fff",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.25,
              fontFamily: "Inter, sans-serif",
            }}
          >
            How can I help
            <br />
            you today?
          </div>
        </div>

        {/* Chips */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
            marginBottom: 16,
          }}
        >
          {chips.map((chip) => (
            <FrostedPill
              key={chip}
              style={{
                padding: "11px 18px",
                textAlign: "center",
                color: "rgba(255,255,255,0.75)",
                fontSize: 13.5,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              {chip}
            </FrostedPill>
          ))}
        </div>

        {/* Input */}
        <FrostedPill
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "14px 18px",
            gap: 10,
          }}
        >
          <span
            style={{
              flex: 1,
              color: "rgba(255,255,255,0.35)",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Ask anything...
          </span>
          <Mic2
            size={18}
            style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
          />
        </FrostedPill>
      </div>
    </ScreenBg>
  );
}

// ─── Screen 2: Thinking ───────────────────────────────────────────────────────

function Screen2Thinking() {
  return (
    <ScreenBg>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "60px 24px 32px",
        }}
      >
        {/* User bubble */}
        <div
          style={{
            alignSelf: "flex-end",
            background: "#1c1c1e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px 20px 4px 20px",
            padding: "10px 16px",
            color: "#fff",
            fontSize: 13.5,
            fontFamily: "Inter, sans-serif",
            maxWidth: "80%",
            marginBottom: 0,
          }}
        >
          What's his most complex project?
        </div>

        {/* Orb - thinking */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GlowingOrb state="thinking" size={180} />
        </div>

        {/* Thinking pill */}
        <FrostedPill
          style={{
            width: "100%",
            padding: "14px 18px",
            textAlign: "center",
            color: "rgba(255,255,255,0.45)",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Thinking...
        </FrostedPill>
      </div>
    </ScreenBg>
  );
}

// ─── Screen 3: Tool Calling ───────────────────────────────────────────────────

function Screen3ToolCalling() {
  return (
    <ScreenBg>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "48px 24px 28px",
          gap: 0,
        }}
      >
        {/* User bubble */}
        <div
          style={{
            alignSelf: "flex-end",
            background: "#1c1c1e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px 20px 4px 20px",
            padding: "9px 14px",
            color: "#fff",
            fontSize: 12.5,
            fontFamily: "Inter, sans-serif",
            maxWidth: "80%",
            marginBottom: 0,
          }}
        >
          What's his most complex project?
        </div>

        {/* Orb – searching */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <GlowingOrb state="searching" size={130} />
        </div>

        {/* Agent working card */}
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.13)",
            borderRadius: 20,
            padding: "14px 14px 12px",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <motion.div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#a855f7",
                flexShrink: 0,
              }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12,
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Agent is working
            </span>
          </div>

          {/* Tool rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ToolRow
              accentColor="#a855f7"
              badgeBg="rgba(168,85,247,0.18)"
              badgeIcon={<span style={{ fontSize: 11 }}>🗂</span>}
              label="Pinecone"
              subtitle="Searching knowledge base..."
              result="5 chunks"
              done={true}
            />
            <ToolRow
              accentColor="#6e7681"
              badgeBg="rgba(36,41,47,0.6)"
              badgeIcon={<Github size={13} style={{ color: "#ccc" }} />}
              label="GitHub"
              subtitle="Fetching latest repos..."
              result="3 repos"
              done={false}
            />
            <ToolRow
              accentColor="#22d3ee"
              badgeBg="rgba(34,211,238,0.12)"
              badgeIcon={<Globe size={12} style={{ color: "#22d3ee" }} />}
              label="Web Fetch"
              subtitle="Reading ycloude.com..."
              result="Content extracted"
              done={false}
            />
          </div>
        </div>

        {/* Searching pill */}
        <FrostedPill
          style={{
            width: "100%",
            padding: "13px 18px",
            marginTop: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <motion.span
              style={{ color: "rgba(255,255,255,0.55)", letterSpacing: 3, fontSize: 16, lineHeight: 1 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              · · ·
            </motion.span>
            <span
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Searching...
            </span>
          </div>
        </FrostedPill>
      </div>
    </ScreenBg>
  );
}

// ─── Screen 4: Streaming ──────────────────────────────────────────────────────

function Screen4Streaming() {
  const answer = `Y Cloude is your most architecturally complex project. It's a full-stack AI platform built with FastAPI, LangGraph, and Pinecone — featuring multi-agent orchestration, real-time streaming, and RAG pipelines. The GitHub repo shows`;

  return (
    <ScreenBg>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 24px 28px",
          gap: 14,
        }}
      >
        {/* Small orb */}
        <GlowingOrb state="streaming" size={60} />

        {/* Collapsed tool pill */}
        <FrostedPill
          style={{
            padding: "7px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {["#a855f7", "#6e7681", "#22d3ee"].map((c) => (
              <div
                key={c}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Pinecone · GitHub · Web
          </span>
        </FrostedPill>

        {/* Streaming answer */}
        <div
          style={{
            flex: 1,
            width: "100%",
            color: "#fff",
            fontSize: 14.5,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
            overflow: "hidden",
          }}
        >
          <span>
            <strong>Y Cloude</strong>
            {answer.slice(7)}
          </span>
          {/* Blinking cursor */}
          <motion.span
            style={{
              display: "inline-block",
              width: 2,
              height: "1.1em",
              background: "rgba(80,160,255,0.9)",
              borderRadius: 1,
              marginLeft: 2,
              verticalAlign: "text-bottom",
            }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>

        {/* Dimmed input */}
        <FrostedPill
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "13px 18px",
            gap: 10,
            opacity: 0.4,
          }}
        >
          <span
            style={{
              flex: 1,
              color: "rgba(255,255,255,0.35)",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Generating...
          </span>
          <Mic2 size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
        </FrostedPill>
      </div>
    </ScreenBg>
  );
}

// ─── Screen 5: Done ───────────────────────────────────────────────────────────

function Screen5Done() {
  const answer = `Y Cloude is your most architecturally complex project. It's a full-stack AI platform built with FastAPI, LangGraph, and Pinecone — featuring multi-agent orchestration, real-time streaming, and RAG pipelines. The GitHub repo shows active commits, 12 branches, and a sophisticated microservices architecture with Docker Compose.`;

  return (
    <ScreenBg>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 24px 28px",
          gap: 14,
        }}
      >
        {/* Small orb */}
        <GlowingOrb state="done" size={60} />

        {/* Collapsed tool pill */}
        <FrostedPill
          style={{
            padding: "7px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {["#a855f7", "#6e7681", "#22d3ee"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Pinecone · GitHub · Web
          </span>
        </FrostedPill>

        {/* Full answer */}
        <div
          style={{
            flex: 1,
            width: "100%",
            color: "#fff",
            fontSize: 14.5,
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
            overflow: "hidden",
          }}
        >
          <strong>Y Cloude</strong>
          {answer.slice(7)}
        </div>

        {/* Action pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignSelf: "flex-start",
            marginBottom: 4,
          }}
        >
          <FrostedPill
            style={{
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <ThumbsUp size={13} style={{ color: "rgba(255,255,255,0.7)" }} />
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12.5,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Helpful
            </span>
          </FrostedPill>
          <FrostedPill
            style={{
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <Copy size={13} style={{ color: "rgba(255,255,255,0.7)" }} />
            <span
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 12.5,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Copy
            </span>
          </FrostedPill>
        </div>

        {/* Full input */}
        <FrostedPill
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "13px 18px",
            gap: 10,
          }}
        >
          <span
            style={{
              flex: 1,
              color: "rgba(255,255,255,0.35)",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Ask anything...
          </span>
          <Mic2 size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
        </FrostedPill>
      </div>
    </ScreenBg>
  );
}

// ─── Screen Label ─────────────────────────────────────────────────────────────

function ScreenLabel({
  label,
  isHero,
}: {
  label: string;
  isHero?: boolean;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          color: isHero ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
          fontSize: isHero ? 14 : 13,
          fontFamily: "Inter, sans-serif",
          fontWeight: isHero ? 700 : 400,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      {isHero && (
        <span
          style={{
            color: "#a855f7",
            fontSize: 11.5,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.04em",
            border: "1px solid rgba(168,85,247,0.4)",
            borderRadius: 6,
            padding: "2px 8px",
          }}
        >
          ← Signature state
        </span>
      )}
    </div>
  );
}

// ─── Main Canvas ──────────────────────────────────────────────────────────────

export default function AgentDesignCanvas() {
  return (
    <div
      style={{
        background: "#020408",
        minHeight: "100vh",
        padding: "60px 40px 80px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Canvas title */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Portfolio AI Agent
        </div>
        <h1
          style={{
            color: "#fff",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Floating Chat Widget — Design Canvas
        </h1>
      </div>

      {/* Screens row */}
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "flex-end",
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {/* Screen 1 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <Screen1Idle />
          <ScreenLabel label="Idle" />
        </div>

        {/* Screen 2 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <Screen2Thinking />
          <ScreenLabel label="Thinking" />
        </div>

        {/* Screen 3 — Hero, slightly enlarged */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexShrink: 0,
            transform: "scale(1.06)",
            transformOrigin: "bottom center",
          }}
        >
          <Screen3ToolCalling />
          <ScreenLabel label="Tool Calling" isHero />
        </div>

        {/* Screen 4 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <Screen4Streaming />
          <ScreenLabel label="Streaming" />
        </div>

        {/* Screen 5 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <Screen5Done />
          <ScreenLabel label="Done" />
        </div>
      </div>
    </div>
  );
}
