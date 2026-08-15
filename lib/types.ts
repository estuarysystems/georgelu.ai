export const SHELF_IDS = ["me", "world", "work", "making"] as const;

export type ShelfId = (typeof SHELF_IDS)[number];

export type EssayFrontmatter = {
  shelf: ShelfId;
  slug: string;
  order: number;
  name: string;
  title: string;
  dek?: string;
  blurb?: string;
  object: string;
  inline?: "bio";
};

export type EssayMeta = EssayFrontmatter & {
  frame: number;
  total: number;
};

export type Shelf = {
  id: ShelfId;
  items: EssayMeta[];
};
