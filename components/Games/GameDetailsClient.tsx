"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Game, ScreenShots } from "@/lib/types";

interface GameDetailsClientProps {
  game: Game;
  screenshots: ScreenShots[];
}

export default function GameDetailsClient({ game, screenshots }: GameDetailsClientProps) {
  // Tags scroll setup
  const sortedTags = [...game.tags].sort((a, b) => a.name.localeCompare(b.name));
  const tagsRef = useRef<HTMLDivElement>(null);
  const [showLeftTagArrow, setShowLeftTagArrow] = useState(false);
  const [showRightTagArrow, setShowRightTagArrow] = useState(true);

  const checkTagScroll = () => {
    if (tagsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tagsRef.current;
      setShowLeftTagArrow(scrollLeft > 5);
      setShowRightTagArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = tagsRef.current;
    if (el) {
      el.addEventListener("scroll", checkTagScroll, { passive: true });
      checkTagScroll();
      window.addEventListener("resize", checkTagScroll, { passive: true });
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkTagScroll);
      window.removeEventListener("resize", checkTagScroll);
    };
  }, [game.tags]);

  const scrollTags = (direction: "left" | "right") => {
    if (tagsRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      tagsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Image Slider setup
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      if (clientWidth > 0) {
        const index = Math.round(scrollLeft / clientWidth);
        setActiveImgIndex(index);
      }
    }
  };

  const slideToImage = (index: number) => {
    if (sliderRef.current) {
      const clientWidth = sliderRef.current.clientWidth;
      sliderRef.current.scrollTo({
        left: index * clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Lightbox setup
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex < screenshots.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const prevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  // Key navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      }
      if (e.key === "ArrowRight" && lightboxIndex < screenshots.length - 1) {
        setLightboxIndex(lightboxIndex + 1);
      }
      if (e.key === "ArrowLeft" && lightboxIndex > 0) {
        setLightboxIndex(lightboxIndex - 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, screenshots.length]);

  // Platform style resolver
  const getPlatformStyle = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes("pc") || s.includes("windows")) {
      return {
        bg: "bg-cyan-950/20 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10",
        icon: (
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 3.449L9.75 2.1v9.451H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM11.25 1.9L24 0v11.55h-12.75V1.9zm12.75 10.55V24l-12.75-1.9v-9.65H24z" />
          </svg>
        ),
      };
    }
    if (s.includes("playstation") || s.includes("ps")) {
      return {
        bg: "bg-blue-950/20 border-blue-500/20 text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10",
        icon: (
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 .79c2.81.42 5.09 2.53 5.71 5.21H13V2.79zm-2 0v5.21H5.29c.62-2.68 2.9-4.79 5.71-5.21zM4.22 10H11v4H3.14c.26-1.52.65-2.83 1.08-4zm8.78 0h6.78c.43 1.17.82 2.48 1.08 4H13v-4zm-2 6v5.21c-2.81-.42-5.09-2.53-5.71-5.21H11zm2 5.21V16h5.71c-.62 2.68-2.9 4.79-5.71 5.21z" />
          </svg>
        ),
      };
    }
    if (s.includes("xbox")) {
      return {
        bg: "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10",
        icon: (
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.97 2A10 10 0 002.16 11c.56 1.83 2.22 4.41 4.54 6.27-.37-.8-.74-1.92-.88-3.05a10.93 10.93 0 011.66-7.39c.69 1.18 1.63 2.76 2.37 4.2a34.73 34.73 0 012.12-4.14C12.7 8 13.62 9.57 14.32 10.74c.48-.96 1.02-2.14 1.5-3.04a11 11 0 011.62 7.1c-.13 1.1-.48 2.18-.84 2.96 2.34-1.85 4-4.41 4.56-6.23a10 10 0 00-9.19-9.53zm-2.5 13.9a41.05 41.05 0 002.5 5.86 42.45 42.45 0 002.5-5.86c-1.57.88-3.37.88-5 0z" />
          </svg>
        ),
      };
    }
    if (s.includes("nintendo") || s.includes("switch")) {
      return {
        bg: "bg-red-950/20 border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10",
        icon: (
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16.5c-2.48 0-4.5-2.02-4.5-4.5S8.52 9.5 11 9.5v9zm2-9c2.48 0 4.5 2.02 4.5 4.5S15.48 18.5 13 18.5v-9zM9.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm8 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
        ),
      };
    }
    if (s.includes("mac") || s.includes("apple") || s.includes("ios")) {
      return {
        bg: "bg-zinc-800/40 border-zinc-700/30 text-zinc-300 hover:border-zinc-500/40 hover:bg-zinc-700/10",
        icon: (
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 3 .11.03.22.05.33.05.9 0 2.06-.68 2.67-1.5z" />
          </svg>
        ),
      };
    }
    if (s.includes("linux")) {
      return {
        bg: "bg-amber-950/20 border-amber-500/20 text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10",
        icon: (
          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a5 5 0 00-4.8 3.6c-.2.5-.2 1.1 0 1.6.4 1.1 1.3 1.9 2.5 2.1l-.7 2.1a1 1 0 00.9 1.3h4.2a1 1 0 00.9-1.3l-.7-2.1c1.2-.2 2.1-1 2.5-2.1.2-.5.2-1.1 0-1.6A5 5 0 0012 2zm-4.7 13.5c-.7.5-1.3 1.3-1.6 2.2a4 4 0 001.3 4.3 6 6 0 008 0 4 4 0 001.3-4.3c-.3-.9-.9-1.7-1.6-2.2l-.7.8c.8.6 1.3 1.5 1.4 2.5a2 2 0 01-1 1.7 4 4 0 01-5.6 0 2 2 0 01-1-1.7c.1-1 .6-1.9 1.4-2.5l-.8-.8z" />
          </svg>
        ),
      };
    }
    return {
      bg: "bg-zinc-800/20 border-white/5 text-zinc-300 hover:bg-white/10",
      icon: (
        <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <rect x={3} y={3} width={18} height={18} rx={2} />
          <path d="M9 12h6M12 9v6" />
        </svg>
      ),
    };
  };

  // Split description paragraphs
  const paragraphs = game.description_raw?.split(/\n\s*\n/) || [];

  return (
    <div className="relative min-h-screen">
      {/* Background Banner */}
      <div className="absolute inset-x-0 top-0 h-[450px] overflow-hidden">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            priority
            unoptimized
            className="z-0 opacity-20 blur-md object-cover scale-105 saturate-120 brightness-75 transition-all duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface to-background" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        {/* Navigation */}
        <Link
          href="/games"
          className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-muted hover:text-white hover:-translate-x-1 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to games
        </Link>

        {/* Hero Section */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg">
              {game.name}
            </h1>
            {game.publishers && game.publishers.length > 0 && (
              <p className="text-lg font-medium text-accent/90 tracking-wide">
                A Game by <span className="text-white hover:text-accent transition-colors duration-150 cursor-pointer">{game.publishers[0].name}</span>
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {game.released && (
              <span className="rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-semibold text-zinc-300 tracking-wider">
                RELEASED: {game.released}
              </span>
            )}
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 text-xs font-semibold text-amber-400 tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {game.rating.toFixed(1)} / 5.0
            </span>
            {game.metacritic != null && (
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold tracking-wider ${
                  game.metacritic >= 75
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : game.metacritic >= 50
                      ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}
              >
                METASCORE: {game.metacritic}
              </span>
            )}
          </div>
        </div>

        {/* Tags Section (Alphabetical & Horizontally Scrollable) */}
        {sortedTags.length > 0 && (
          <div className="relative group/tags mb-12 border-y border-white/5 py-4 bg-white/[0.01]">
            {showLeftTagArrow && (
              <button
                onClick={() => scrollTags("left")}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-surface-raised/95 border border-white/10 hover:border-accent hover:bg-accent text-white shadow-2xl transition duration-200 cursor-pointer"
                aria-label="Scroll tags left"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div
              ref={tagsRef}
              className="flex gap-2 overflow-x-auto py-1 px-2 scroll-smooth snap-x select-none scrollbar-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {sortedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="shrink-0 snap-start rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white hover:border-accent hover:bg-accent/10 transition-all duration-300 cursor-default"
                >
                  {tag.name}
                </span>
              ))}
            </div>

            {showRightTagArrow && (
              <button
                onClick={() => scrollTags("right")}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-surface-raised/95 border border-white/10 hover:border-accent hover:bg-accent text-white shadow-2xl transition duration-200 cursor-pointer"
                aria-label="Scroll tags right"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Screenshots Horizontal Image Slider */}
            {screenshots.length > 0 && (
              <section className="relative group/slider w-full aspect-video rounded-2xl overflow-hidden border border-white/5 bg-zinc-950/80 shadow-2xl">
                <div
                  ref={sliderRef}
                  onScroll={handleSliderScroll}
                  className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth select-none scrollbar-none"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {screenshots.map((screenshot, idx) => (
                    <div
                      key={screenshot.id}
                      className="w-full h-full shrink-0 snap-start snap-always relative cursor-zoom-in"
                      onClick={() => openLightbox(idx)}
                    >
                      <Image
                        src={screenshot.image}
                        alt={`${game.name} screenshot ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        className="object-cover transition-transform duration-700 hover:scale-103"
                        sizes="(max-width: 1024px) 100vw, 70vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Zoom Indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/25 pointer-events-none">
                        <div className="p-3.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 scale-90 group-hover/slider:scale-100 transition-all duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Left Arrow */}
                {activeImgIndex > 0 && (
                  <button
                    onClick={() => slideToImage(activeImgIndex - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-accent border border-white/15 hover:border-accent text-white transition-all duration-200 backdrop-blur-md shadow-2xl cursor-pointer"
                    aria-label="Previous screenshot"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Right Arrow */}
                {activeImgIndex < screenshots.length - 1 && (
                  <button
                    onClick={() => slideToImage(activeImgIndex + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-accent border border-white/15 hover:border-accent text-white transition-all duration-200 backdrop-blur-md shadow-2xl cursor-pointer"
                    aria-label="Next screenshot"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* Position tracker */}
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white tracking-widest select-none">
                  {activeImgIndex + 1} / {screenshots.length}
                </div>
              </section>
            )}

            {/* Supported Platforms (Placed above Description) */}
            {game.platforms && game.platforms.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
                  Supported Platforms
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {game.platforms.map(({ platform }) => {
                    const { bg, icon } = getPlatformStyle(platform.slug);
                    return (
                      <span
                        key={platform.id}
                        className={`flex items-center px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-300 ${bg}`}
                      >
                        {icon}
                        {platform.name}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Description (Redesigned & Stylized) */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
                Description
              </h2>
              <div className="relative rounded-2xl border border-white/5 bg-surface/30 p-6 sm:p-8 backdrop-blur-md shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/80 transition-all duration-500" />
                <div className="relative z-10 space-y-4 font-sans leading-relaxed text-zinc-300">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((p, idx) => (
                      <p key={idx} className="text-sm sm:text-base text-zinc-300/90 leading-relaxed font-normal">
                        {p.trim()}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm sm:text-base text-zinc-400 italic">No description available.</p>
                  )}
                </div>
              </div>
            </section>

            {/* System Requirements (Expandable with animation) */}
            {game.platforms.some(({ requirements }) => requirements?.minimum || requirements?.recommended) && (
              <section className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted">
                  System Requirements
                </h2>
                <div className="flex flex-col gap-4">
                  {game.platforms
                    .filter(({ requirements }) => requirements?.minimum || requirements?.recommended)
                    .map(({ platform, requirements }) => (
                      <PlatformRequirementsCard
                        key={platform.id}
                        platformName={platform.name}
                        minimum={requirements?.minimum}
                        recommended={requirements?.recommended}
                      />
                    ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Additional Info (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/5 bg-surface/40 p-6 backdrop-blur-md shadow-xl space-y-6">
              <h3 className="text-md font-bold text-white tracking-wide border-b border-white/5 pb-3">
                Game Details
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <span className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Publisher</span>
                  <span className="font-semibold text-zinc-200">
                    {game.publishers && game.publishers.length > 0 ? game.publishers.map(p => p.name).join(", ") : "Unknown"}
                  </span>
                </div>
                
                <div>
                  <span className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Release Date</span>
                  <span className="font-semibold text-zinc-200">{game.released ?? "Unknown"}</span>
                </div>

                <div>
                  <span className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Rating</span>
                  <span className="font-semibold text-zinc-200 flex items-center gap-1">
                    ★ {game.rating.toFixed(2)} / 5.0
                  </span>
                </div>

                {game.website && /^https?:\/\//i.test(String(game.website)) && (
                  <div>
                    <span className="block text-xs font-bold text-muted uppercase tracking-wider mb-1">Official Website</span>
                    <Link
                      href={String(game.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent hover:underline break-all inline-flex items-center gap-1 group/web"
                    >
                      Visit Website
                      <svg className="w-3.5 h-3.5 group-hover/web:translate-x-0.5 group-hover/web:-translate-y-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors duration-200 border border-white/10 cursor-pointer"
            aria-label="Close fullscreen view"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Left Navigation Arrow */}
          {lightboxIndex > 0 && (
            <button
              onClick={prevLightbox}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-accent border border-white/10 text-white transition-all duration-200 backdrop-blur-md shadow-2xl cursor-pointer"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Main Lightbox Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] aspect-video w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={screenshots[lightboxIndex].image}
              alt={`${game.name} full screenshot`}
              fill
              unoptimized
              className="object-contain select-none"
            />
          </div>

          {/* Right Navigation Arrow */}
          {lightboxIndex < screenshots.length - 1 && (
            <button
              onClick={nextLightbox}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 hover:bg-accent border border-white/10 text-white transition-all duration-200 backdrop-blur-md shadow-2xl cursor-pointer"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Count Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white tracking-widest select-none">
            {lightboxIndex + 1} / {screenshots.length}
          </div>
        </div>
      )}
    </div>
  );
}

// Collapsible Platform Requirements Component
interface PlatformRequirementsCardProps {
  platformName: string;
  minimum?: string;
  recommended?: string;
}

function PlatformRequirementsCard({ platformName, minimum, recommended }: PlatformRequirementsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-white/5 bg-surface/30 p-6 backdrop-blur-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-md sm:text-lg font-bold text-white tracking-wide">For {platformName}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-accent border border-white/10 hover:border-accent text-xs font-semibold text-white transition-all duration-200 cursor-pointer"
        >
          {isExpanded ? (
            <>
              Hide Requirements
              <svg className="w-3.5 h-3.5 rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          ) : (
            <>
              Show Requirements
              <svg className="w-3.5 h-3.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* CSS grid height animation */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] mt-6 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-6 pt-4 border-t border-white/5">
            {minimum && (
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
                  Minimum Requirements
                </span>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300 pl-1">
                  {minimum.replace(/^(Minimum Requirements:|Minimum:)/i, "").trim()}
                </pre>
              </div>
            )}
            {recommended && (
              <div>
                <span className="inline-block px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-3">
                  Recommended Requirements
                </span>
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-300 pl-1">
                  {recommended.replace(/^(Recommended Requirements:|Recommended:)/i, "").trim()}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tiny Preview when collapsed */}
      {!isExpanded && (
        <div className="mt-3 text-xs text-zinc-400/80 line-clamp-1 border-t border-white/5 pt-3">
          {minimum ? minimum.split("\n")[0] : recommended ? recommended.split("\n")[0] : ""}
        </div>
      )}
    </div>
  );
}
