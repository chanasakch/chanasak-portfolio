"use client";

import { useEffect, useRef, useState } from "react";
import { photoSrcSet, photoUrl, type Photo as PhotoType } from "@/data/images";

type Props = {
  photo: PhotoType;
  /** Classes for the frame. Give it a size or an aspect ratio. */
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Override the alt text when the photo plays a specific role on the page */
  alt?: string;
  /** Show the alt text inside the frame if the image fails. Turn off for small thumbnails. */
  showAlt?: boolean;
};

/**
 * A photo inside a woven placeholder frame. The frame shows while the image
 * loads, and stays (with the alt text) if the image ever fails.
 */
export function Photo({ photo, className = "", imgClassName = "", sizes = "100vw", priority, alt, showAlt = true }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    const img = ref.current;
    if (!img || !img.complete) return;
    // The image may have finished before hydration attached the handlers.
    const next = img.naturalWidth > 0 ? "ready" : "failed";
    queueMicrotask(() => setState(next));
  }, []);

  return (
    <div className={`weave relative overflow-hidden ${className}`}>
      {state !== "failed" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={ref}
          src={photoUrl(photo, 1600)}
          srcSet={photoSrcSet(photo)}
          sizes={sizes}
          alt={alt ?? photo.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setState("ready")}
          onError={() => setState("failed")}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            state === "ready" ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
        />
      )}
      {state === "failed" && showAlt && (
        <span className="absolute inset-x-0 bottom-0 p-3 text-xs text-muted">{alt ?? photo.alt}</span>
      )}
    </div>
  );
}
