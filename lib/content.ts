import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ShelfId = "me" | "world" | "work" | "making";

export interface ShelfDef {
  id: ShelfId;
  label: string;
  object: string;
}

export interface ItemMeta {
  shelf: ShelfId;
  slug: string;
  name: string;
  title: string;
  blurb?: string;
  dek?: string;
  order: number;
}

export interface Shelf extends ShelfDef {
  items: ItemMeta[];
}

export interface Essay {
  meta: ItemMeta;
  body: string;
  prev: ItemMeta | null;
  next: ItemMeta | null;
  index: number;
  count: number;
}

// Vertical column, top to bottom. Objects are the first-cut icons from the spec.
export const SHELVES: ShelfDef[] = [
  { id: "me", label: "me", object: "card" },
  { id: "world", label: "world", object: "shirt" },
  { id: "work", label: "work", object: "folder" },
  { id: "making", label: "making", object: "pokecard" },
];

const CONTENT_DIR = path.join(process.cwd(), "content");

function readShelfItems(shelf: ShelfId): ItemMeta[] {
  const dir = path.join(CONTENT_DIR, shelf);
  if (!fs.existsSync(dir)) return [];

  const items = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return {
        shelf,
        slug,
        name: String(data.name ?? slug),
        title: String(data.title ?? ""),
        blurb: data.blurb ? String(data.blurb) : undefined,
        dek: data.dek ? String(data.dek) : undefined,
        order: Number(data.order ?? 0),
      } satisfies ItemMeta;
    });

  return items.sort((a, b) => a.order - b.order);
}

export function getShelves(): Shelf[] {
  return SHELVES.map((shelf) => ({
    ...shelf,
    items: readShelfItems(shelf.id),
  }));
}

export function getAllEssayParams(): { shelf: string; slug: string }[] {
  return getShelves().flatMap((shelf) =>
    shelf.items.map((item) => ({ shelf: shelf.id, slug: item.slug })),
  );
}

export function getEssay(shelf: string, slug: string): Essay | null {
  const shelfDef = SHELVES.find((s) => s.id === shelf);
  if (!shelfDef) return null;

  const items = readShelfItems(shelfDef.id);
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return null;

  const filePath = path.join(CONTENT_DIR, shelfDef.id, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { content } = matter(raw);

  return {
    meta: items[index],
    body: content,
    prev: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
    index,
    count: items.length,
  };
}
