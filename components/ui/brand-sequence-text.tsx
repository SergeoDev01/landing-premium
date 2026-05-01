"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BrandSequenceTextProps = {
  className?: string;
  cursorClassName?: string;
  startDelayMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function BrandSequenceText({
  className = "",
  cursorClassName = "",
  startDelayMs = 0,
}: BrandSequenceTextProps) {
  const [text, setText] = useState("");
  const [cursorIndex, setCursorIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const textRef = useRef("");
  const cursorRef = useRef(0);

  const beforeCursor = useMemo(() => text.slice(0, cursorIndex), [text, cursorIndex]);
  const afterCursor = useMemo(() => text.slice(cursorIndex), [text, cursorIndex]);

  const setTextAndCursor = (nextText: string, nextCursor: number) => {
    textRef.current = nextText;
    cursorRef.current = nextCursor;
    setText(nextText);
    setCursorIndex(nextCursor);
  };

  useEffect(() => {
    let cancelled = false;
    let blinkInterval: ReturnType<typeof setInterval> | null = null;

    const setCursorBlink = () => {
      if (blinkInterval) clearInterval(blinkInterval);
      blinkInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 520);
    };

    const typeAtEnd = async (target: string, speed = 102) => {
      while (!cancelled && textRef.current.length < target.length) {
        const next = target.slice(0, textRef.current.length + 1);
        setTextAndCursor(next, next.length);
        await sleep(speed);
      }
    };

    const deleteFromEndTo = async (target: string, speed = 58) => {
      while (!cancelled && textRef.current.length > target.length) {
        const next = textRef.current.slice(0, -1);
        setTextAndCursor(next, next.length);
        await sleep(speed);
      }
    };

    const moveCursorBackward = async (targetIndex: number, speed = 78) => {
      while (!cancelled && cursorRef.current > targetIndex) {
        const next = cursorRef.current - 1;
        setTextAndCursor(textRef.current, next);
        await sleep(speed);
      }
    };

    const moveCursorForward = async (targetIndex: number, speed = 78) => {
      while (!cancelled && cursorRef.current < targetIndex) {
        const next = cursorRef.current + 1;
        setTextAndCursor(textRef.current, next);
        await sleep(speed);
      }
    };

    const typeAtCursor = async (value: string, speed = 108) => {
      for (let i = 0; i < value.length; i += 1) {
        if (cancelled) return;
        const index = cursorRef.current;
        const next = `${textRef.current.slice(0, index)}${value[i]}${textRef.current.slice(index)}`;
        setTextAndCursor(next, index + 1);
        await sleep(speed);
      }
    };

    const run = async () => {
      setCursorBlink();
      if (startDelayMs > 0) {
        await sleep(startDelayMs);
      }
      while (!cancelled) {
        setTextAndCursor("", 0);
        await sleep(150);

        await typeAtEnd("Sergeo Bg_Remover");
        await sleep(1100);

        await deleteFromEndTo("Sergeo");
        await sleep(240);

        await moveCursorBackward(0);
        await sleep(120);

        // Ajoute l'espace a l'arriere de "Sergeo" => " Sergeo"
        await typeAtCursor(" ", 48);
        setTextAndCursor(textRef.current, 0);
        await sleep(120);

        // Ecrit derriere "Sergeo" pour obtenir "Creer par Sergeo"
        await typeAtCursor("Créer par");
        await sleep(650);

        // Avance le curseur a la fin, puis ajoute " Limta"
        await moveCursorForward(textRef.current.length, 72);
        await typeAtCursor(" Limta", 102);

        // Garde l'etat final quelques secondes, puis efface tout.
        await sleep(3000);
        await deleteFromEndTo("", 52);
        await sleep(350);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (blinkInterval) clearInterval(blinkInterval);
    };
  }, [startDelayMs]);

  return (
    <h1 className={`inline-flex max-w-[94vw] items-baseline justify-center whitespace-nowrap ${className}`}>
      <span>{beforeCursor}</span>
      <span
        className={`ml-1 inline-block w-[0.7em] text-left ${showCursor ? "opacity-100" : "opacity-0"} ${cursorClassName}`}
      >
        |
      </span>
      <span>{afterCursor}</span>
    </h1>
  );
}
