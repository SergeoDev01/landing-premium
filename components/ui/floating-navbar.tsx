"use client";
import React, { type ReactNode, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        // Toujours visible en haut de page
        setVisible(true);
      } else {
        if (direction > 0) {
          // Scroll vers le bas → disparaît
          setVisible(false);
        } else {
          // Scroll vers le haut → réapparaît
          setVisible(true);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -150 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className={cn(
          "flex fixed top-10 inset-x-0 mx-auto z-[5000] items-center justify-center w-[95%] max-w-3xl",
          className
        )}
      >
        <div className="relative w-full group">
          {/* SVG Filter for Refraction/Distortion */}
          <svg className="hidden">
            <filter id="liquid-glass-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="liquid" />
              <feComposite in="SourceGraphic" in2="liquid" operator="atop" />
            </filter>
          </svg>

          {/* Main Liquid Glass Body */}
          <div 
            className="absolute inset-0 rounded-[2rem] overflow-hidden" 
            style={{
              backdropFilter: "blur(20px) saturate(180%) contrast(90%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%) contrast(90%)",
            }}
          >
            {/* Inner Refraction Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 mix-blend-overlay" />
            
            {/* Chromatic Aberration / Rainbow Edge */}
            <div className="absolute -inset-[1px] rounded-[2rem] border border-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.3)]">
              <div className="absolute inset-0 rounded-[2rem] opacity-40 bg-[conic-gradient(from_0deg,transparent,rgba(255,0,0,0.1),rgba(0,255,0,0.1),rgba(0,0,255,0.1),transparent)] blur-sm" />
            </div>
            
            {/* 3D Depth Highlights */}
            <div className="absolute inset-x-4 top-0 h-4 bg-gradient-to-b from-white/40 to-transparent rounded-t-full blur-[2px]" />
            <div className="absolute inset-x-8 bottom-0 h-2 bg-gradient-to-t from-white/10 to-transparent rounded-b-full blur-[1px]" />
          </div>

          {/* Outer Glass Border with Rainbow Glint */}
          <div className="absolute -inset-[0.5px] rounded-[2rem] border-[0.5px] border-white/30 dark:border-white/20 pointer-events-none" />

          {/* Content Container */}
          <div className="relative flex items-center justify-between gap-6 px-4 py-4 sm:px-8">
            <div className="flex items-center gap-4 sm:gap-10 flex-1 justify-center">
              {navItems.map((navItem, idx: number) => (
                <a
                  key={`link-${idx}`}
                  href={navItem.link}
                  className={cn(
                    "relative flex items-center gap-2.5 px-2 py-2 text-sm font-semibold tracking-wide transition-all duration-500",
                    "text-neutral-700/80 hover:text-black dark:text-neutral-200/80 dark:hover:text-white"
                  )}
                >
                  <span className="block sm:hidden text-lg">{navItem.icon}</span>
                  <span className="hidden sm:block text-[15px] uppercase">{navItem.name}</span>
                  
                  {/* Liquid Hover Indicator */}
                  <motion.span 
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                    layoutId="liquid-hover"
                  />
                </a>
              ))}
            </div>

            {/* Glass Divider */}
            <div className="h-10 w-[1.5px] bg-white/20 shadow-[0_0_8px_rgba(255,255,255,0.2)] skew-x-[-15deg]" />

            {/* Premium 3D Liquid Button */}
            <button className="relative group/btn px-8 py-3 rounded-2xl overflow-hidden transition-all duration-300 active:scale-95 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)]">
              {/* Button Glass Background */}
              <div className="absolute inset-0 bg-neutral-950 dark:bg-white transition-colors duration-300" />
              
              {/* Rainbow Shine over button */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-white/10 to-purple-500/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rotate-12 scale-150" />
              
              <span className="relative z-10 text-white dark:text-black font-bold text-sm uppercase tracking-tighter">
                Access
              </span>
              
              {/* Bottom Liquid Glint */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
