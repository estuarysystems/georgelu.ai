import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { SHELF_IDS, type EssayFrontmatter, type EssayMeta, type Shelf, type ShelfId } from "./types";

export type { EssayMeta, Shelf, ShelfId } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function isShelfId(value: string): value is ShelfId {
  return (SHELF_IDS as readonly string[]).includes(value);
}

function readEssayFiles(): { data: EssayFrontmatter; content: string; filePath: string }[] {
  const essays: { data: EssayFrontmatter; content: string; filePath: string }[] = [];

  for (const shelf of SHELF_IDS) {
    const dir = path.join(CONTENT_DIR, shelf);
    if (!fs.existsSync(dir)) continue;

    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = matter(raw);
      const data = parsed.data as EssayFrontmatter;

      if (!isShelfId(data.shelf) || !data.slug) {
        throw new Error(`Invalid frontmatter in ${filePath}`);
      }

      essays.push({ data, content: parsed.content, filePath });
    }
  }

  return essays;
}

function withFrames(essays: EssayFrontmatter[]): EssayMeta[] {
  const sorted = [...essays].sort((a, b) => {
    const shelfDelta = SHELF_IDS.indexOf(a.shelf) - SHELF_IDS.indexOf(b.shelf);
    if (shelfDelta !== 0) return shelfDelta;
    return a.order - b.order;
  });

  return sorted.map((essay, index) => ({
    ...essay,
    frame: index + 1,
    total: sorted.length,
  }));
}

export function getCatalog(): Shelf[] {
  const metas = withFrames(readEssayFiles().map((entry) => entry.data));

  return SHELF_IDS.map((id) => ({
    id,
    items: metas.filter((item) => item.shelf === id),
  }));
}

export function getAllEssayParams(): { shelf: ShelfId; slug: string }[] {
  return getCatalog().flatMap((shelf) =>
    shelf.items.map((item) => ({ shelf: shelf.id, slug: item.slug })),
  );
}

export function getSiblings(shelf: string, slug: string): {
  prev?: EssayMeta;
  next?: EssayMeta;
  current?: EssayMeta;
} {
  if (!isShelfId(shelf)) return {};
  const items = getCatalog().find((entry) => entry.id === shelf)?.items ?? [];
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return {};
  return {
    current: items[index],
    prev: items[index - 1],
    next: items[index + 1],
  };
}

export async function renderEssay(shelf: string, slug: string) {
  if (!isShelfId(shelf)) return null;
  const entry = readEssayFiles().find(
    (essay) => essay.data.shelf === shelf && essay.data.slug === slug,
  );
  if (!entry) return null;

  const { content } = await compileMDX({
    source: entry.content,
    options: { parseFrontmatter: false },
  });

  return content;
}

