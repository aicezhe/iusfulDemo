"use client";

import { useEffect, useState } from "react";

const DOCUMENT_TYPES = [
  "Carta d'identità",
  "Passaporto",
  "Patente di guida",
  "Permesso di soggiorno",
];

const CYCLE_INTERVAL_MS = 2000;
const TRANSITION_MS = 650;
const ITEM_HEIGHT_PX = 28;
const CONTAINER_HEIGHT_PX = 76;
const CENTER_OFFSET_PX = (CONTAINER_HEIGHT_PX - ITEM_HEIGHT_PX) / 2;

const FIRST_INDEX = 1;
const LAST_INDEX = DOCUMENT_TYPES.length;

// Loop track: [last item copy, ...real items, first item copy] so the
// wheel always has a neighbour to peek at above and below, and can be
// snapped seamlessly from the trailing copy back to the real first item.
const TRACK_ITEMS = [
  DOCUMENT_TYPES[DOCUMENT_TYPES.length - 1],
  ...DOCUMENT_TYPES,
  DOCUMENT_TYPES[0],
];

export default function DocumentTypeCycler() {
  const [position, setPosition] = useState(FIRST_INDEX);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) =>
      setReduceMotion(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const intervalId = setInterval(() => {
      setPosition((current) => current + 1);
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [reduceMotion]);

  useEffect(() => {
    if (position !== LAST_INDEX + 1) return;

    const timeoutId = setTimeout(() => {
      setTransitionEnabled(false);
      setPosition(FIRST_INDEX);
    }, TRANSITION_MS);

    return () => clearTimeout(timeoutId);
  }, [position]);

  useEffect(() => {
    if (transitionEnabled) return;

    const frameId = requestAnimationFrame(() => setTransitionEnabled(true));
    return () => cancelAnimationFrame(frameId);
  }, [transitionEnabled]);

  if (reduceMotion) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {DOCUMENT_TYPES.map((type) => (
          <li key={type} className="whitespace-nowrap text-sm text-muted">
            {type}
          </li>
        ))}
      </ul>
    );
  }

  const translateY = CENTER_OFFSET_PX - position * ITEM_HEIGHT_PX;

  return (
    <div
      className="relative mx-auto w-full max-w-[230px] overflow-hidden"
      style={{ height: CONTAINER_HEIGHT_PX }}
      role="status"
      aria-live="off"
    >
      <div
        className={
          transitionEnabled ? "transition-transform duration-[650ms] ease-in-out" : ""
        }
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {TRACK_ITEMS.map((type, index) => (
          <div
            key={`${type}-${index}`}
            className="flex items-center justify-center whitespace-nowrap"
            style={{ height: ITEM_HEIGHT_PX }}
          >
            <span
              className={
                index === position
                  ? "text-base font-semibold text-dark transition-all duration-500"
                  : "text-sm font-normal text-muted/50 transition-all duration-500"
              }
            >
              {type}
            </span>
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-2"
        style={{
          background: "linear-gradient(to bottom, var(--color-bg), transparent)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2"
        style={{
          background: "linear-gradient(to top, var(--color-bg), transparent)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
