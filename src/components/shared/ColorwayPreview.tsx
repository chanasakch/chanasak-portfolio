type Props = {
  kind: "stool" | "chair";
  frame: string;
  weaveA: string;
  weaveB: string;
  className?: string;
  title?: string;
};

/**
 * Line drawing of a woven seat that recolours instantly, so a buyer can see a
 * colourway before a sample exists. Pure SVG, no images.
 */
export function ColorwayPreview({ kind, frame, weaveA, weaveB, className = "", title }: Props) {
  const id = `weave-${kind}-${frame.replace("#", "")}-${weaveA.replace("#", "")}-${weaveB.replace("#", "")}`;
  const tube = { stroke: frame, strokeWidth: 9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

  return (
    <svg viewBox="0 0 320 400" className={className} role="img" aria-label={title ?? `${kind} colourway preview`}>
      <defs>
        <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill={weaveA} />
          <rect x="0" y="0" width="14" height="4.5" fill={weaveB} />
          <rect x="0" y="0" width="4.5" height="14" fill={weaveB} opacity="0.55" />
        </pattern>
      </defs>

      {kind === "stool" ? (
        <g>
          {/* back legs */}
          <line x1="104" y1="214" x2="96" y2="384" {...tube} opacity="0.55" />
          <line x1="226" y1="214" x2="234" y2="384" {...tube} opacity="0.55" />
          {/* woven back */}
          <path d="M104 132 Q104 92 144 92 L186 92 Q226 92 226 132 L226 178 L104 178 Z" fill={`url(#${id})`} />
          <path d="M104 186 L104 132 Q104 92 144 92 L186 92 Q226 92 226 132 L226 186" {...tube} />
          {/* arms */}
          <path d="M104 162 L70 162 Q58 162 58 176 L58 214" {...tube} />
          <path d="M226 162 L260 162 Q272 162 272 176 L272 214" {...tube} />
          {/* woven seat */}
          <path d="M66 214 L264 214 L246 246 L84 246 Z" fill={`url(#${id})`} />
          <path d="M58 214 L272 214" {...tube} />
          <path d="M80 246 L250 246" {...tube} />
          {/* front legs */}
          <line x1="80" y1="246" x2="70" y2="388" {...tube} />
          <line x1="250" y1="246" x2="260" y2="388" {...tube} />
          {/* footrest */}
          <line x1="74" y1="332" x2="256" y2="332" {...tube} />
          <line x1="99" y1="318" x2="231" y2="318" {...tube} opacity="0.55" />
          {/* wraps at the joints */}
          {[80, 250].map((x) => (
            <rect key={x} x={x - 9} y="246" width="18" height="12" rx="2" fill={weaveB} />
          ))}
        </g>
      ) : (
        <g>
          <line x1="106" y1="220" x2="100" y2="384" {...tube} opacity="0.55" />
          <line x1="214" y1="220" x2="220" y2="384" {...tube} opacity="0.55" />
          <path d="M106 90 Q106 54 160 54 Q214 54 214 90 L214 196 L106 196 Z" fill={`url(#${id})`} />
          <path d="M106 220 L106 90 Q106 54 160 54 Q214 54 214 90 L214 220" {...tube} />
          <path d="M106 168 L74 168 Q62 168 62 182 L62 236" {...tube} />
          <path d="M214 168 L246 168 Q258 168 258 182 L258 236" {...tube} />
          <path d="M70 236 L250 236 L238 270 L82 270 Z" fill={`url(#${id})`} />
          <path d="M62 236 L258 236" {...tube} />
          <path d="M78 270 L242 270" {...tube} />
          <line x1="78" y1="270" x2="70" y2="388" {...tube} />
          <line x1="242" y1="270" x2="250" y2="388" {...tube} />
          {[106, 214].map((x) => (
            <rect key={x} x={x - 9} y="156" width="18" height="14" rx="2" fill={weaveB} />
          ))}
        </g>
      )}
      <ellipse cx="160" cy="392" rx="120" ry="6" fill="currentColor" opacity="0.08" />
    </svg>
  );
}
