"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { BadgeCheck } from "lucide-react";

import { BrandSequenceText } from "@/components/ui/brand-sequence-text";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export function ShaderDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scrollOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7], [0.2, 1, 1]);
  const scrollY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{ opacity: scrollOpacity, y: scrollY }} 
        className="h-full w-full"
      >
        <div className="relative h-full w-full overflow-hidden">
          <ShaderAnimation startDelayMs={1000} />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-6">
            <div className="flex min-h-[96px] w-full items-center justify-center md:min-h-[156px]">
              <BrandSequenceText
                startDelayMs={2000}
                className="px-2 text-center font-moduline text-[clamp(1.5rem,6vw,4.4rem)] font-bold uppercase leading-none tracking-[-0.01em] text-primary [font-variant-ligatures:none] drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                cursorClassName="text-primary"
              />
            </div>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/70 bg-transparent px-6 py-2.5 text-base font-semibold text-emerald-300"
            >
              <BadgeCheck className="h-5 w-5" />
              Gratuit
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
