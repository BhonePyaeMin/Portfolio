"use client";

import { ArrowUpRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContactCardProps {
  /** Lucide (or any) icon element */
  icon: React.ReactNode;
  /** Small uppercase label above the value */
  label: string;
  /** Human-readable value shown in the card */
  value: string;
  /** href — mailto:, tel:, or https:// */
  href: string;
  /** If true, opens in a new tab and shows an ArrowUpRight indicator */
  external?: boolean;
  /** Brand color hex code (e.g. #0A66C2) */
  brandColor?: string;
}

const HOVER_GLOW = "hover:border-teal/25 hover:shadow-[0_4px_32px_rgba(45,212,191,0.10)]";

// ─── Component ────────────────────────────────────────────────────────────────

export function ContactCard({
  icon,
  label,
  value,
  href,
  external = false,
  brandColor = "#2DD4BF",
}: ContactCardProps) {
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={[
        // Base
        "group relative flex flex-row items-center gap-4 rounded-2xl",
        "border border-border bg-bgPanel p-4 text-left",
        // Transitions
        "transition-all duration-300 hover:-translate-y-1",
        HOVER_GLOW,
        // Keyboard focus
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-teal/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      ].join(" ")}
    >
      {/* External link arrow — top-right corner */}
      {external && (
        <ArrowUpRight
          aria-hidden="true"
          className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-muted transition-colors duration-200 group-hover:text-body"
        />
      )}

      {/* Icon badge — dynamic brand color tint */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
        style={{
          color: brandColor,
          backgroundColor: `${brandColor}26`, // ~15% alpha
          borderColor: `${brandColor}40`,     // ~25% alpha
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Label + value */}
      <div className="flex min-w-0 flex-col justify-center gap-1.5">
        <p className="break-all font-body text-xs font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-teal">
          {label}
        </p>
        <p className="font-body text-[11px] font-medium text-muted">
          {value}
        </p>
      </div>
    </a>
  );
}
