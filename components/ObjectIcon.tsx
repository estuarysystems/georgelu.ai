"use client";

import { useEffect, useState, type CSSProperties } from "react";

type ObjectIconProps = {
  name: string;
  file: string;
  live?: boolean;
};

export function ObjectIcon({ name, file, live = false }: ObjectIconProps) {
  const [stillReady, setStillReady] = useState(false);
  const [stripReady, setStripReady] = useState(false);
  const still = `/objects/${file}.png`;
  const strip = `/objects/${file}-strip.webp`;

  useEffect(() => {
    let cancelled = false;
    setStillReady(false);
    setStripReady(false);

    const stillImage = new Image();
    stillImage.onload = () => {
      if (!cancelled) setStillReady(true);
    };
    stillImage.onerror = () => {
      if (!cancelled) setStillReady(false);
    };
    stillImage.src = still;

    const stripImage = new Image();
    stripImage.onload = () => {
      if (!cancelled) setStripReady(true);
    };
    stripImage.onerror = () => {
      if (!cancelled) setStripReady(false);
    };
    stripImage.src = strip;

    return () => {
      cancelled = true;
      stillImage.onload = null;
      stillImage.onerror = null;
      stripImage.onload = null;
      stripImage.onerror = null;
    };
  }, [still, strip]);

  const show = stillReady;
  const animate = live && stillReady && stripReady;

  return (
    <div
      className={`object-icon${show ? " is-ready" : " is-pending"}${animate ? " is-live" : ""}`}
      style={
        show
          ? ({
              "--object-still": `url(${still})`,
              "--object-strip": `url(${strip})`,
            } as CSSProperties)
          : undefined
      }
      role="img"
      aria-label={name}
    >
      {live && show ? (
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
