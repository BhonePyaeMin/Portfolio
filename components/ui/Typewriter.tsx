"use client";

import { useState, useEffect } from "react";

// ─── Per-phrase ocean-blue color palette ──────────────────────────────────────
const PHRASE_COLORS: string[] = [
  "var(--tw-phrase-0)", // Computer Engineering
  "var(--tw-phrase-1)", // Networking
  "var(--tw-phrase-2)", // Network Automation
  "var(--tw-phrase-3)", // Cybersecurity
  "var(--tw-phrase-4)", // AI/ML
];

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function Typewriter({
  phrases,
  typingSpeed = 140,
  deletingSpeed = 65,
  pauseDuration = 2000,   // 2 s pause at full word before deleting
}: TypewriterProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullPhrase = phrases[currentPhraseIndex];
    let timeoutId: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText === "") {
        // Done deleting — move to next phrase after a short gap
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 300);
      } else {
        timeoutId = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (currentText === fullPhrase) {
        // Word fully typed — pause, then start deleting.
        // Returning here without changing state means this effect won't
        // re-run (no deps changed), so the timeout below is safe.
        timeoutId = setTimeout(() => setIsDeleting(true), pauseDuration);
      } else {
        timeoutId = setTimeout(() => {
          setCurrentText(fullPhrase.slice(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentText, isDeleting, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  const color = PHRASE_COLORS[currentPhraseIndex % PHRASE_COLORS.length];

  return (
    <span className="inline-flex items-center">
      <span style={{ color, transition: "color 0.4s ease" }}>
        {currentText}
      </span>
      {/* Blinking cursor matches current phrase color */}
      <span
        className="ml-[2px] h-[1.1em] w-[3px] animate-pulse rounded-sm"
        style={{ backgroundColor: color, transition: "background-color 0.4s ease" }}
      />
    </span>
  );
}
