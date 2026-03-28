"use client";

import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    // We want to ping the backend to wake it up and keep it alive
    // while the user is actively browsing the portfolio.
    const backendUrl = process.env.NEXT_PUBLIC_AGENT_URL || "http://localhost:8011";
    
    const pingBackend = async () => {
      try {
        // This fetch call will fail gracefully if CORS is an issue or server is down.
        // But the request still hits the Render server and wakes it up.
        await fetch(`${backendUrl}/health`);
      } catch (error) {
        // Ignore errors, we just want to wake it up.
      }
    };

    // Ping immediately on load
    pingBackend();

    // Free Render instances spin down after 15 minutes of inactivity.
    // Ping every 14 minutes (14 * 60 * 1000 = 840000 ms) to keep it alive.
    const intervalId = setInterval(pingBackend, 840000);

    return () => clearInterval(intervalId);
  }, []);

  // This component doesn't render anything
  return null;
}
