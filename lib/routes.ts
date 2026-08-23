import type { ShelfId } from "./types";
import { SHELF_IDS } from "./types";

/**
 * URL contract
 *
 * Two public shapes, never a hybrid:
 *   Shelf (browse)  /?shelf=<id>&item=<slug>
 *   Essay (read)    /<shelf>/<slug>          shareable deep link
 *
 * Open:   push the essay path once (Enter / click).
 * Browse: replaceState the shelf query in place. Must keep history.state so
 *         Next.js App Router stays synced — replaceState(null) was the
 *         Escape half-navigation (URL flipped, essay stayed mounted).
 * Sibling: replace the essay path (do not stack essays).
 * Escape: hide the essay in the same tick, then replace to the shelf query.
 * Back:   one pop from an essay lands on shelf home, not a ghost path.
 */
const ESSAY_PATH = new RegExp(`^/(${SHELF_IDS.join("|")})/([a-z0-9-]+)$`);

export function homeHref(shelf: ShelfId, slug: string) {
  return `/?shelf=${shelf}&item=${slug}`;
}

export function essayHref(shelf: ShelfId, slug: string) {
  return `/${shelf}/${slug}`;
}

export function isEssayPath(pathname: string) {
  return ESSAY_PATH.test(pathname);
}

export function replaceHomeUrl(shelf: ShelfId, slug: string) {
  const url = homeHref(shelf, slug);
  if (`${window.location.pathname}${window.location.search}` === url) return false;
  window.history.replaceState(window.history.state ?? {}, "", url);
  return true;
}

export function padFrame(value: number) {
  return String(value).padStart(2, "0");
}
