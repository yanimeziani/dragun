"use client";

import { useEffect, useState } from "react";

type Props = {
  start?: number;
  perTickMin?: number;
  perTickMax?: number;
  intervalMs?: number;
  className?: string;
};

export function LiveCounter({
  start = 4_217_803.18,
  perTickMin = 22,
  perTickMax = 118,
  intervalMs = 1500,
  className = "",
}: Props) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => v + perTickMin + Math.random() * (perTickMax - perTickMin));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, perTickMin, perTickMax]);

  return (
    <span className={`num ${className}`}>
      {value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
