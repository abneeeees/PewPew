import type { SectionProps } from "../../lib/types";

export default function Section({ title, description }: SectionProps) {
  return (
    <div className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        {title}
    
      </h1>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
        {description}
      </p>
      </div>
    </div>
  );
}