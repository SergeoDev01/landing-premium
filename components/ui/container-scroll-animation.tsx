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

    // Phase 1 : Redressement fluide et pondéré
    gsap.to(card, {
      rotateX: 0,
      scale: 1,
      y: 0,
      ease: "power2.out", 
      force3D: true,
      scrollTrigger: {
        trigger: triggerBox,
        start: "top bottom", 
        end: "center center", 
        scrub: 1, // Lissage pour une fluidité maximale
        invalidateOnRefresh: true,
      },
    });

    // Phase 2 : Pin de l'écran avec proxy de progression lissé
    const progressProxy = { value: 0 };
    gsap.to(progressProxy, {
      value: 1,
      ease: "none",
      onUpdate: () => {
        // On envoie la valeur lissée au canvas
        progressCallbackRef.current?.(progressProxy.value);
      },
      scrollTrigger: {
        trigger: triggerBox,
        start: "center center", 
        end: "+=100%", 
        pin: section, 
        pinSpacing: true, 
        scrub: 1, // Lissage (inertia) de 1 seconde pour une fluidité maximale
        anticipatePin: 1,
      }
    });

    // Phase 2b : Pin du shader optionnel
    const shaderWrapper = document.querySelector("#shader-wrapper");
    if (shaderWrapper) {
      ScrollTrigger.create({
        trigger: triggerBox,
        start: "center center",
        end: "+=100%",
        pin: shaderWrapper,
        pinSpacing: false,
      });
    }

    ScrollTrigger.refresh();

    ScrollTrigger.refresh();
  }, { scope: sectionRef });

  // Fournir le point de branchement à l'enfant sans re-render continu
  const registerCallback = useCallback((cb: (p: number) => void) => {
    progressCallbackRef.current = cb;
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative flex w-full h-[45rem] items-center justify-center overflow-x-clip px-4 md:h-[65rem] md:px-10"
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
