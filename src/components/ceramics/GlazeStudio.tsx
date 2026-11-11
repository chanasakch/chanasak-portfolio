"use client";

import { useMemo, useState } from "react";
import { glazes, type Glaze } from "@/data/ceramics";

/** Deterministic pseudo-random points, so server and browser draw the same speckles. */
function speckles(seed: number, n: number) {
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: n }, () => ({ x: 70 + rand() * 180, y: 60 + rand() * 300, r: 0.6 + rand() * 1.6 }));
}

function Vessel({ glaze }: { glaze: Glaze }) {
  const dots = useMemo(() => speckles(glaze.id.length * 977, 70), [glaze.id]);
  const [light, body, pool] = glaze.colors;
  const id = `g-${glaze.id}`;
  // A bottle form: narrow neck, round shoulder, foot ring left bare.
  const shape =
    "M140 40 L180 40 L178 92 C178 110 196 122 214 134 C262 166 276 214 270 262 C264 318 230 352 206 362 L114 362 C90 352 56 318 50 262 C44 214 58 166 106 134 C124 122 142 110 142 92 Z";
  return (
    <svg viewBox="0 0 320 400" className="h-full w-full" role="img" aria-label={`Bottle vase in ${glaze.name} glaze`}>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={pool} />
          <stop offset="0.35" stopColor={light} />
          <stop offset="0.6" stopColor={body} />
          <stop offset="1" stopColor={pool} />
        </linearGradient>
        <linearGradient id={`${id}-drip`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={pool} stopOpacity="0" />
          <stop offset="1" stopColor={pool} stopOpacity="0.55" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={shape} />
        </clipPath>
      </defs>
      <ellipse cx="160" cy="370" rx="104" ry="8" fill="currentColor" opacity="0.1" />
      <path d={shape} fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-clip)`}>
        {/* glaze stops above the foot, showing bare clay */}
        <rect x="40" y="338" width="240" height="30" fill="#c8a07a" />
        <path d="M40 338 Q80 330 110 340 T170 336 T230 342 T280 336 L280 344 L40 344 Z" fill={pool} opacity="0.9" />
        <rect x="40" y="250" width="240" height="90" fill={`url(#${id}-drip)`} />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={glaze.speckle} opacity="0.55" />
        ))}
        <ellipse cx="118" cy="200" rx="14" ry="70" fill="#fff" opacity="0.18" />
      </g>
      <ellipse cx="160" cy="41" rx="20" ry="4" fill={pool} />
    </svg>
  );
}

export function GlazeStudio() {
  const [active, setActive] = useState(glazes[0]);

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
      <div className="flex aspect-square items-center justify-center rounded-[2px] bg-soft p-10 text-ink transition-colors">
        <div className="h-full w-[70%]">
          <Vessel glaze={active} />
        </div>
      </div>
      <div className="max-w-[46ch]">
        <fieldset>
          <legend className="text-[14px] text-muted">Choose a glaze</legend>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {glazes.map((g) => {
              const selected = g.id === active.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActive(g)}
                  className={`flex items-center gap-3 rounded-[2px] border px-3 py-2.5 text-left text-[14px] transition-colors ${
                    selected ? "border-ink bg-white/60" : "border-line hover:border-ink/40"
                  }`}
                >
                  <span
                    aria-hidden
                    className="size-6 shrink-0 rounded-full ring-1 ring-black/10"
                    style={{ background: `radial-gradient(circle at 35% 35%, ${g.colors[0]}, ${g.colors[1]} 55%, ${g.colors[2]})` }}
                  />
                  {g.name}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="mt-8" aria-live="polite">
          <h3 className="font-display text-[2.2rem] leading-none">
            {active.name} <span className="ml-1 font-body text-[1rem] text-muted">{active.thai}</span>
          </h3>
          <p className="mt-4 text-[16px] leading-[1.7]">{active.text}</p>
          <p className="mt-3 text-[14px] text-muted">{active.firing}</p>
        </div>
      </div>
    </div>
  );
}
