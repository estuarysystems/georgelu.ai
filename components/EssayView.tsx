"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { inter } from "@/app/fonts";
import { essayHref, homeHref, padFrame } from "@/lib/routes";
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

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      event.preventDefault();
      router.push(back);
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [back, router]);

  return (
    <article className="essay">
      <header className="essay-bar">
        <Link className="essay-back" href={back}>
          esc
        </Link>
        <span className="essay-frame">
          {padFrame(current.frame)} / {padFrame(current.total)}
        </span>
      </header>
      <div className="essay-main">
        <h1 className="essay-title">{current.title}</h1>
        {current.dek ? <p className="essay-dek">{current.dek}</p> : null}
        <div className={`prose ${inter.className}`}>{children}</div>
      </div>
      <nav className="essay-nav" aria-label="Siblings">
        {prev ? (
          <Link href={essayHref(prev.shelf, prev.slug)}>{prev.name.toLowerCase()}</Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="next" href={essayHref(next.shelf, next.slug)}>
            {next.name.toLowerCase()}
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
