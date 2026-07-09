"use client";

import { useEffect, useState } from "react";

const DOCUMENT_TYPES = [
  "Carta d'identità",
  "Passaporto",
  "Patente di guida",
  "Permesso di soggiorno",
];

const CYCLE_INTERVAL_MS = 2000;

export default function DocumentTypeCycler() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) =>
      setReduceMotion(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const intervalId = setInterval(() => {
      setActiveIndex((index) => (index + 1) % DOCUMENT_TYPES.length);
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [reduceMotion]);

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
      {DOCUMENT_TYPES.map((type, index) => {
        const isActive = !reduceMotion && index === activeIndex;

        return (
          <li
            key={type}
            className={`whitespace-nowrap transition-all duration-500 ease-in-out ${
              isActive
                ? "text-base font-semibold text-dark"
                : "text-sm font-normal text-muted"
            }`}
          >
            {type}
          </li>
        );
      })}
    </ul>
  );
}
