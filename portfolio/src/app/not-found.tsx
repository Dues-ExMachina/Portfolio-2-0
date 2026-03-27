import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-navy flex items-center justify-center px-6">
            <div className="text-center">
                <div
                    className="text-[180px] font-bold leading-none text-coral/10 mb-6 select-none"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                    404
                </div>
                <p
                    className="text-text-label text-[11px] uppercase tracking-[0.3em] mb-4"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    · Page Not Found
                </p>
                <h1
                    className="text-3xl md:text-5xl font-bold text-text-primary mb-6"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                    Lost in the
                    <span className="text-gradient-coral"> Latent Space</span>
                </h1>
                <p className="text-text-muted text-base mb-10 max-w-md mx-auto">
                    This page doesn&apos;t exist — or was lost somewhere in the embedding space.
                </p>
                <Link
                    href="/"
                    className="group relative inline-flex items-center gap-2 px-8 py-4 border border-coral text-coral text-[11px] uppercase tracking-[0.25em] font-bold overflow-hidden hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                >
                    <span className="absolute inset-0 bg-coral translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300" />
                    <span className="relative z-10">← Back to Home</span>
                </Link>
            </div>
        </div>
    );
}
