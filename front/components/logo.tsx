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
      <svg viewBox="0 0 40 40" className="h-8 w-8" aria-hidden>
        <path
          d="M20 3 L34 9 V20 C34 28 28 34 20 37 C12 34 6 28 6 20 V9 Z"
          fill="#0B2545"
        />
        <path d="M20 12 L26 22 H22 L20 28 L18 22 H14 Z" fill="#FFFFFF" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-semibold tracking-tight text-[#0B2545]">
            Aegis
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Insurance Decision Platform
          </span>
        </div>
      )}
    </div>
  );
}
