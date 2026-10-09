"use client";

import { ReactNode } from "react";

export function Tooltip({
  children,
  label,
  position = "left",
}: {
  children: ReactNode;
  label: string;
  position?: "top" | "bottom" | "left" | "right";
}) {
  const positionClasses: Record<string, string> = {
    top:    "bottom-full mb-2 -translate-x-1/2 left-1/2",
    bottom: "top-full mt-2 -translate-x-1/2 left-1/2",
    left:   "right-full mr-3 top-1/2 -translate-y-1/2",
    right:  "left-full ml-3 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="group relative flex items-center justify-center">
      {children}
      <div
        className={`pointer-events-none absolute z-50 opacity-0 transition-all duration-200 group-hover:opacity-100 ${positionClasses[position]}`}
      >
        <div className="whitespace-nowrap rounded bg-bgPanel px-2.5 py-1 font-body text-xs font-medium text-teal shadow-[0_4px_12px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
          {label}
        </div>
      </div>
    </div>
  );
}
