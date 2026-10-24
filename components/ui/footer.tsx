"use client";

import { ArrowUpRight, Clock3, MapPin, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { motion, type Variants } from "motion/react";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const riseItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.6, bounce: 0 },
  },
};

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  badgeText?: string;
  newsletterHeading?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  brandName?: string;
  brandLogo?: ReactNode;
  navColumns?: FooterColumn[];
  copyright?: string;
  location?: string;
  time?: string;
  socialLinks?: { label: string; href: string }[];
}

export default function Footer({
  badgeText = "Créé par Sergeo Limta",
  newsletterHeading = "Les dernières nouveautés,\nastuces et mises à jour,\ndans votre boîte mail chaque semaine.",
  newsletterPlaceholder = "Votre adresse email",
  newsletterButtonText = "S'abonner",
  brandName = "Sergeo Bg_Remover",
  brandLogo = <Sparkles className="size-8 fill-[#0033ff]/20 text-[#0033ff]" />,
  navColumns = [
    {
      title: "Produit",
      links: [
        { label: "Fonctionnalités", href: "#services" },
        { label: "Portfolio", href: "#portfolio" },
        { label: "Comment ça marche", href: "#how-it-works" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Ressources",
      links: [
        { label: "Centre d'aide", href: "#contact" },
        { label: "API", href: "#contact" },
        { label: "Statut du système", href: "#" },
        { label: "Nouveautés", href: "#services" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Mentions légales", href: "#" },
        { label: "Conditions d'utilisation", href: "#" },
        { label: "Confidentialité", href: "#" },
        { label: "Cookies", href: "#" },
      ],
    },
  ],
  copyright = "© 2026 Sergeo Bg_Remover. Tous droits réservés.",
  location = "Paris, France",
  time = "00:00:00",
  socialLinks = [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
}: FooterProps) {
  return (
    <motion.footer
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="relative w-full overflow-hidden bg-[#05070B] font-sans text-neutral-300 selection:bg-[#0033ff]/30"
    >
      {/* ── Background Effects ── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Bottom Left Glow */}
        <div className="absolute bottom-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-[#0033ff]/25 blur-[120px]" />

        {/* Dotted Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl flex-col justify-between px-6 pb-10 pt-20 md:px-12">
        {/* ── Top Section: Newsletter ── */}
        <div className="mb-24 flex flex-col items-start justify-between gap-12 lg:flex-row lg:gap-24">
          <motion.div variants={riseItem} className="max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#0033ff] shadow-[0_0_12px_rgba(0,51,255,0.8)]" />
              <span className="text-sm font-medium text-neutral-200">
                {badgeText}
              </span>
            </div>
            <h2 className="text-4xl font-light leading-[1.1] tracking-tight text-white whitespace-pre-line md:text-5xl lg:text-5xl">
              {newsletterHeading}
            </h2>
          </motion.div>

          <motion.div variants={riseItem} className="w-full max-w-md lg:mt-auto">
            <form
              className="flex h-14 w-full"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder={newsletterPlaceholder}
                className="flex-1 border border-neutral-800 border-r-0 bg-neutral-950 px-5 text-sm text-white transition-shadow focus:outline-none focus:ring-1 focus:ring-[#0033ff] placeholder:text-neutral-500"
                required
              />
              <button
                type="submit"
                className="flex h-full cursor-pointer items-center justify-center gap-2 border border-[#1a44ff] bg-[#0033ff] px-6 text-sm font-medium text-white transition-colors"
              >
                {newsletterButtonText}
                <ArrowUpRight size={16} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* ── Middle Section: Links & Logo ── */}
        <div className="mb-24 flex flex-col items-start justify-between gap-16 md:flex-row">
          <motion.div variants={riseItem} className="flex items-center gap-2 text-white">
            {brandLogo}
            <span className="text-xl font-medium tracking-tight md:text-2xl">
              {brandName}
            </span>
          </motion.div>

          <div className="grid grid-cols-2 gap-12 md:grid-cols-3 md:gap-24 lg:gap-32">
            {navColumns.map((col, idx) => (
              <motion.div
                key={idx}
                variants={riseItem}
                className="flex flex-col gap-6"
              >
                <h4 className="text-xs font-semibold tracking-wider text-white uppercase">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-4">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom Section: Meta ── */}
        <motion.div
          variants={riseItem}
          className="flex flex-col items-center justify-between gap-6 pt-8 text-xs text-neutral-500 md:flex-row"
        >
          <p>{copyright}</p>

          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-16">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
            <span className="flex items-center gap-2 tracking-widest tabular-nums">
              <Clock3 size={16} />
              <span>{time}</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href.startsWith("http")
                    ? "noreferrer noopener"
                    : undefined
                }
                className="transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
