import Link from "next/link";
import Section from "./Section";


export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-background" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(232, 74, 113, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.2) 0%, transparent 40%)",
        }}
      />

      <div className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <Section title="pewpew" description="Log what you've played, discover what's next, and share your taste with a community that gets it." />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Start logging
            </Link>
            <button
              type="button"
              className="rounded-lg border border-border bg-surface-raised px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-muted/50"
            >
              Browse games
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
