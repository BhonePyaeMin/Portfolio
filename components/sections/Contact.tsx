"use client";

import { motion } from "framer-motion";
import { Mail, Briefcase } from "lucide-react";
import { ContactCard } from "@/components/ContactCard";

// ─── Custom brand SVGs ────────────────────────────────────────────────────────

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S9 17.44 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONTACTS = [
  {
    id: "email",
    label: "Email",
    value: "bhonepyaemin.tech@gmail.com",
    href: "mailto:bhonepyaemin.tech@gmail.com",
    icon: <Mail className="h-4 w-4" />,
    external: false,
    brandColor: "#EA4335",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "Let's connect",
    href: "https://www.linkedin.com/in/bhone-pyae-min-77314b434",
    icon: <LinkedInIcon />,
    external: true,
    brandColor: "#0A66C2",
  },
  {
    id: "github",
    label: "GitHub",
    value: "Explore open source code",
    href: "https://github.com/BhonePyaeMin",
    icon: <GitHubIcon />,
    external: true,
    brandColor: "#2DD4BF",
  },
  {
    id: "jobsdb",
    label: "JobsDB",
    value: "View job profile",
    href: "https://th.jobsdb.com/th/profiles/bhonepyae-min-ns7y634rgd",
    icon: <Briefcase className="h-4 w-4" />,
    external: true,
    brandColor: "#1A56CE",
  },
] as const;

// ─── Animation ────────────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Contact() {
  return (
    <>
      <section id="contact" className="relative py-28">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 mx-auto h-[500px] w-[500px] rounded-full bg-cyan/[0.04] blur-[130px]"
        />

        <div className="mx-auto w-full max-w-[1050px] mx-auto px-4 text-center">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col items-center text-center"
          >
            {/* ── Heading ── */}
            <motion.p variants={fadeUp} className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em]" style={{ color: "#FFD700" }}>
              {"// CONTACT"}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mb-5 font-heading text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl"
            >
              Have a project in mind? <span className="text-teal">Let's connect.</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mb-14 mx-auto max-w-[1050px] font-body text-sm leading-relaxed text-body sm:text-xs"
            >
              Open to discussing new projects, networking opportunities, and potential collaborations.
            </motion.p>

            {/* ── Contact cards ── */}
            <motion.div
              variants={fadeUp}
              className="grid w-full max-w-2xl grid-cols-1 gap-4 text-left"
            >
              {CONTACTS.map(({ id, label, value, href, icon, external, brandColor }) => (
                <ContactCard
                  key={id}
                  label={label}
                  value={value}
                  href={href}
                  icon={icon}
                  external={external}
                  brandColor={brandColor}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1050px] flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row">
          <p className="font-body text-xs text-body">
            © 2026{" "}
            <span className="text-ink">Bhone Pyae Min.</span>
            {" "}All rights reserved.
          </p>
          <p className="font-body text-xs text-muted">
            Built with Next.js · TypeScript · Tailwind CSS · Framer Motion · Three.js
          </p>
        </div>
      </footer>
    </>
  );
}
