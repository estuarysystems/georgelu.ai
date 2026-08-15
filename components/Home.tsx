"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Shelf } from "@/lib/content";
import { ObjectIcon } from "@/components/ObjectIcon";

type Mode = "shelf" | "item";

export function Home({ shelves }: { shelves: Shelf[] }) {
  const router = useRouter();
  const [shelfIndex, setShelfIndex] = useState(0); // default focus: me
  const [itemIndex, setItemIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("shelf");
  const [moved, setMoved] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const shelf = shelves[shelfIndex];
  const items = shelf?.items ?? [];
  const item = items[Math.min(itemIndex, items.length - 1)];

  const markMoved = useCallback(() => setMoved(true), []);

  const openEssay = useCallback(
    (shelfId: string, slug: string) => {
      router.push(`/${shelfId}/${slug}`);
    },
    [router],
  );

  const selectShelf = useCallback((next: number) => {
    setShelfIndex(next);
    setItemIndex(0);
  }, []);

  useEffect(() => {
    // Restore the shelf you last left, then keep keyboard focus on the stage.
    const saved = sessionStorage.getItem("home:shelf");
    if (saved !== null) {
      const idx = Number(saved);
      if (Number.isInteger(idx) && idx >= 0 && idx < shelves.length) {
        setShelfIndex(idx);
      }
    }
    stageRef.current?.focus();
  }, [shelves.length]);

  useEffect(() => {
    sessionStorage.setItem("home:shelf", String(shelfIndex));
  }, [shelfIndex]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key;
      if (
        ![
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Enter",
          "Escape",
        ].includes(key)
      ) {
        return;
      }
      e.preventDefault();
      markMoved();

      if (mode === "shelf") {
        if (key === "ArrowUp") {
          selectShelf((shelfIndex - 1 + shelves.length) % shelves.length);
        } else if (key === "ArrowDown") {
          selectShelf((shelfIndex + 1) % shelves.length);
        } else if (key === "ArrowRight" || key === "Enter") {
          if (items.length > 0) setMode("item");
        }
        return;
      }

      // item mode
      if (key === "ArrowUp") {
        setItemIndex((i) => (i - 1 + items.length) % items.length);
      } else if (key === "ArrowDown") {
        setItemIndex((i) => (i + 1) % items.length);
      } else if (key === "ArrowLeft" || key === "Escape") {
        setMode("shelf");
      } else if (key === "ArrowRight" || key === "Enter") {
        if (item) openEssay(shelf.id, item.slug);
      }
    },
    [
      mode,
      shelfIndex,
      shelves.length,
      items.length,
      item,
      shelf,
      selectShelf,
      openEssay,
      markMoved,
    ],
  );

  return (
    <div
      className="stage"
      ref={stageRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="George Lu — console home"
    >
      <nav className="shelves" aria-label="Shelves">
        {shelves.map((s, i) => (
          <button
            key={s.id}
            className="shelf-label"
            data-active={i === shelfIndex}
            onClick={() => {
              markMoved();
              selectShelf(i);
              setMode("item");
              stageRef.current?.focus();
            }}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <section className="detail">
        {item && (
          <div className="detail-inner" key={`${shelf.id}-${item.slug}`}>
            <div
              className="object reveal viewfinder"
              data-focused={mode === "item"}
            >
              <span className="vf-b" />
              <span className="vf-t" />
              <ObjectIcon object={shelf.object} size={144} />
            </div>

            <div className="reveal">
              <h1 className="item-name">{item.name}</h1>
              <p className="item-title">{item.title}</p>
              {mode === "item" && item.blurb && (
                <p className="item-blurb">{item.blurb}</p>
              )}

              <div className="rail" role="tablist" aria-label={`${shelf.label} items`}>
                {items.map((it, i) => (
                  <button
                    key={it.slug}
                    className="chip"
                    data-active={i === itemIndex && mode === "item"}
                    onClick={() => {
                      markMoved();
                      setMode("item");
                      setItemIndex(i);
                      openEssay(shelf.id, it.slug);
                    }}
                  >
                    {it.name}
                  </button>
                ))}
              </div>

              <p className="item-hint">
                {mode === "shelf"
                  ? "enter or → to open this shelf"
                  : "enter to read · esc to go back"}
              </p>
            </div>
          </div>
        )}

        {!moved && (
          <div className="first-hint" aria-hidden>
            <span className="chev">
              <span>▲</span>
              <span>▼</span>
            </span>
            <span>arrow keys or click</span>
          </div>
        )}
      </section>
    </div>
  );
}
