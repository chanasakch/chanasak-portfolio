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
  /** CSS object-position, for photos whose subject is off-centre */
  position?: string;
};

/**
 * A photo inside a quiet placeholder frame. The frame shows while the image
 * loads and keeps the layout steady.
 */
export function Photo({ photo, className = "", imgClassName = "", sizes = "100vw", priority, alt, position }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = ref.current;
    // The image may have finished before hydration attached the handler.
    if (img?.complete && img.naturalWidth > 0) queueMicrotask(() => setReady(true));
  }, []);

  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative "}overflow-hidden bg-soft ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={photoUrl(photo, 1600)}
        srcSet={photoSrcSet(photo)}
        sizes={sizes}
        alt={alt ?? photo.alt}
        width={photo.w}
        height={photo.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setReady(true)}
        style={position ? { objectPosition: position } : undefined}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        } ${imgClassName}`}
      />
    </div>
  );
}
