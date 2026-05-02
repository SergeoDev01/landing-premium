"use client";

import React, { useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export type ContainerScrollProps = {
  titleComponent: string | React.ReactNode;
  children:
    | React.ReactNode
    | ((
        registerCallback: (cb: (progress: number) => void) => void
      ) => React.ReactNode);
};

export const ContainerScroll = ({
  titleComponent,
  children,
}: ContainerScrollProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressCallbackRef = useRef<((p: number) => void) | null>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const triggerBox = triggerRef.current;

    if (!section || !card || !triggerBox) return;

    // Configuration initiale de la carte en 3D
    gsap.set(card, {
      rotateX: 50,
      scale: 0.88,
      y: 80,
      transformOrigin: "center top",
    });

    // Phase 1 : Redressement progressif avec rebond élastique 
    gsap.to(card, {
      rotateX: 0,
      scale: 1,
      y: 0,
      ease: "back.out(1.5)", // Restauration de l'effet 3D d'origine
      scrollTrigger: {
        trigger: triggerBox,
        start: "top bottom", 
        end: "center center", 
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });

    // Phase 2 : Pin de l'écran (Figé au milieu exact de l'écran)
    ScrollTrigger.create({
      trigger: triggerBox, // On utilise la boîte statique pour éviter les sursauts
      start: "center center", 
      end: "+=100%", // Scroll plus court pour coller aux 20 images
      pin: section, 
      pinSpacing: true, 
      anticipatePin: 1, // Empêche le sursaut lors du pin ou unpin
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressCallbackRef.current?.(self.progress);
      },
    });

    // Phase 2b : Pin du shader (sans affecter le layout)
    const shaderWrapper = document.querySelector("#shader-wrapper");
    if (shaderWrapper) {
      ScrollTrigger.create({
        trigger: triggerBox,
        start: "center center",
        end: "+=100%",
        pin: shaderWrapper,
        pinSpacing: false, // Empêche tout décalage du DOM
      });
    }

    ScrollTrigger.refresh();
  }, { scope: sectionRef });

  // Fournir le point de branchement à l'enfant sans re-render continu
  const registerCallback = useCallback((cb: (p: number) => void) => {
    progressCallbackRef.current = cb;
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex w-full h-[60rem] items-center justify-center overflow-x-clip px-4 md:h-[80rem] md:px-10"
    >
      <div
        className="relative mx-auto w-full max-w-[1800px] py-0 md:py-8"
        style={{ perspective: "800px" }}
      >
        {titleComponent && (
          <div className="mx-auto max-w-5xl text-center">{titleComponent}</div>
        )}

        <div ref={triggerRef} className="mx-auto -mt-28 w-[85%] max-w-6xl aspect-[16/10] md:-mt-36" style={{ transformStyle: "preserve-3d" }}>
          <div
            ref={cardRef}
            className="h-full w-full rounded-[30px] bg-card/70 p-2 shadow-2xl backdrop-blur md:p-6"
            style={{
              boxShadow: "0 16px 50px hsl(var(--foreground) / 0.18)",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <div className="h-full w-full overflow-hidden rounded-2xl bg-[#0033FF] p-1 md:rounded-2xl md:p-4">
              {typeof children === "function"
                ? children(registerCallback)
                : children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
