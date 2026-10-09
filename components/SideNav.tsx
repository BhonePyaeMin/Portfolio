"use client";

import { useEffect, useState } from "react";
import {
  Home,
  User,
  Briefcase,
  FolderGit2,
  Cpu,
  Award,
  Mail,
} from "lucide-react";
import { Tooltip } from "@/components/ui/Tooltip";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: "hero",         label: "Home",         icon: Home },
  { id: "about",        label: "About Me",     icon: User },
  { id: "career",       label: "Career",       icon: Briefcase },
  { id: "projects",     label: "Projects",     icon: FolderGit2 },
  { id: "skills",       label: "Skills",       icon: Cpu },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "contact",      label: "Contact",      icon: Mail },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SideNav() {
  const [activeId, setActiveId] = useState<string>("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let currentId = "hero";
      for (const link of NAV_LINKS) {
        const element = document.getElementById(link.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentId = link.id;
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <nav
      className="fixed z-50 flex flex-row gap-1.5 rounded-full border border-border bg-bgPanel/90 p-2 backdrop-blur-xl
                 max-md:bottom-6 max-md:left-1/2 max-md:-translate-x-1/2
                 md:right-6 md:top-1/2 md:-translate-y-1/2 md:flex-col md:gap-1.5"
    >
      {NAV_LINKS.map(({ id, label, icon: Icon }) => {
        const isActive = activeId === id;
        return (
          <Tooltip key={id} label={label} position="left">
            <button
              onClick={() => scrollToSection(id)}
              aria-label={label}
              className={[
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                isActive
                  ? "bg-teal/[0.15] ring-2 ring-teal/40 text-teal shadow-[0_0_12px_rgba(45,212,191,0.25)]"
                  : "text-slate hover:bg-teal/[0.08] hover:text-teal hover:ring-1 hover:ring-teal/25",
              ].join(" ")}
            >
              <Icon
                className={[
                  "h-4 w-4 shrink-0 transition-all duration-300",
                  isActive
                    ? "brightness-125 drop-shadow-[0_0_6px_rgba(45,212,191,0.8)]"
                    : "group-hover:brightness-110",
                ].join(" ")}
              />
            </button>
          </Tooltip>
        );
      })}
    </nav>
  );
}
