import type { Metadata } from "next";
import Link from "next/link";
import { inter } from "@/app/fonts";
import { getCatalog } from "@/lib/content";
import { essayHref } from "@/lib/routes";

export const metadata: Metadata = {
  title: "All",
  description: "Every essay, by shelf.",
};

export default function AllPage() {
  const catalog = getCatalog();

  return (
    <article className="essay">
      <header className="essay-bar">
        <Link className="essay-back" href="/">
          esc
        </Link>
      </header>
      <div className="essay-main">
        <h1 className="essay-title">All</h1>
        <p className="essay-dek">Every essay, by shelf.</p>
        <div className={`index ${inter.className}`}>
          {catalog.map((shelf) => (
            <section className="index-shelf" key={shelf.id}>
              <h2>{shelf.id}</h2>
              <ul className="index-list">
                {shelf.items.map((item) => (
                  <li key={`${item.shelf}-${item.slug}`}>
                    <Link href={essayHref(item.shelf, item.slug)}>{item.name}</Link>
                    {item.title !== item.name ? (
                      <span className="index-title"> — {item.title}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
