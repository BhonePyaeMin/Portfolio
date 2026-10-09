
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ─── Animation ────────────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ─── Terminal card ────────────────────────────────────────────────────────────

function TerminalCard() {
  return (
    <div className="rounded-xl border border-border bg-black/40 backdrop-blur-sm overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-black/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green/70" />
        <span className="ml-3 font-mono text-xs text-muted">cisco-cli</span>
      </div>

      {/* CLI body */}
      <div className="p-4 font-mono text-[13px] leading-snug overflow-x-auto whitespace-pre">
        <span className="text-[#4AFF91]">BhonePyaeMin&gt;</span> <span className="text-[#00E5FF]">enable</span>
        <br />
        <span className="text-[#4AFF91]">BhonePyaeMin#</span> <span className="text-[#00E5FF]">show version</span>
        <br />
        <span className="text-[#FFD166]">  Role..........</span>  <span className="text-[#F5F7FA]">Computer Engineering Student</span>
        <br />
        <span className="text-[#FFD166]">  University....</span>  <span className="text-[#F5F7FA]">Mae Fah Luang University</span>
        <br />
        <span className="text-[#FFD166]">  GPA...........</span>  <span className="text-[#F5F7FA]">3.39</span>
        <br />
        <span className="text-[#FFD166]">  Location......</span>  <span className="text-[#F5F7FA]">Chiang Rai, Thailand</span>
        <br />
        <br />
        <span className="text-[#4AFF91]">BhonePyaeMin#</span> <span className="text-[#00E5FF]">show interfaces status</span>
        <br />
        <span className="text-[#FFD166]">  Port     Focus Area          Status</span>
        <br />
        <span className="text-[#FFD166]">  Gi0/1    </span><span className="text-[#F5F7FA]">Networking          </span><span className="text-[#4AFF91]">up</span>
        <br />
        <span className="text-[#FFD166]">  Gi0/2    </span><span className="text-[#F5F7FA]">Cybersecurity       </span><span className="text-[#4AFF91]">up</span>
        <br />
        <span className="text-[#FFD166]">  Gi0/3    </span><span className="text-[#F5F7FA]">AI / ML             </span><span className="text-[#4AFF91]">up</span>
        <br />
        <span className="text-[#FFD166]">  Gi0/4    </span><span className="text-[#F5F7FA]">Automation          </span><span className="text-[#4AFF91]">up</span>
        <br />
        <br />
        <span className="text-[#4AFF91]">BhonePyaeMin#</span> <span className="text-[#00E5FF]">show ip route</span>
        <br />
        <span className="text-[#FFD166]">  Status:</span> <span className="text-[#F5F7FA]">0.0.0.0/0 via [Open to New Opportunities]</span>
        <br />
        <span className="text-[#4AFF91]">BhonePyaeMin#</span>
        <span
          className="ml-1 inline-block w-[2px] h-[1em] align-middle bg-[#00E5FF]"
          style={{ animation: "terminal-blink 1s step-end infinite" }}
          aria-hidden="true"
        />
      </div>

      <style>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Focus tags ───────────────────────────────────────────────────────────────

const FOCUS_TAGS: { label: string; color: string; bg: string }[] = [
  { label: "Network Engineering", color: "text-teal", bg: "bg-teal/[0.06] border-teal/20" },
  { label: "Cybersecurity",       color: "text-teal", bg: "bg-teal/[0.06] border-teal/20" },
  { label: "AI / ML",             color: "text-teal", bg: "bg-teal/[0.06] border-teal/20" },
  { label: "Automation",          color: "text-teal", bg: "bg-teal/[0.06] border-teal/20" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <section id="about" className="relative py-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/2 rounded-full bg-blue/[0.04] blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/4 -z-10 h-[350px] w-[350px] -translate-x-1/3 rounded-full bg-violet/[0.04] blur-[100px]"
      />

      <div className="mx-auto w-full max-w-[1050px] mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* ── Section label ────────────────────────────────────────────── */}
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: "#FFD700" }}
          >
            {"// about me"}
          </motion.p>

          {/* ── Headline ─────────────────────────────────────────────────── */}
          <motion.h2
            variants={fadeUp}
            className="mb-12 font-heading text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl"
          >
            Building systems, exploring networks, and turning ideas into{" "}
            <span className="text-teal">practical solutions.</span>
          </motion.h2>

          {/* ── Two-column body (stacks below 820px) ─────────────────────── */}
          <motion.div
            variants={fadeUp}
            className="mx-auto grid max-w-[1050px] grid-cols-1 gap-10 lg:grid-cols-2"
            style={{ alignItems: "start" }}
          >
            {/* LEFT — sticky terminal card */}
            <div className="lg:sticky lg:top-28">
              <TerminalCard />
            </div>

            {/* RIGHT — paragraphs + tags */}
            <div className="flex flex-col gap-7">
              <p className="font-body text-sm sm:text-base leading-[1.85] text-body">
                I'm a computer engineering student focused on networking, cybersecurity, and the automation that ties them together. My work spans network simulation, AI-assisted configuration, and full-stack development — connecting infrastructure fundamentals with the software that runs on top of them.
              </p>
              <p className="font-body text-sm sm:text-base leading-[1.85] text-body">
                I approach every project by taking it apart first — a router, a topology, a script that isn't working — then rebuilding it until I understand every layer underneath. Whether it's a Cisco CLI session, a GNS3 topology, or an AI tool that automates the boring parts, I care about knowing why it works, not just that it does.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {FOCUS_TAGS.map(({ label, color, bg }) => (
                  <span
                    key={label}
                    className={[
                      "inline-flex items-center rounded-full border px-2.5 py-1",
                      "font-mono text-xs font-medium tracking-wide",
                      color,
                      bg,
                    ].join(" ")}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
