"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ObjectIcon } from "./ObjectIcon";
import { essayHref, homeHref } from "@/lib/routes";
import type { EssayMeta, Shelf, ShelfId } from "@/lib/types";

const HINT_KEY = "xmb-hint-dismissed";

type HomeStageProps = {
  catalog: Shelf[];
};

function shelfIndexOf(catalog: Shelf[], id?: string) {
  const index = catalog.findIndex((shelf) => shelf.id === id);
  return index === -1 ? 0 : index;
}

function itemIndexOf(shelf: Shelf, slug?: string) {
  const index = shelf.items.findIndex((item) => item.slug === slug);
  return index === -1 ? 0 : index;
}

function readFocus(catalog: Shelf[]) {
  const params = new URLSearchParams(window.location.search);
  const shelfParam = params.get("shelf") ?? undefined;
  const itemParam = params.get("item") ?? undefined;
  const nextShelf = shelfIndexOf(catalog, shelfParam);
  return {
    shelfIndex: nextShelf,
    itemIndex: itemIndexOf(catalog[nextShelf], itemParam),
  };
}

export function HomeStage({ catalog }: HomeStageProps) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const [shelfIndex, setShelfIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [mode, setMode] = useState<"shelf" | "item">("shelf");
  const [hint, setHint] = useState(true);

  const shelf = catalog[shelfIndex];
  const item = shelf.items[itemIndex] ?? shelf.items[0];
  const nowLine = catalog
    .find((entry) => entry.id === "me")
    ?.items.find((entry) => entry.slug === "now")?.status;

  const dismissHint = useCallback(() => {
    setHint(false);
    window.sessionStorage.setItem(HINT_KEY, "1");
  }, []);

  const syncUrl = useCallback((nextShelf: ShelfId, nextSlug: string) => {
    const url = homeHref(nextShelf, nextSlug);
    if (`${window.location.pathname}${window.location.search}` === url) return;
    window.history.replaceState(null, "", url);
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem(HINT_KEY) === "1") setHint(false);

    const focus = readFocus(catalog);
    setShelfIndex(focus.shelfIndex);
    setItemIndex(focus.itemIndex);
    setMode("shelf");
    const focused = catalog[focus.shelfIndex].items[focus.itemIndex];
    if (focused) syncUrl(focused.shelf, focused.slug);

    stageRef.current?.focus({ preventScroll: true });
  }, [catalog, syncUrl]);

  useEffect(() => {
    function onPop() {
      const focus = readFocus(catalog);
      setShelfIndex(focus.shelfIndex);
      setItemIndex(focus.itemIndex);
      setMode("shelf");
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [catalog]);

  const focusShelf = useCallback(
    (next: number, nextItem = 0) => {
      const clamped = (next + catalog.length) % catalog.length;
      const nextShelf = catalog[clamped];
      const itemCount = nextShelf.items.length;
      const resolved = ((nextItem % itemCount) + itemCount) % itemCount;
      setShelfIndex(clamped);
      setItemIndex(resolved);
      setMode("shelf");
      syncUrl(nextShelf.id, nextShelf.items[resolved].slug);
      dismissHint();
    },
    [catalog, dismissHint, syncUrl],
  );

  const focusItem = useCallback(
    (next: number) => {
      const count = shelf.items.length;
      if (next < 0 || next >= count) return false;
      setItemIndex(next);
      setMode("item");
      syncUrl(shelf.id, shelf.items[next].slug);
      dismissHint();
      return true;
    },
    [dismissHint, shelf, syncUrl],
  );

  const openItems = useCallback(() => {
    setMode("item");
    if (item) syncUrl(shelf.id, item.slug);
    dismissHint();
  }, [dismissHint, item, shelf, syncUrl]);

  const closeItems = useCallback(() => {
    if (mode !== "item") return;
    setMode("shelf");
    if (item) syncUrl(shelf.id, item.slug);
    dismissHint();
  }, [dismissHint, item, mode, shelf, syncUrl]);

  const openEssay = useCallback(
    (target: EssayMeta) => {
      dismissHint();
      router.push(essayHref(target.shelf, target.slug));
    },
    [dismissHint, router],
  );

  const moveVertical = useCallback(
    (direction: 1 | -1) => {
      if (mode === "item") {
        const nextItem = itemIndex + direction;
        if (focusItem(nextItem)) return;
        focusShelf(shelfIndex + direction, direction > 0 ? 0 : -1);
        return;
      }
      focusShelf(shelfIndex + direction, direction > 0 ? 0 : -1);
    },
    [focusItem, focusShelf, itemIndex, mode, shelfIndex],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveVertical(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveVertical(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        if (mode === "shelf") openItems();
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (item) openEssay(item);
      } else if (event.key === "ArrowLeft" || event.key === "Escape") {
        if (event.repeat) return;
        event.preventDefault();
        closeItems();
      }
    }

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [closeItems, item, mode, moveVertical, openEssay, openItems]);

  const siblings = useMemo(
    () => ({
      above: shelf.items[itemIndex - 1],
      below: shelf.items[itemIndex + 1],
    }),
    [itemIndex, shelf.items],
  );

  return (
    <div
      ref={stageRef}
      className="stage"
      data-mode={mode}
      role="application"
      aria-label="George Lu"
      tabIndex={-1}
    >
      <div className="stage-breath">
        <div className="stage-weave">
          <div className="shelves">
            {catalog.map((entry, index) => {
              const active = index === shelfIndex;
              const current = active ? item : entry.items[0];
              const whisper = !active && entry.id === "hobby" ? current?.status : undefined;
              return (
                <section
                  key={entry.id}
                  className="shelf"
                  style={{ "--i": index } as CSSProperties}
                  aria-current={active ? "true" : undefined}
                >
                  <button
                    className="shelf-label"
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => focusShelf(index)}
                  >
                    {entry.id}
                  </button>
                  <div className="shelf-body">
                    {whisper ? <p className="shelf-whisper">{whisper}</p> : null}
                    {active && current ? (
                      <>
                        {siblings.above ? (
                          <Sibling item={siblings.above} place="above" open={mode === "item"} />
                        ) : null}
                        <article className="item is-open">
                          <Link
                            className="item-hit"
                            href={essayHref(current.shelf, current.slug)}
                            onClick={dismissHint}
                          >
                            <ObjectIcon name={current.name} file={current.object} live />
                            <div className="item-copy">
                              <p className="item-name">{current.name}</p>
                              {current.inline === "bio" ? null : (
                                <p className="item-title">{current.title}</p>
                              )}
                              {current.status && current.inline !== "bio" ? (
                                <p className="item-status">{current.status}</p>
                              ) : null}
                              {current.inline === "bio" ? (
                                <BioCard now={nowLine} />
                              ) : current.blurb ? (
                                <p className="item-blurb">{current.blurb}</p>
                              ) : null}
                            </div>
                          </Link>
                        </article>
                        {siblings.below ? (
                          <Sibling item={siblings.below} place="below" open={mode === "item"} />
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
      <div className="stage-grain" aria-hidden="true" />
      {hint ? (
        <div className="hint">
          <div className="hint-chevrons" aria-hidden="true">
            <span>⌃</span>
            <span>⌄</span>
          </div>
          <div className="hint-copy">↑↓ shelves · ←→ items</div>
        </div>
      ) : null}
    </div>
  );
}

function Sibling({
  item,
  place,
  open,
}: {
  item: EssayMeta;
  place: "above" | "below";
  open: boolean;
}) {
  return (
    <article
      className={`item is-sibling is-${place}${open ? " is-shown" : ""}`}
      aria-hidden={open ? undefined : true}
    >
      <Link
        className="item-hit"
        href={essayHref(item.shelf, item.slug)}
        tabIndex={open ? undefined : -1}
      >
        <ObjectIcon name={item.name} file={item.object} />
        <div className="item-copy">
          <p className="item-name">{item.name}</p>
          <p className="item-title">{item.title}</p>
          {item.status ? <p className="item-status">{item.status}</p> : null}
        </div>
      </Link>
    </article>
  );
}

function BioCard({ now }: { now?: string }) {
  return (
    <div className="bio-card">
      <p>
        George Lu. Bay Area. I work the intersection of business and engineering
        through my AI agency, Estuary Systems LLC.
      </p>
      <p>I have a corgi named Biscuit.</p>
      {now ? <p className="bio-now">{now}</p> : null}
    </div>
  );
}
