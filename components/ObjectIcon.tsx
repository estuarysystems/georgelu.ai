"use client";

import { useEffect, useState, type CSSProperties } from "react";

type ObjectIconProps = {
  name: string;
  file: string;
  live?: boolean;
};

export function ObjectIcon({ name, file, live = false }: ObjectIconProps) {
  const [ready, setReady] = useState(false);
  const still = `/objects/${file}.png`;

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) setReady(true);
    };
    image.onerror = () => {
      if (!cancelled) setReady(false);
    };
    image.src = still;
    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [still]);

  return (
    <div
      className={`object-icon${ready ? " is-ready" : " is-pending"}${live && ready ? " is-live" : ""}`}
      style={
        ready
          ? ({
              "--object-still": `url(${still})`,
              "--object-strip": `url(/objects/${file}-strip.webp)`,
            } as CSSProperties)
          : undefined
      }
      role="img"
      aria-label={name}
    >
      {live && ready ? (
        <span className="viewfinder" aria-hidden="true">
          <i className="tl" />
          <i className="tr" />
          <i className="bl" />
          <i className="br" />
        </span>
      ) : null}
    </div>
  );
}
