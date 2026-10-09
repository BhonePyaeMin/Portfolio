// ─── Types ────────────────────────────────────────────────────────────────────

export type FilterCategory = "AI/ML" | "Computer Vision" | "Network" | "Cybersecurity" | "Mobile" | "Web";
export type FilterKey = "All" | FilterCategory;

export interface ProjectMedia {
  /** Self-hosted video file (served from /public), played by the built-in player */
  video?: { src: string; poster?: string; silent?: boolean };
  /** PDF: `src` is the downloadable file, `pages` are pre-rendered page images shown in the reader */
  pdf?: { src: string; title: string; pages: string[]; pageWidth: number; pageHeight: number };
}

export interface ProjectLink {
  label: string;
  href: string;
  /** Set when a card has several live demos / repos; `label` then names the sub-project */
  kind?: "live" | "github";
}

export function linkKind(link: ProjectLink): "live" | "github" | undefined {
  if (link.kind) return link.kind;
  if (link.label === "Live") return "live";
  if (link.label === "GitHub") return "github";
  return undefined;
}

export interface Project {
  id: string;
  title: string;
  year: number;
  tags: string[];
  /** Which top-level filter buckets this project belongs to */
  categories: FilterCategory[];
  /** Short text shown on the row and in the popup */
  description: string;
  /** One muted line under the title in the popup */
  subtitle?: string;
  /** Buttons in the popup, e.g. the GitHub repository */
  links?: ProjectLink[];
  /** When present, the project row is clickable and opens the media modal */
  media?: ProjectMedia;
}

export const GITHUB_URL = "https://github.com/BhonePyaeMin";

// ─── Filter pills ─────────────────────────────────────────────────────────────

export const FILTER_KEYS: FilterKey[] = ["All", "AI/ML", "Computer Vision", "Network", "Cybersecurity", "Mobile", "Web"];

