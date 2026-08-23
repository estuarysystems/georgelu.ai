"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { inter } from "@/app/fonts";
import { essayHref, homeHref, padFrame } from "@/lib/routes";
import { setEssaySurface } from "@/lib/surface";
import type { EssayMeta } from "@/lib/types";

type EssayViewProps = {
  current: EssayMeta;
  prev?: EssayMeta;
  next?: EssayMeta;
  children: ReactNode;
};

export function EssayView({ current, prev, next, children }: EssayViewProps) {
  const router = useRouter();
  const back = homeHref(current.shelf, current.slug);
  const closing = useRef(false);
  const [visible, setVisible] = useState(true);

  const closeToShelf = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setVisible(false);
    setEssaySurface(false);
    router.replace(back, { scroll: false });
    // Last-resort only. A short timeout races Next.js and full-reloads
    // into a blank ME shelf. Give the replace time to mount .stage.
    window.setTimeout(() => {
      if (!document.querySelector(".stage")) {
        window.location.replace(back);
      }
    }, 2000);
  }, [back, router]);

  useLayoutEffect(() => {
    setEssaySurface(true);
    router.prefetch(back);
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      closeToShelf();
    }
    window.addEventListener("keydown", onKey, true);
    return () => {
      setEssaySurface(false);
      window.removeEventListener("keydown", onKey, true);
    };
  }, [back, closeToShelf, router]);

  if (!visible) return null;

  return (
    <article className="essay" data-surface="essay">
      <header className="essay-bar">
        <Link
          className="essay-back"
          href={back}
          replace
          onClick={(event) => {
            event.preventDefault();
            closeToShelf();
          }}
        >
          esc
        </Link>
        <span className="essay-frame">
          {padFrame(current.frame)} of {padFrame(current.total)}
        </span>
      </header>
      <div className="essay-main">
        <h1 className="essay-title">{current.title}</h1>
        {current.dek?.trim() ? <p className="essay-dek">{current.dek}</p> : null}
        <div className={`prose ${inter.className}`}>{children}</div>
      </div>
      <nav className="essay-nav" aria-label="Siblings">
        {prev ? (
          <Link href={essayHref(prev.shelf, prev.slug)} replace>
            ← {prev.name.toLowerCase()}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="next" href={essayHref(next.shelf, next.slug)} replace>
            {next.name.toLowerCase()} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
