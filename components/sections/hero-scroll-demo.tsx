"use client";

import React, { useEffect, useRef } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

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

  // Enregistrement du callback
  useEffect(() => {
    const drawFrame = (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

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
      const ctx = canvas.getContext("2d");
      if (!ctx || !img) return;

      if (!canvas.width || canvas.width === 300) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawnRef.current = useIdx;
    };

    registerCallback(drawFrame);
  }, [registerCallback]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full rounded-[10px] bg-black/60 object-cover"
      aria-hidden="true"
    />
  );
};

export function HeroScrollDemo() {
  return (
    <section className="relative">
      <ContainerScroll titleComponent={null}>
        {(registerCallback) => (
          <CanvasScrubber
            registerCallback={
              registerCallback as (cb: (progress: number) => void) => void
            }
          />
        )}
      </ContainerScroll>
    </section>
  );
}
