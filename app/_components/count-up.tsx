"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

// Reduced-motion / no-IntersectionObserver fast path: snap to final value
// without going through useEffect setState (which React 19 flags as a
// cascading-render anti-pattern). Detect once at module-load on the client.
function shouldSkipAnimation(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof IntersectionObserver === "undefined") return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1400,
  className = "",
}: Props) {
  // useState initializer runs once — no render cascade. SSR returns 0 then
  // the client's first render decides whether to snap or animate.
  const [n, setN] = useState<number>(() => (shouldSkipAnimation() ? to : 0));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (shouldSkipAnimation()) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={`num ${className}`}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}
