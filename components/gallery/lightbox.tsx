"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BeforeAfterSlider } from "./before-after-slider";

interface LightboxProps {
  images: string[];
  alt: string;
  initialIndex: number;
  onClose: () => void;
  /** If provided, a before/after slider is shown as the first slide. */
  beforeImage?: string;
}

export function Lightbox({
  images,
  alt,
  initialIndex,
  onClose,
  beforeImage,
}: LightboxProps) {
  // When beforeImage is provided, index 0 = slider, 1+ = regular images
  const totalSlides = beforeImage ? images.length + 1 : images.length;
  const [index, setIndex] = useState(beforeImage ? 0 : initialIndex);
  const hasMultiple = totalSlides > 1;

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? totalSlides - 1 : i - 1));
  }, [totalSlides]);

  const next = useCallback(() => {
    setIndex((i) => (i === totalSlides - 1 ? 0 : i + 1));
  }, [totalSlides]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasMultiple) prev();
      if (e.key === "ArrowRight" && hasMultiple) next();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, prev, next, hasMultiple]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  const isSliderSlide = beforeImage && index === 0;
  const imageIndex = beforeImage ? index - 1 : index;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 cursor-pointer text-white transition-colors hover:text-white/80"
        aria-label="Close lightbox"
      >
        <X className="h-7 w-7" />
      </button>

      {/* Previous arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Content */}
      <div
        className="flex max-h-[85vh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isSliderSlide ? (
          <div className="w-full max-w-3xl">
            <BeforeAfterSlider
              beforeSrc={beforeImage}
              afterSrc={images[0]}
              alt={alt}
            />
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={images[imageIndex]}
            alt={`${alt} — ${imageIndex + 1} of ${images.length}`}
            className="max-h-[85vh] max-w-[90vw] select-none object-contain"
            draggable={false}
          />
        )}
      </div>

      {/* Next arrow */}
      {hasMultiple && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Slide counter */}
      {hasMultiple && (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
          {isSliderSlide ? "Before & After" : `${imageIndex + 1} / ${images.length}`}
        </span>
      )}
    </div>
  );
}
