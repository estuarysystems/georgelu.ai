import type { CSSProperties } from "react";

// v0 placeholder object-icons. The spec calls for photographed / rendered
// objects as 60-frame strips; these line-art stand-ins keep the layout and
// interaction honest until real object assets exist.
export function ObjectIcon({
  object,
  size = 144,
}: {
  object: string;
  size?: number;
}) {
  const style: CSSProperties = { width: size, height: size };
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 96 96",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (object) {
    case "shirt":
      return (
        <svg {...common} style={style}>
          <path d="M30 20 L18 30 L26 40 L30 36 L30 76 L66 76 L66 36 L70 40 L78 30 L66 20 L58 20 C58 27 38 27 38 20 Z" />
          <path d="M20 12 L76 12" opacity="0.5" />
        </svg>
      );
    case "folder":
      return (
        <svg {...common} style={style}>
          <path d="M14 30 L40 30 L48 38 L82 38 L82 74 L14 74 Z" />
          <path d="M14 30 L14 24 L34 24 L40 30" />
          <path d="M26 52 L58 52" opacity="0.5" />
        </svg>
      );
    case "pokecard":
      return (
        <svg {...common} style={style}>
          <rect x="26" y="14" width="44" height="64" rx="5" />
          <rect x="32" y="20" width="32" height="24" rx="2" opacity="0.6" />
          <circle cx="48" cy="58" r="8" opacity="0.6" />
          <path d="M40 58 L56 58" opacity="0.6" />
        </svg>
      );
    case "card":
    default:
      return (
        <svg {...common} style={style}>
          <rect x="24" y="16" width="48" height="64" rx="6" />
          <path d="M48 30 L40 46 L48 42 L56 46 Z" opacity="0.7" />
          <path d="M36 62 L60 62" opacity="0.5" />
          <path d="M40 70 L56 70" opacity="0.4" />
        </svg>
      );
  }
}
