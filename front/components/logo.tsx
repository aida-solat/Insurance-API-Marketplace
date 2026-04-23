import { cn } from "@/lib/cn";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        className="h-8 w-8"
        aria-hidden
      >
        <defs>
          <linearGradient id="aegis-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4E4B1" />
            <stop offset="55%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8A6B16" />
          </linearGradient>
        </defs>
        <path
          d="M20 3 L34 9 V20 C34 28 28 34 20 37 C12 34 6 28 6 20 V9 Z"
          fill="url(#aegis-g)"
          stroke="#1C7A58"
          strokeWidth="1"
        />
        <path
          d="M20 12 L26 22 H22 L20 28 L18 22 H14 Z"
          fill="#06170F"
        />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-wide text-gold-200">
            Aegis
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-forest-300/80">
            Decision Platform
          </span>
        </div>
      )}
    </div>
  );
}
