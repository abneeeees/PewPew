import { StringNullableFilter } from "@/generated/prisma/commonInputTypes";
import type { Game } from "@/lib/types";
import Image from "next/image";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <>
      <a
        href="#"
        className="group relative block aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-surface-raised shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      >
        <Image
          src={game.background_image}
          alt={game.name}
          fill
          sizes="(max-width:768px) 50vw, (max-width:1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
  
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/40" />
  
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
  
        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-white">
            {game.name}
          </h3>
  
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-white/70">{game.released}</span>
  
            <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-yellow-400 backdrop-blur">
              ★ {game.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </a>
    </>
  );
}