import type { Metadata } from "next";
import { Syne, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import PortfolioChatWidget from "@/components/agent/PortfolioChatWidget";
import KeepAlive from "@/components/KeepAlive";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anubhab Das — Generative AI Engineer",
  description: "Personal portfolio of Anubhab Das, a Generative AI Engineer specializing in LLMs, RAG Systems, Diffusion Models, and AI Agents.",
  keywords: ["Generative AI", "LLM", "RAG", "AI Engineer", "Machine Learning", "Portfolio"],
  authors: [{ name: "Anubhab Das" }],
  openGraph: {
    title: "Anubhab Das — Generative AI Engineer",
    description: "Personal portfolio showcasing LLM systems, AI agents, and creative generative AI projects.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-navy text-text-primary antialiased">
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
        <PortfolioChatWidget />
        <KeepAlive />
      </body>
    </html>
  );
}
