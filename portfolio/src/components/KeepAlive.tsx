"use client";

import { useEffect } from "react";

export type BackendStatus = "waking" | "online" | "offline";

// Shared with the chat widget so it can show "waking up" instead of failing
declare global {
  interface Window {
    __backendStatus?: BackendStatus;
  }
}

function setStatus(status: BackendStatus) {
  window.__backendStatus = status;
  window.dispatchEvent(new CustomEvent<BackendStatus>("backend-status", { detail: status }));
}

/**
 * Wakes the Render free-tier backend as soon as a visitor opens the site,
 * so it's warm by the time they use "Ask my Agent" or Neural Canvas.
 */
export default function KeepAlive() {
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_AGENT_URL;
    if (!backendUrl) return; // nothing to wake (avoids pinging the visitor's own localhost)

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let lastPing = 0;

    const ping = async (attempt = 0) => {
      if (attempt === 0) {
        if (Date.now() - lastPing < 60000) return; // throttle tab-switch pings
        lastPing = Date.now();
        if (window.__backendStatus !== "online") setStatus("waking");
      }
      try {
        // A cold start on Render takes ~30-60s, so allow a long timeout
        const res = await fetch(`${backendUrl}/health`, { cache: "no-store", signal: AbortSignal.timeout(70000) });
        if (cancelled) return;
        if (res.ok) {
          setStatus("online");
          return;
        }
        throw new Error(`status ${res.status}`);
      } catch {
        if (cancelled) return;
        // Keep retrying for ~3 minutes while the instance boots
        if (attempt < 6) {
          retryTimer = setTimeout(() => ping(attempt + 1), 10000);
        } else {
          setStatus("offline");
        }
      }
    };

    // Ping immediately on load
    ping();

    // Free Render instances spin down after 15 minutes of inactivity.
    // Ping every 10 minutes, but only while the tab is visible.
    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") ping();
    }, 10 * 60 * 1000);

    // Re-wake when the visitor comes back to the tab after a while
    const onVisible = () => {
      if (document.visibilityState === "visible") ping();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      clearTimeout(retryTimer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
