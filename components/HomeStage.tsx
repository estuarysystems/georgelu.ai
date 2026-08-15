"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { ObjectIcon } from "./ObjectIcon";
import { essayHref } from "@/lib/routes";
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

export function HomeStage({ catalog }: HomeStageProps) {
  const router = useRouter();
  const [shelfIndex, setShelfIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [mode, setMode] = useState<"shelf" | "item">("shelf");
  const [hint, setHint] = useState(true);

  const shelf = catalog[shelfIndex];
  const item = shelf.items[itemIndex] ?? shelf.items[0];

  useEffect(() => {
    if (window.sessionStorage.getItem(HINT_KEY) === "1") setHint(false);

    const params = new URLSearchParams(window.location.search);
    const shelfParam = params.get("shelf") ?? undefined;
    const itemParam = params.get("item") ?? undefined;
    if (!shelfParam) return;

    const nextShelf = shelfIndexOf(catalog, shelfParam);
    setShelfIndex(nextShelf);
    setItemIndex(itemIndexOf(catalog[nextShelf], itemParam));
    if (itemParam) setMode("item");
  }, [catalog]);

  const dismissHint = useCallback(() => {
    setHint(false);
    window.sessionStorage.setItem(HINT_KEY, "1");
  }, []);

  const syncUrl = useCallback(
    (nextShelf: ShelfId, nextSlug: string) => {
      const url = `/?shelf=${nextShelf}&item=${nextSlug}`;
      window.history.replaceState(null, "", url);
    },
    [],
  );

  const focusShelf = useCallback(
    (next: number) => {
      const clamped = (next + catalog.length) % catalog.length;
      const nextShelf = catalog[clamped];
      const nextItem = Math.min(itemIndex, nextShelf.items.length - 1);
      setShelfIndex(clamped);
      setItemIndex(nextItem);
      setMode("shelf");
      syncUrl(nextShelf.id, nextShelf.items[nextItem].slug);
      dismissHint();
    },
    [catalog, dismissHint, itemIndex, syncUrl],
  );

  const focusItem = useCallback(
    (next: number) => {
      const count = shelf.items.length;
      const clamped = (next + count) % count;
      setItemIndex(clamped);
      setMode("item");
      syncUrl(shelf.id, shelf.items[clamped].slug);
      dismissHint();
    },
    [dismissHint, shelf, syncUrl],
  );

  const openEssay = useCallback(
    (target: EssayMeta) => {
      dismissHint();
      router.push(essayHref(target.shelf, target.slug));
    },
    [dismissHint, router],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (mode === "item") focusItem(itemIndex + 1);
        else focusShelf(shelfIndex + 1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (mode === "item") focusItem(itemIndex - 1);
        else focusShelf(shelfIndex - 1);
      } else if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        if (mode === "shelf") {
          setMode("item");
          dismissHint();
        } else if (item) {
          openEssay(item);
        }
      } else if (event.key === "ArrowLeft" || event.key === "Escape") {
        event.preventDefault();
        if (mode === "item") setMode("shelf");
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismissHint, focusItem, focusShelf, item, itemIndex, mode, openEssay, shelfIndex]);

  const siblings = useMemo(() => {
    if (mode !== "item") return { above: undefined, below: undefined };
    return {
      above: shelf.items[itemIndex - 1],
      below: shelf.items[itemIndex + 1],
    };
  }, [itemIndex, mode, shelf.items]);

  return (
    <div className="stage" role="application" aria-label="George Lu">
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
                    onClick={() => focusShelf(index)}
                  >
                    {entry.id}
                  </button>
                  <div className="shelf-body">
                    {active && current ? (
                      <>
                        {siblings.above ? (
                          <Sibling
                            item={siblings.above}
                            place="above"
                            onFocus={() => focusItem(itemIndex - 1)}
                            onOpen={() => openEssay(siblings.above!)}
                          />
                        ) : null}
                        <article className="item is-open">
                          <button
                            className="item-hit"
                            type="button"
                            onClick={() => openEssay(current)}
                          >
                            <ObjectIcon name={current.name} file={current.object} live />
                            <div className="item-copy">
                              <p className="item-name">{current.name}</p>
                              {current.inline === "bio" ? null : (
                                <p className="item-title">{current.title}</p>
                              )}
                              {current.inline === "bio" ? (
                                <BioCard />
                              ) : current.blurb ? (
                                <p className="item-blurb">{current.blurb}</p>
                              ) : null}
                            </div>
                          </button>
                        </article>
                        {siblings.below ? (
                          <Sibling
                            item={siblings.below}
                            place="below"
                            onFocus={() => focusItem(itemIndex + 1)}
                            onOpen={() => openEssay(siblings.below!)}
                          />
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
          <div className="hint-copy">arrow keys or click</div>
        </div>
      ) : null}
    </div>
  );
}

function Sibling({
  item,
  place,
  onFocus,
  onOpen,
}: {
  item: EssayMeta;
  place: "above" | "below";
  onFocus: () => void;
  onOpen: () => void;
}) {
  return (
    <article className={`item is-sibling is-${place}`}>
      <button
        className="item-hit"
        type="button"
        onClick={onFocus}
        onDoubleClick={onOpen}
      >
        <ObjectIcon name={item.name} file={item.object} />
        <div className="item-copy">
          <p className="item-name">{item.name}</p>
          <p className="item-title">{item.title}</p>
        </div>
      </button>
    </article>
  );
}

function BioCard() {
  return (
    <div className="bio-card">
      <p>
        George Lu. Bay Area. I work the seam between business and engineering. I
        take on problems I can see, then build the company or the tool.
      </p>
      <p>
        Right now that is Estuary Systems, an AI agency, and a claims system for
        people law firms will not represent.
      </p>
      <p>Stuff on my mind:</p>
      <ul>
        <li>how people dress and carry themselves</li>
        <li>Building in the real world instead of collecting credentials</li>
        <li>Privacy and security in a world of new AI products</li>
      </ul>
    </div>
  );
}
