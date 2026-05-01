"use client";

import { useEffect, useRef } from "react";

const NAV_ITEMS = [
  { label: "Home",      href: "#home" },
  { label: "Services",  href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact",   href: "#contact" },
];

export default function Navbar() {
  const svgRef = useRef<SVGFETurbulenceElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  // Animation de la turbulence SVG pour l'effet liquide continu
  useEffect(() => {
    let running = true;

    const animate = (timestamp: number) => {
      if (!running) return;
      timeRef.current = timestamp * 0.00015;

      if (svgRef.current) {
        const baseFreqX = 0.012 + Math.sin(timeRef.current * 0.7) * 0.004;
        const baseFreqY = 0.018 + Math.cos(timeRef.current * 0.5) * 0.003;
        svgRef.current.setAttribute(
          "baseFrequency",
          `${baseFreqX.toFixed(5)} ${baseFreqY.toFixed(5)}`
        );
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleNav = (href: string) => {
    if (href.startsWith("#")) {
      document
        .querySelector<HTMLElement>(href)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    } else {
      window.location.assign(href);
    }
  };

  return (
    <>
      {/* Filtre SVG caché — génère la distorsion liquide */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter id="liquid-glass-filter" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              ref={svgRef}
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="3"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur
              in="displaced"
              stdDeviation="0.4"
              result="blurred"
            />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Navbar */}
      <nav
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          // Largeur adaptative selon le nombre de liens
          width: "min(680px, calc(100vw - 48px))",
          height: "52px",
          pointerEvents: "auto",
        }}
      >
        {/* Couche de distorsion liquide */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            filter: "url(#liquid-glass-filter)",
            // Fond semi-transparent qui capte le vrai fond de page
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(18px) saturate(180%) brightness(1.1)",
            WebkitBackdropFilter: "blur(18px) saturate(180%) brightness(1.1)",
            overflow: "hidden",
          }}
        >
          {/* Reflet interne haut */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
          />
          {/* Brillance interne */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 50% -20%, rgba(255,255,255,0.12) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Bordure glass */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "999px",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.25), " +
              "0 1px 0 rgba(255,255,255,0.1) inset, " +
              "0 -1px 0 rgba(0,0,0,0.15) inset",
            pointerEvents: "none",
          }}
        />

        {/* Liens de navigation */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            padding: "0 2rem",
          }}
        >
          {NAV_ITEMS.map(({ label, href }) => (
            <button
              key={href}
              onClick={() => handleNav(href)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255, 255, 255, 0.90)",
                fontSize: "clamp(0.75rem, 1.2vw, 0.875rem)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "4px 0",
                transition: "color 0.2s ease, text-shadow 0.2s ease",
                textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.textShadow =
                  "0 0 20px rgba(255,255,255,0.5), 0 1px 8px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.90)";
                e.currentTarget.style.textShadow = "0 1px 8px rgba(0,0,0,0.4)";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
