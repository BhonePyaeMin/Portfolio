"use client";

import dynamic from "next/dynamic";

const Carousel = dynamic(() => import("../Carousel"), {
  ssr: false,
});

// ─── Certificate gallery items ────────────────────────────────────────────────

const CERT_ITEMS = [
  {
    id: 1,
    image: "/images/cert_googleaiessentials.jpg",
    text: "Google AI Essentials",
    verifyUrl: "https://coursera.org/verify/specialization/5SS4TV6B54PW",
  },
  {
    id: 5,
    image: "/images/cert_introtoai.jpg",
    text: "Introduction to AI",
    verifyUrl: "https://coursera.org/verify/TEBIXW6U2HO4",
  },
  {
    id: 6,
    image: "/images/cert_maximizeproductivity.jpg",
    text: "Maximize Productivity With AI Tools",
    verifyUrl: "https://coursera.org/verify/TQ7LD7UXZ9SX",
  },
  {
    id: 7,
    image: "/images/cert_artofprompting.jpg",
    text: "Discover the Art of Prompting",
    verifyUrl: "https://coursera.org/verify/UUEXTHN1UB3X",
  },
  {
    id: 8,
    image: "/images/cert_useairesponsibly.jpg",
    text: "Use AI Responsibly",
    verifyUrl: "https://coursera.org/verify/A196VU5ODVEB",
  },
  {
    id: 9,
    image: "/images/cert_stayaheadai.jpg",
    text: "Stay Ahead of the AI Curve",
    verifyUrl: "https://coursera.org/verify/2YKK24R8XPE1",
  },
  { id: 12, image: "/images/cert_hccda.jpg", text: "HCCDA Tech Essentials" },
  {
    id: 15,
    image: "/images/cert_hcia_datacom.jpg",
    text: "HCIA Datacom",
    verifyUrl: "https://e.huawei.com/cn/talent/#/cert/certificate-verification",
  },
  {
    id: 2,
    image: "/images/cert_networksecurity.jpg",
    text: "Connect and Protect: Networks and Network Security",
    verifyUrl: "https://coursera.org/verify/9NXCOC1AUQ9E",
  },
  {
    id: 3,
    image: "/images/cert_managesecurityrisks.jpg",
    text: "Play It Safe: Manage Security Risks",
    verifyUrl: "https://coursera.org/verify/YZUNHIOAMKMK",
  },
  {
    id: 4,
    image: "/images/cert_cybersecurity.jpg",
    text: "Foundations of Cybersecurity",
    verifyUrl: "https://coursera.org/verify/Q0ZK1W6WHBTO",
  },
  { id: 10, image: "/images/cert_claude101.jpg", text: "Claude 101" },
  { id: 11, image: "/images/cert_claudecode101.jpg", text: "Claude Code 101" },
  { id: 13, image: "/images/cert_claudeplatform101.jpg", text: "Claude Platform 101" },
  { id: 14, image: "/images/cert_claudecowork.jpg", text: "Intro to Claude Cowork" },
];

// HCCDA + HCIA sit in the middle of the list; the carousel opens on HCIA, the exact middle one
const START_INDEX = Math.max(0, CERT_ITEMS.findIndex((c) => c.text === "HCIA Datacom"));

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Certificates() {
  return (
    <section id="certificates" className="relative py-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-cyan/[0.05] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 bottom-1/4 -z-10 h-[320px] w-[320px] rounded-full bg-teal/[0.04] blur-[100px]"
      />

      {/* ── Section header — centered ──────────────────────────────────── */}
      <div className="mx-auto w-full max-w-[1050px] mx-auto px-4 flex flex-col items-center text-center mb-16">
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.28em]" style={{ color: "#FFD700" }}>
          // certifications
        </p>
        <h2 className="mb-4 font-heading text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
          Validating skills through industry <span className="text-cyan">standards</span>.
        </h2>
        <p className="mx-auto max-w-[1050px] font-body text-xs leading-[1.75] text-body">
          A continuous pursuit of professional certifications in networking, security, and cloud infrastructure.
        </p>
      </div>

      {/* ── Carousel — full-width breakout, no vignettes ────────────────── */}
      <div
        className="relative w-screen left-1/2 -translate-x-1/2 mb-24"
        style={{ height: "460px" }}
      >
        <div className="absolute inset-0 flex justify-center items-center">
          <Carousel
            items={CERT_ITEMS}
            baseWidth={360}
            autoplay={false}
            autoplayDelay={3000}
            pauseOnHover={false}
            loop={false}
            initialIndex={START_INDEX}
          />
        </div>
      </div>
    </section>
  );
}
