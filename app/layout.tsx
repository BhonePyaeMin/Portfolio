import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SideNav from "@/components/SideNav";
import dynamic from "next/dynamic";

// Loaded client-side only — Three.js / WebGL cannot run on the server
const LightPillar = dynamic(() => import("@/components/LightPillar"), {
  ssr: false,
});

// ─── Fonts ────────────────────────────────────────────────────────────────────

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Bhone Pyae Min — Aspiring Network Engineer",
  description: "Computer Engineering student focused on networking, cybersecurity, network automation, and AI/ML.",
};


// ─── Root layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} bg-bg font-body text-ink antialiased relative`}>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>

        {/* LightPillar Background — fixed, full-viewport, behind everything */}
        <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 0 }}>
          <LightPillar
            topColor="#134E4A"
            bottomColor="#04121A"
            intensity={0.5}
            rotationSpeed={0.7}
            glowAmount={0.004}
            pillarWidth={8.6}
            pillarHeight={1.7}
            noiseIntensity={0.3}
            pillarRotation={221}
            interactive={false}
            mixBlendMode="screen"
            quality="high"
          />
        </div>

        {/* Right-side Vertical Navigation */}
        <SideNav />

        <main id="main-content" className="relative z-10 flex min-h-screen flex-col overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
