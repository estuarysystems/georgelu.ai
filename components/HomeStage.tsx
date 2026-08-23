"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ObjectIcon } from "./ObjectIcon";
import { essayHref, isEssayPath, parseEssayPath, replaceHomeUrl } from "@/lib/routes";
import { essaySurfaceOpen } from "@/lib/surface";
import type { EssayMeta, Shelf } from "@/lib/types";

const HINT_KEY = "xmb-hint-used-keys";
const HINT_MIN_MS = 6000;
const HINT_IDLE_MS = 8000;

type HomeStageProps = {
  catalog: Shelf[];
  initialShelf?: string;
  initialItem?: string;
};

function shelfIndexOf(catalog: Shelf[], id?: string) {
  const index = catalog.findIndex((shelf) => shelf.id === id);
  return index === -1 ? 0 : index;
}

function itemIndexOf(shelf: Shelf, slug?: string) {
  const index = shelf.items.findIndex((item) => item.slug === slug);
  return index === -1 ? 0 : index;
}

function focusFrom(catalog: Shelf[], shelfId?: string, itemSlug?: string) {
  const nextShelf = shelfIndexOf(catalog, shelfId);
  return {
    shelfIndex: nextShelf,
    itemIndex: itemIndexOf(catalog[nextShelf], itemSlug),
  };
}

function readFocus(catalog: Shelf[]) {
  const params = new URLSearchParams(window.location.search);
  return focusFrom(catalog, params.get("shelf") ?? undefined, params.get("item") ?? undefined);
}

function hintAlreadyUsed() {
  return window.sessionStorage.getItem(HINT_KEY) === "1";
}

