"use client";

import React, { useEffect, useRef } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Carousel, { CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";

const FRAME_COUNT = 21;

const frameUrl = (index: number) =>
  `/images/sequence/f_${(index + 90).toString().padStart(5, "0")}.webp`;

type CanvasScrubberProps = {
  registerCallback: (cb: (progress: number) => void) => void;
};

const CanvasScrubber = ({ registerCallback }: CanvasScrubberProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnRef = useRef<number>(-1);

  // Préchargement des images en batches
  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const onFirstReady = (img: HTMLImageElement) => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (canvas && img.naturalWidth && img.naturalHeight) {
        if (!canvas.width || canvas.width === 300) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
        }
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        lastDrawnRef.current = 0;
      }
    };

    const loadOne = (i: number) => {
      const img = new window.Image();
      img.decoding = "async";
      if (i < 4) {
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
          "high";
      }
      if (i === 0) img.onload = () => onFirstReady(img);
      img.src = frameUrl(i);
      images[i] = img;
    };

    const INITIAL = Math.min(20, FRAME_COUNT);
    for (let i = 0; i < INITIAL; i++) loadOne(i);

    const BATCH = 20;
    let cursor = INITIAL;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const loadNext = () => {
      if (cancelled) return;
      const end = Math.min(FRAME_COUNT, cursor + BATCH);
      for (let i = cursor; i < end; i++) loadOne(i);
      cursor = end;
      if (cursor < FRAME_COUNT) timer = setTimeout(loadNext, 80);
    };
    timer = setTimeout(loadNext, 200);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Enregistrement du callback
  useEffect(() => {

    const drawFrame = (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!ctxRef.current) {
        ctxRef.current = canvas.getContext("2d");
      }
      const ctx = ctxRef.current;

      const frameIdx = Math.min(
        FRAME_COUNT - 1,
        Math.floor(Math.max(0, Math.min(1, progress)) * FRAME_COUNT)
      );

      const isLoaded = (i: number) => {
        const img = imagesRef.current[i];
        return !!img && img.complete && img.naturalWidth > 0;
      };

      let useIdx = frameIdx;
      if (!isLoaded(useIdx)) {
        let found = -1;
        for (let d = 1; d < FRAME_COUNT; d++) {
          if (useIdx - d >= 0 && isLoaded(useIdx - d)) {
            found = useIdx - d;
            break;
          }
          if (useIdx + d < FRAME_COUNT && isLoaded(useIdx + d)) {
            found = useIdx + d;
            break;
          }
        }
        if (found === -1) return;
        useIdx = found;
      }

      if (lastDrawnRef.current === useIdx) return;
      const img = imagesRef.current[useIdx];
      if (!ctx || !img) return;

      if (!canvas.width || canvas.width === 300) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawnRef.current = useIdx;
    };

    registerCallback(drawFrame);
  }, [registerCallback]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full rounded-[10px] bg-black/60 object-cover [will-change:transform]"
      aria-hidden="true"
    />
  );
};

const softwareFeatures: CarouselItem[] = [
  {
    id: 1,
    title: "IA de Pointe",
    description: "Suppression d'arrière-plan instantanée grâce à nos algorithmes d'apprentissage profond ultra-précis.",
    icon: <Image src="/icone/auto_awesome_motion_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" width={28} height={28} alt="IA" className="invert brightness-0" />,
  },
  {
    id: 2,
    title: "Traitement par Lots",
    description: "Traitez des centaines d'images simultanément pour gagner un temps précieux sur vos projets.",
    icon: <Image src="/icone/file_copy_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" width={28} height={28} alt="Lots" className="invert brightness-0" />,
  },
  {
    id: 3,
    title: "Exportation HD",
    description: "Conservez chaque détail de vos images avec une exportation haute résolution sans perte de qualité.",
    icon: <Image src="/icone/image_arrow_up_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" width={28} height={28} alt="Export" className="invert brightness-0" />,
  },
  {
    id: 4,
    title: "Performance Maximale",
    description: "Optimisé pour la rapidité, obtenez vos résultats en moins d'une seconde par image.",
    icon: <Image src="/icone/speed_2_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" width={28} height={28} alt="Speed" className="invert brightness-0" />,
  },
  {
    id: 5,
    title: "Remplacement Fond",
    description: "Changez instantanément l'arrière-plan par une couleur unie ou une image personnalisée.",
    icon: <Image src="/icone/background_replace_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" width={28} height={28} alt="Background" className="invert brightness-0" />,
  }
];

export function HeroScrollDemo() {
  return (
    <section className="relative overflow-x-clip">
      <ContainerScroll titleComponent={null}>
        {(registerCallback) => (
          <CanvasScrubber
            registerCallback={
              registerCallback as (cb: (progress: number) => void) => void
            }
          />
        )}
      </ContainerScroll>

      {/* Section Carrousel */}
      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center pb-32 pt-20">
        <h2 className="mb-16 px-4 text-center text-4xl font-bold tracking-tighter sm:text-5xl md:text-7xl">
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            Fonctionnalités
          </span>
        </h2>
        
        <div style={{ height: '500px', position: 'relative', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Carousel
            items={softwareFeatures}
            baseWidth={560}
            autoplay={true}
            pauseOnHover={true}
            stepDuration={2500}
            moveDuration={400}
          />
        </div>
      </div>
    </section>
  );
}
