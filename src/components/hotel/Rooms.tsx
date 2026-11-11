"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/shared/Photo";
import { rooms } from "@/data/hotel";
import { getProduct } from "@/data/products";

const fmt = new Intl.NumberFormat("en-US");

export function Rooms() {
  const [active, setActive] = useState(0);
  const room = rooms[active];

  return (
    <div>
      <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line" role="tablist" aria-label="Room types">
        {rooms.map((r, i) => (
          <button
            key={r.slug}
            id={`room-${r.slug}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="room-panel"
            onClick={() => setActive(i)}
            className={`-mb-px scroll-mt-24 border-b-2 pb-3 font-display text-[clamp(1.4rem,2.4vw,1.9rem)] transition-colors ${
              i === active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div id="room-panel" role="tabpanel" className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
        <Photo key={room.slug} photo={room.photo} className="aspect-[3/2] w-full rounded-[2px]" position={room.focus} sizes="(min-width: 1024px) 58vw, 100vw" />
        <div>
          <p className="max-w-[46ch] text-[17px] leading-[1.7]">{room.text}</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 text-[15px]">
            <div>
              <dt className="text-[13px] text-muted">Size</dt>
              <dd className="mt-0.5">{room.size} m²</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted">Bed</dt>
              <dd className="mt-0.5">{room.bed}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted">View</dt>
              <dd className="mt-0.5">{room.view}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-muted">From</dt>
              <dd className="tabular mt-0.5">฿{fmt.format(room.fromThb)} a night</dd>
            </div>
          </dl>
          <div className="mt-8">
            <p className="text-[13px] text-muted">Made in Thailand, in this room</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {room.furniture.map((slug) => {
                const p = getProduct(slug);
                if (!p) return null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/furniture/${slug}`}
                      className="inline-block rounded-full border border-line px-3 py-1.5 text-[13px] hover:border-ink"
                    >
                      {p.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <a href="#start" className="mt-8 inline-block rounded-[2px] bg-[var(--forest)] px-5 py-3 text-[15px] text-white">
            Request a {room.name}
          </a>
        </div>
      </div>
    </div>
  );
}
