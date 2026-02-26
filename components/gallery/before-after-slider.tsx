"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => observer.disconnect();
  }, []);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden bg-muted"
      style={{ cursor: "col-resize" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After image (full width, behind) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt={`${alt} — after`}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeSrc}
          alt={`${alt} — before`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: containerWidth || "100%" }}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        Before
      </span>
      <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
        After
      </span>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-lg"
        style={{ left: `${position}%` }}
      >
        <ChevronLeft className="h-4 w-4 -mr-1 text-primary" />
        <ChevronRight className="h-4 w-4 -ml-1 text-primary" />
      </div>
    </div>
  );
}