export function HomeStage({ catalog, initialShelf, initialItem }: HomeStageProps) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const restored = Boolean(initialShelf || initialItem);
  const seed = useMemo(
    () => focusFrom(catalog, initialShelf, initialItem),
    [catalog, initialShelf, initialItem],
  );
  const [shelfIndex, setShelfIndex] = useState(seed.shelfIndex);
  const [itemIndex, setItemIndex] = useState(seed.itemIndex);
  const [mode, setMode] = useState<"shelf" | "item">("shelf");
  const [hint, setHint] = useState(!restored);
  const hintShownAt = useRef(0);
  const hideHintTimer = useRef(0);
  const idleHintTimer = useRef(0);

  const shelf = catalog[shelfIndex];
  const item = shelf.items[itemIndex] ?? shelf.items[0];
  const nowLine = catalog
    .find((entry) => entry.id === "me")
    ?.items.find((entry) => entry.slug === "now")?.status;

  const scheduleIdleHint = useCallback(() => {
    window.clearTimeout(idleHintTimer.current);
    idleHintTimer.current = window.setTimeout(() => {
      hintShownAt.current = Date.now();
      setHint(true);
      window.clearTimeout(hideHintTimer.current);
      hideHintTimer.current = window.setTimeout(() => {
        setHint(false);
      }, HINT_MIN_MS);
    }, HINT_IDLE_MS);
  }, []);

  const armHintHide = useCallback(() => {
    const remaining = Math.max(0, HINT_MIN_MS - (Date.now() - hintShownAt.current));
    window.clearTimeout(hideHintTimer.current);
    hideHintTimer.current = window.setTimeout(() => {
      setHint(false);
      scheduleIdleHint();
    }, remaining);
  }, [scheduleIdleHint]);

  const revealHint = useCallback(() => {
    window.clearTimeout(hideHintTimer.current);
    window.clearTimeout(idleHintTimer.current);
    hintShownAt.current = Date.now();
    setHint(true);
    if (hintAlreadyUsed()) armHintHide();
  }, [armHintHide]);

  const markHintUsed = useCallback(() => {
    window.sessionStorage.setItem(HINT_KEY, "1");
    armHintHide();
  }, [armHintHide]);

  const syncUrl = useCallback((nextShelf: Shelf["id"], nextSlug: string) => {
    replaceHomeUrl(nextShelf, nextSlug);
  }, []);

  const focusStage = useCallback(() => {
    stageRef.current?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    if (!hintShownAt.current) hintShownAt.current = Date.now();
    if (hintAlreadyUsed()) {
      setHint(false);
      scheduleIdleHint();
    } else if (restored) {
      hintShownAt.current = Date.now();
      setHint(true);
    }
    // Mount only. Re-running after `?` would hide the hint and make recall a no-op.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const apply = (focus: { shelfIndex: number; itemIndex: number }) => {
      setShelfIndex(focus.shelfIndex);
      setItemIndex(focus.itemIndex);
      setMode("shelf");
      focusStage();
    };

    const homeQuery = () => {
      if (isEssayPath(window.location.pathname)) return null;
      const params = new URLSearchParams(window.location.search);
      if (!params.get("shelf")) return null;
      return readFocus(catalog);
    };

    // Home can commit before router.replace updates the window. If the
    // essay path is still up, write that essay's browse query — never
    // the default first item (that pinned ME in #16).
    const essayFocus = () => {
      const parts = parseEssayPath(window.location.pathname);
      return parts ? focusFrom(catalog, parts.shelf, parts.slug) : null;
    };

    const first = homeQuery() ?? essayFocus() ?? seed;
    apply(first);
    const focused = catalog[first.shelfIndex].items[first.itemIndex];
    if (focused) syncUrl(focused.shelf, focused.slug);

    if (homeQuery()) return;

    const poll = window.setInterval(() => {
      const focus = homeQuery();
      if (!focus) return;
      apply(focus);
      const focused = catalog[focus.shelfIndex].items[focus.itemIndex];
      if (focused) syncUrl(focused.shelf, focused.slug);
      window.clearInterval(poll);
    }, 16);
    const stop = window.setTimeout(() => window.clearInterval(poll), 1000);
    return () => {
      window.clearInterval(poll);
      window.clearTimeout(stop);
    };
  }, [catalog, focusStage, seed, syncUrl]);

  useEffect(() => {
    return () => {
      window.clearTimeout(hideHintTimer.current);
      window.clearTimeout(idleHintTimer.current);
    };
  }, []);

  useEffect(() => {
    function onPop() {
      const focus = readFocus(catalog);
      setShelfIndex(focus.shelfIndex);
      setItemIndex(focus.itemIndex);
      setMode("shelf");
      focusStage();
    }

    function restoreFocus() {
      const active = document.activeElement;
      if (
        !active ||
        active === document.body ||
        active === document.documentElement ||
        !stageRef.current?.contains(active)
      ) {
        focusStage();
      }
    }

    window.addEventListener("popstate", onPop);
    window.addEventListener("pageshow", restoreFocus);
    window.addEventListener("focus", restoreFocus);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("pageshow", restoreFocus);
      window.removeEventListener("focus", restoreFocus);
    };
  }, [catalog, focusStage]);

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
    },
    [catalog, syncUrl],
  );

  const focusItem = useCallback(
    (next: number) => {
      const count = shelf.items.length;
      if (next < 0 || next >= count) return false;
      setItemIndex(next);
      setMode("item");
      syncUrl(shelf.id, shelf.items[next].slug);
      return true;
    },
    [shelf, syncUrl],
  );

  const openItems = useCallback(() => {
    setMode("item");
    if (item) syncUrl(shelf.id, item.slug);
  }, [item, shelf, syncUrl]);

  const closeItems = useCallback(() => {
    if (mode !== "item") return;
    setMode("shelf");
    if (item) syncUrl(shelf.id, item.slug);
  }, [item, mode, shelf, syncUrl]);

  const openEssay = useCallback(
    (target: EssayMeta) => {
      router.push(essayHref(target.shelf, target.slug));
    },
    [router],
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

  const moveHorizontal = useCallback(
    (direction: 1 | -1) => {
      if (direction > 0) {
        if (mode === "shelf") {
          openItems();
          return;
        }
        focusItem(itemIndex + 1);
        return;
      }
      closeItems();
    },
    [closeItems, focusItem, itemIndex, mode, openItems],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "?" || event.key === "¿") {
        event.preventDefault();
        revealHint();
        return;
      }

      if (essaySurfaceOpen() || isEssayPath(window.location.pathname)) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveVertical(1);
        markHintUsed();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveVertical(-1);
        markHintUsed();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveHorizontal(1);
        markHintUsed();
      } else if (event.key === "ArrowLeft") {
        if (event.repeat) return;
        event.preventDefault();
        moveHorizontal(-1);
        markHintUsed();
      } else if (event.key === "Enter") {
        event.preventDefault();
        markHintUsed();
        if (item) openEssay(item);
      } else if (event.key === "Escape") {
        if (event.repeat) return;
        event.preventDefault();
        closeItems();
        focusStage();
      }
    }

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [
    closeItems,
    focusStage,
    item,
    markHintUsed,
    moveHorizontal,
    moveVertical,
    openEssay,
    revealHint,
  ]);

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
      data-restore={restored ? "1" : undefined}
      role="application"
      aria-label="George Lu"
      tabIndex={-1}
      autoFocus
    >
      <div className="stage-breath">
        <div className="stage-weave">
          <div className="shelves">
            {catalog.map((entry, index) => {
              const active = index === shelfIndex;
              const current = active ? item : entry.items[0];
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
                    onClick={() => {
                      focusShelf(index);
                      focusStage();
                    }}
                  >
                    {entry.id}
                  </button>
                  <div className="shelf-body">
                    {active && current ? (
                      <>
                        {siblings.above ? (
                          <Sibling item={siblings.above} place="above" open={mode === "item"} />
                        ) : null}
                        <article className="item is-open">
                          <Link
                            className="item-hit"
                            href={essayHref(current.shelf, current.slug)}
                            onMouseDown={(event) => event.preventDefault()}
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
      <div className="hint" data-hint={hint ? "on" : "off"} aria-hidden={!hint}>
        <div className="hint-chevrons" aria-hidden="true">
          <span>⌃</span>
          <span>⌄</span>
        </div>
        <div className="hint-copy">↑↓ shelves · ←→ items · enter opens · esc back</div>
      </div>
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
        onMouseDown={(event) => event.preventDefault()}
      >
        <ObjectIcon name={item.name} file={item.object} />
        <div className="item-copy">
          <p className="item-name">{item.name}</p>
          <p className="item-title">{item.title}</p>
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