// ─── Project data ─────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "network-config",
    title: "AI-Powered Network Configuration Automation",
    year: 2026,
    categories: ["Network", "AI/ML"],
    tags: ["Networking", "GNS3", "AI/ML", "Python", "Automation", "Docker"],
    subtitle: "AI topology scanning · GNS3 live configuration · Automated verification",
    description:
      "Upload a network diagram and Gemini Vision turns it into a GNS3 topology; Python then configures every router and PC over Telnet — IPs, interfaces, OSPF and static routes — and verifies the network with automated ping tests.",
    links: [{ label: "GitHub", href: "https://github.com/BhonePyaeMin/AI-Powered-Network-Configuration-Automation" }],
    media: {
      pdf: {
        src: "/docs/ai-network-config.pdf",
        title: "Workflow & implementation guide",
        pages: Array.from(
          { length: 8 },
          (_, i) => `/docs/ai-network-config/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
  {
    id: "study-assistant",
    title: "AI-Based Study Assistant",
    year: 2026,
    categories: ["AI/ML", "Web"],
    tags: ["AI/ML", "Python", "HTML", "CSS", "JavaScript", "Gemini API", "Flask", "PostgreSQL/SQLite", "Docker"],
    description:
      "A Flask web app where students chat with a Gemini-powered AI tutor, turn notes or PDFs into quizzes and flashcards, plan study tasks, and track progress on a personal dashboard.",
    links: [{ label: "GitHub", href: "https://github.com/BhonePyaeMin/Study_Ai" }],
    media: {
      pdf: {
        src: "/docs/study-assistant-guide.pdf",
        title: "User & setup guide",
        pages: Array.from(
          { length: 15 },
          (_, i) => `/docs/study-assistant-guide/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
  {
    id: "network-simulator",
    title: "NetLab 3D — Network & Cybersecurity Simulator",
    year: 2026,
    categories: ["Network", "Cybersecurity"],
    tags: ["Three.js", "React", "TypeScript", "Vite", "Cisco-style CLI"],
    description:
      "A browser-based, first-person 3D networking lab. Cable up routers, switches and PCs, configure them through a Cisco-style CLI (single-area OSPF, RIP, NAT, ACLs, VLANs, DHCP), then complete security missions (ARP spoofing, MAC flooding, port scans) detected by a built-in simulated IDS.",
    links: [
      { label: "GitHub", href: "https://github.com/BhonePyaeMin/netlab-3d" },
      { label: "Live", href: "https://bhonepyaemin.com/netlab/" },
    ],
    media: {
      pdf: {
        src: "/docs/netlab3d.pdf",
        title: "Project guide",
        pages: Array.from(
          { length: 17 },
          (_, i) => `/docs/netlab3d/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
  {
    id: "asset-borrowing",
    title: "Asset Borrowing System",
    year: 2025,
    categories: ["Mobile"],
    tags: ["Flutter", "Dart", "Android", "Figma", "Role-Based Access"],
    description:
      "A multi-role Flutter app where students, lecturers and staff browse assets, request and approve loans, handle returns and review borrowing history — backed by a Node.js/Express API and MySQL in Docker.",
    links: [{ label: "GitHub", href: "https://github.com/BhonePyaeMin/asset_borrowing_system" }],
    media: {
      video: {
        src: "/videos/asset-borrowing.mp4",
        poster: "/videos/asset-borrowing-poster.jpg",
        silent: true,
      },
      pdf: {
        src: "/docs/asset-borrowing-system.pdf",
        title: "Android emulator walkthrough",
        pages: Array.from(
          { length: 10 },
          (_, i) => `/docs/asset-borrowing/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1224,
        pageHeight: 1584,
      },
    },
  },
  {
    id: "network-port-scanner",
    title: "Network Port Scanner",
    year: 2026,
    categories: ["Network", "Cybersecurity"],
    tags: ["Python", "Sockets", "TCP/IP", "unittest"],
    subtitle: "Network security tool · TCP port scanning & banner grabbing",
    description:
      "A dependency-free Python 3 TCP port scanner that finds open ports on a host and grabs each service's banner — standard library only, covered by 10 automated unit tests.",
    links: [{ label: "GitHub", href: "https://github.com/BhonePyaeMin/network-port-scanner" }],
    media: {
      pdf: {
        src: "/docs/network-port-scanner.pdf",
        title: "Step by step guide",
        pages: Array.from(
          { length: 6 },
          (_, i) => `/docs/network-port-scanner/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1224,
        pageHeight: 1584,
      },
    },
  },
  {
    id: "gns3-dashboard",
    title: "GNS3 Live Topology & Resilience Dashboard",
    year: 2026,
    categories: ["Network"],
    tags: ["Python", "Flask", "GNS3", "NetworkX", "vis-network", "REST API"],
    subtitle: "Network Automation: Live Topology Monitoring & Failure Detection",
    description:
      "A live dashboard that polls a running GNS3 lab through its REST API every 3 seconds, redraws the topology in the browser, and uses graph theory (bridge edges) to highlight single points of failure within seconds of a change.",
    links: [{ label: "GitHub", href: "https://github.com/BhonePyaeMin/GNS3-Live-Topology-Resilience-Dashboard" }],
    media: {
      pdf: {
        src: "/docs/gns3-dashboard.pdf",
        title: "Project report",
        pages: Array.from(
          { length: 7 },
          (_, i) => `/docs/gns3-dashboard/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
  {
    id: "restaurant-ordering-system",
    title: "Restaurant Ordering System",
    year: 2026,
    categories: ["Web"],
    tags: ["C#", "ASP.NET Core", "SQLite", "Node.js", "Express", "Socket.IO", "HTML", "CSS", "JavaScript"],
    subtitle: "ใบเตย · Pandan Leaf Thai Kitchen",
    description:
      "A full-stack QR-code restaurant ordering system built with C# and Node.js — guests order and pay (PromptPay QR) from their phone, the kitchen sees orders instantly, and staff manage the menu, tables and bills from a live admin dashboard.",
    links: [{ label: "GitHub", href: "https://github.com/BhonePyaeMin/Restaurant-Ordering-System" }],
    media: {
      pdf: {
        src: "/docs/restaurant-ordering-system.pdf",
        title: "Project overview",
        pages: Array.from(
          { length: 4 },
          (_, i) => `/docs/restaurant-ordering-system/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
  {
    id: "mailshield",
    title: "MailShield — Email Header Analyzer",
    year: 2026,
    categories: ["Cybersecurity", "Web"],
    tags: ["Cybersecurity", "Python", "Flask", "Tesseract OCR", "HTML", "CSS", "JavaScript"],
    description:
      "A local, offline-first email header analyzer that flags spoofing, phishing and authentication anomalies — SPF/DKIM/DMARC checks, lookalike-domain and link-mismatch detection, plus OCR screenshot scanning.",
    links: [
      { label: "GitHub", href: "https://github.com/BhonePyaeMin/Mail-Shield" },
      { label: "Live", href: "https://bhonepyaemin.com/mailshield/" },
    ],
    media: {
      pdf: {
        src: "/docs/mailshield.pdf",
        title: "Project overview",
        pages: Array.from(
          { length: 3 },
          (_, i) => `/docs/mailshield/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
  {
    id: "spider-lily",
    title: "Spider Lily & Lotus Pond — Gesture-Controlled 3D Web Apps",
    year: 2026,
    categories: ["Computer Vision", "AI/ML", "Web"],
    tags: [
      "Computer Vision",
      "AI/ML",
      "MediaPipe",
      "Three.js",
      "WebGL",
      "JavaScript",
      "Interaction Logic",
      "3D Modeling",
    ],
    subtitle: "Two hand-tracked 3D flower scenes · Computer Vision · Interactive 3D",
    description:
      "Two gesture-controlled 3D flower scenes — a glowing spider lily and a pond of twelve lotuses. MediaPipe tracks your hand through the webcam; spread your fingers to bloom them live in Three.js, with no video uploaded.",
    links: [
      { kind: "live", label: "Spider Lily", href: "https://bhonepyaemin.com/spiderlily/" },
      { kind: "live", label: "Lotus Pond", href: "https://bhonepyaemin.com/lotus/" },
      { kind: "github", label: "Spider Lily", href: "https://github.com/BhonePyaeMin/Spider-Lily" },
      { kind: "github", label: "Lotus Pond", href: "https://github.com/BhonePyaeMin/Lotus" },
    ],
    media: {
      pdf: {
        src: "/docs/spiderlily-lotus.pdf",
        title: "Project overview",
        pages: Array.from(
          { length: 5 },
          (_, i) => `/docs/spiderlily-lotus/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
  {
    id: "letter",
    title: "Letter — An Interactive Apology Game",
    year: 2026,
    categories: ["Web"],
    tags: ["HTML", "CSS", "JavaScript", "Canvas API", "Game Logic"],
    subtitle: "Canvas Mini-Game · Typewriter Letter · Interactive Storytelling",
    description:
      "An interactive apology letter: catch falling hearts in a canvas mini-game to unlock an envelope, then watch the letter type itself out — with a “No” button that runs away from your cursor.",
    links: [
      { label: "GitHub", href: "https://github.com/BhonePyaeMin/Letter" },
      { label: "Live", href: "https://bhonepyaemin.com/letter/" },
    ],
    media: {
      pdf: {
        src: "/docs/letter.pdf",
        title: "Project overview",
        pages: Array.from(
          { length: 3 },
          (_, i) => `/docs/letter/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
  {
    id: "spendwise",
    title: "SpendWise — Secure Expense Tracker",
    year: 2026,
    categories: ["Web", "Cybersecurity"],
    tags: [
      "Java",
      "Spring Boot",
      "Spring Security",
      "Thymeleaf",
      "Spring Data JPA",
      "H2 Database",
      "BCrypt",
      "JUnit 5",
      "GitHub Actions",
      "Audit Logging",
      "Backup & Restore",
    ],
    subtitle: "Multi-user personal finance app · Java 17 & Spring Boot · Runs in about 220 MB of RAM",
    description:
      "SpendWise is a personal finance web app I built to track daily spending on a low-spec laptop. Each user has a private account protected by BCrypt-hashed passwords, CSRF protection, and lockout after five failed logins. Every query is scoped to the signed-in user, and every change is written to an audit log.\n\nIt goes beyond a basic CRUD tracker: monthly budgets with over-budget warnings, a daily allowance, recurring bills, savings goals, spending insights, a trash with restore, and backup and restore through CSV files. It runs in about 220 MB of RAM using an embedded H2 database, with no Docker or database server.",
    links: [{ label: "GitHub", href: "https://github.com/BhonePyaeMin/secure-expense-tracker" }],
    media: {
      pdf: {
        src: "/docs/spendwise.pdf",
        title: "Project guide: setup, workflow & architecture",
        pages: Array.from(
          { length: 7 },
          (_, i) => `/docs/spendwise/page-${String(i + 1).padStart(2, "0")}.webp`
        ),
        pageWidth: 1191,
        pageHeight: 1684,
      },
    },
  },
];


