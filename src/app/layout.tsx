import type { Metadata } from "next";
import Link from "next/link";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quantum Agent Physics Lab",
  description:
    "AI physics problem solving with specialized agent teams, equations, graphs, and educational visualizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <div className="min-h-screen overflow-hidden">
          <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
            <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.95)]" />
                <span className="hidden sm:inline">Quantum Agent Physics Lab</span>
                <span className="sm:hidden">QAPL</span>
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Link className="nav-link" href="/examples">
                  Examples
                </Link>
                <Link className="nav-link" href="/solve">
                  Solve
                </Link>
                <Link className="nav-link" href="/about">
                  About
                </Link>
              </div>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
