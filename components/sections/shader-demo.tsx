"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";

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
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-8">
            <div className="flex min-h-[96px] w-full items-center justify-center md:min-h-[156px]">
              <BrandSequenceText
                startDelayMs={2000}
                className="px-2 text-center font-moduline text-[clamp(1.5rem,6vw,4.4rem)] font-bold uppercase leading-none tracking-[-0.01em] text-primary [font-variant-ligatures:none] drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                cursorClassName="text-primary"
              />
            </div>
            <div className="flex flex-col items-center gap-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/70 bg-transparent px-6 py-2.5 text-base font-semibold text-emerald-300">
                <BadgeCheck className="h-5 w-5" />
                Gratuit
              </span>
              <button
                type="button"
                onClick={() =>
                  document
                    .querySelector<HTMLElement>("#contact")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="group pointer-events-auto inline-flex items-center gap-3 rounded-full bg-primary px-10 py-4 text-base font-bold tracking-wide text-primary-foreground uppercase shadow-[0_0_40px_hsl(var(--primary)/0.45)] transition-all hover:shadow-[0_0_70px_hsl(var(--primary)/0.7)] hover:brightness-110"
              >
                Supprimer un arrière-plan
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-sm text-neutral-400">
                Sans inscription&nbsp;·&nbsp;Résultat en moins d&apos;une seconde
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
