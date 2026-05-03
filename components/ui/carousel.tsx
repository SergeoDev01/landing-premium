'use client';

import React, { JSX, useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────── types ─────────────────────────────────── */

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  icon: React.ReactNode;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;   // kept for API compat – not used (speed replaces it)
  pauseOnHover?: boolean;
  loop?: boolean;           // kept for API compat – always infinite
  round?: boolean;
  /** pixels per second of auto-scroll (default: 60) */
  speed?: number;
  /** Time between steps in ms (default: 3000) */
  stepDuration?: number;
  /** Time it takes to move in ms (default: 600) */
  moveDuration?: number;
}

/* ──────────────────────────────── default data ──────────────────────────────── */

const DEFAULT_ITEMS: CarouselItem[] = [
  { id: 1, title: 'Feature 1', description: 'Description of feature 1.', icon: null },
  { id: 2, title: 'Feature 2', description: 'Description of feature 2.', icon: null },
  { id: 3, title: 'Feature 3', description: 'Description of feature 3.', icon: null },
];

/* ──────────────────────────────── constants ─────────────────────────────────── */

const GAP = 24; // px between cards

/* ═══════════════════════════════════════════════════════════════════════════════
   InfiniteCarousel
   Strategy:
   - Render 3 repetitions of the items list end-to-end.
   - Drive a single `translateX` value via rAF.
   - The "live" range is the middle repetition [trackWidth, 2*trackWidth].
   - When we drift out of [trackWidth, 2*trackWidth] we silently teleport back
     by exactly ±trackWidth — the repeating pattern makes this invisible.
   - Drag offsets are accumulated on top of the rAF position.
═══════════════════════════════════════════════════════════════════════════════ */

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = true,
  pauseOnHover = true,
  speed = 60,
  stepDuration = 3000,
  moveDuration = 600,
}: CarouselProps): JSX.Element {
  const cardWidth  = baseWidth;
  const stride     = cardWidth + GAP;         // one card + gap
  const trackWidth = stride * items.length;   // one full repetition width

  /* We render [copy A | copy B (live) | copy C] and start inside copy B */
  const repeated = [...items, ...items, ...items];

  /* ── refs ── */
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const posRef       = useRef<number>(trackWidth); // start at beginning of copy B
  const lastTimeRef  = useRef<number>(0);
  const pausedRef    = useRef<boolean>(false);

  /* drag state – all mutable, no setState to avoid re-renders */
  const draggingRef      = useRef<boolean>(false);
  const dragStartXRef    = useRef<number>(0);
  const dragStartPosRef  = useRef<number>(0);
  const dragVelocityRef  = useRef<number>(0);
  const lastDragXRef     = useRef<number>(0);
  const lastDragTimeRef  = useRef<number>(0);
  const momentumRef      = useRef<number>(0);

  /* active dot index */
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const setActiveIdxThrottled = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── apply position to DOM ── */
  const applyTranslate = useCallback((pos: number) => {
    if (!wrapperRef.current) return;
    // Track is at left: 50%, so translateX(-pos) puts card's left edge at center.
    // We add cardWidth/2 to put the card's middle at center.
    wrapperRef.current.style.transform = `translateX(${-pos - cardWidth / 2}px)`;
  }, [cardWidth]);

  /* wrap helper used in drag handlers */
  const wrapPos = useCallback((pos: number): number => {
    if (pos < trackWidth)       return pos + trackWidth;
    if (pos >= 2 * trackWidth)  return pos - trackWidth;
    return pos;
  }, [trackWidth]);

  /* ── update active dot (throttled) ── */
  const updateDot = useCallback((pos: number) => {
    const idx = Math.round(((pos - trackWidth) % trackWidth) / stride);
    const safe = ((idx % items.length) + items.length) % items.length;
    activeIdxRef.current = safe;
    
    if (setActiveIdxThrottled.current) return;
    setActiveIdxThrottled.current = setTimeout(() => {
      setActiveIdx(safe);
      setActiveIdxThrottled.current = null;
    }, 50);
  }, [items.length, stride, trackWidth]);

  /* ── rAF loop – stepped "tick-tock" animation ── */
  const lastStepTimeRef = useRef<number>(0);
  const baseIdxRef = useRef<number>(0);

  useEffect(() => {
    const tick = (now: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = now;
        lastStepTimeRef.current = now;
        // Initialize baseIdx based on starting position
        baseIdxRef.current = Math.round((posRef.current - trackWidth) / stride);
      }
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (!draggingRef.current) {
        if (autoplay && !pausedRef.current) {
          const timeSinceLastStep = now - lastStepTimeRef.current;
          
          if (timeSinceLastStep >= stepDuration) {
            // "Tick-tock" move trigger
            baseIdxRef.current = (baseIdxRef.current + 1) % items.length;
            lastStepTimeRef.current = now;
          }
        }

        // Magnetic Attraction: Smoothly lerp towards the target card position
        const targetPos = trackWidth + baseIdxRef.current * stride;
        
        // Shortest path handling for the wrap-around
        let diff = targetPos - posRef.current;
        if (diff > trackWidth / 2) diff -= trackWidth;
        if (diff < -trackWidth / 2) diff += trackWidth;

        // "Magnetic" lerp - faster if further away, creating a snap feel
        posRef.current += diff * 0.12;

        // If we are very close, just snap to avoid micro-jitter
        if (Math.abs(diff) < 0.1) {
          posRef.current = targetPos;
        }
      } else {
        lastStepTimeRef.current = now;
      }

      if (posRef.current < trackWidth)           posRef.current += trackWidth;
      if (posRef.current >= 2 * trackWidth)      posRef.current -= trackWidth;

      applyTranslate(posRef.current);
      updateDot(posRef.current);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoplay, applyTranslate, updateDot, trackWidth, stride, stepDuration, moveDuration, items.length]);

  /* ── hover pause ── */
  const handleMouseEnter = () => { if (pauseOnHover) pausedRef.current = true;  };
  const handleMouseLeave = () => { pausedRef.current = false; };

  /* ── drag handlers ── */
  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current    = true;
    momentumRef.current    = 0;
    dragStartXRef.current  = e.clientX;
    dragStartPosRef.current = posRef.current;
    lastDragXRef.current   = e.clientX;
    lastDragTimeRef.current = performance.now();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const now   = performance.now();
    const dtMs  = now - lastDragTimeRef.current;
    const dx    = e.clientX - lastDragXRef.current;

    /* velocity for momentum: px/s */
    if (dtMs > 0) dragVelocityRef.current = (dx / dtMs) * 1000;

    lastDragXRef.current  = e.clientX;
    lastDragTimeRef.current = now;

    const totalDrag = e.clientX - dragStartXRef.current;
    posRef.current  = wrapPos(dragStartPosRef.current - totalDrag);
    applyTranslate(posRef.current);
    updateDot(posRef.current);
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    // Velocity-based Magnetic Snapping
    // If we were dragging fast, jump to next/prev card. Otherwise snap to nearest.
    const threshold = 150; // px/s
    if (Math.abs(dragVelocityRef.current) > threshold) {
      const direction = dragVelocityRef.current > 0 ? -1 : 1;
      baseIdxRef.current = (baseIdxRef.current + direction + items.length) % items.length;
    } else {
      baseIdxRef.current = Math.round(((posRef.current - trackWidth) % trackWidth) / stride);
    }
    
    momentumRef.current = 0; // We use magnetic lerp instead of momentum now
  };

  /* ── dot click: jump to card (smoothly via momentum) ── */
  const jumpToIndex = (idx: number) => {
    /* target position = start of copy B + idx * stride */
    const target = trackWidth + idx * stride;
    /* find shortest path in circular space */
    let delta = target - posRef.current;
    if (delta >  trackWidth / 2) delta -= trackWidth;
    if (delta < -trackWidth / 2) delta += trackWidth;
    /* use a large instant momentum so it glides there */
    momentumRef.current = -delta * 6; // approximate: will decay in ~0.3s
  };

  /* ─────────────────────────── render ─────────────────────────── */
  return (
    <div
      className="relative flex flex-col items-center w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* viewport: full width, clips overflow with edge fade */}
      <div
        className="overflow-hidden w-full"
        style={{ 
          height: 360,
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        {/* scrolling track */}
        <div
          ref={wrapperRef}
          className="flex h-full will-change-transform cursor-grab active:cursor-grabbing select-none relative left-1/2"
          style={{ width: repeated.length * stride }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {repeated.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="shrink-0 flex flex-col items-start justify-between rounded-[20px] bg-card/40 backdrop-blur-xl border border-white/10 overflow-hidden"
              style={{ width: cardWidth, height: '100%', marginRight: GAP }}
            >
              <div className="mb-6 p-8">
                <span className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-card border border-white/5">
                  {item.icon}
                </span>
              </div>
              <div className="p-8 pt-0">
                <div className="mb-3 font-black text-3xl text-foreground">{item.title}</div>
                <p className="text-lg text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="mt-8 flex gap-3">
        {items.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Aller à la carte ${idx + 1}`}
            onClick={() => jumpToIndex(idx)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              activeIdx === idx
                ? 'bg-white scale-125'
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
