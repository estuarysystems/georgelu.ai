"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function EssayKeys({
  prev,
  next,
}: {
  prev: string | null;
  next: string | null;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "ArrowLeft") {
        if (e.key === "ArrowLeft" && prev) {
          e.preventDefault();
          // Replace so sibling hops don't stack history; esc/back returns home.
          router.replace(prev);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          if (window.history.length > 1) router.back();
          else router.push("/");
        }
      } else if (e.key === "ArrowRight" && next) {
        e.preventDefault();
        router.replace(next);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, router]);

  return null;
}
