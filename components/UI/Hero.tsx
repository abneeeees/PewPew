import Link from "next/link";
import Shuffle from "./Shuffle";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 15% 85%, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,245,245,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,245,245,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-accent/[0.04] blur-[100px]" />
      <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-accent/[0.06] blur-[80px]" />

      <div className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — Copy */}
            <div>

              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  <span className="text-accent opacity-75">Pew</span>Pew
                  <span className="text-accent animate-ping opacity-75"> * </span>
              </h1>

                <Shuffle
                  text="▓▒░══━ ╾━╾━╾━╾━ ╾━⮞"
                  shuffleDirection="right"
                  duration={0.35}
                  animationMode="evenodd"
                  shuffleTimes={1}
                  ease="power3.out"
                  stagger={0.05}
                  threshold={0.1}
                  triggerOnce={true}
                  triggerOnHover
                  respectReducedMotion={true}
                  loop={true}
                  loopDelay={0}
                />

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]"
                >
                  Start logging
                </Link>
                <Link
                  href="/games"
                  className="rounded-lg border border-border bg-surface-raised px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-muted/50 hover:bg-surface"
                >
                  Browse games
                </Link>
              </div>

              <div className="mt-14 flex items-center gap-5 text-xs text-muted/70">
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-accent/50" />
                  Track your library
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-accent/50" />
                  Rate & review
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-accent/50" />
                  Discover new games
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
