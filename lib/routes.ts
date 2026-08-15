import type { ShelfId } from "./types";

export function homeHref(shelf: ShelfId, slug: string) {
  return `/?shelf=${shelf}&item=${slug}`;
}

export function essayHref(shelf: ShelfId, slug: string) {
  return `/${shelf}/${slug}`;
}

export function padFrame(value: number) {
  return String(value).padStart(2, "0");
}
