import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllEssayParams, getEssay } from "@/lib/content";
import { BackButton } from "@/components/BackButton";
import { EssayKeys } from "@/components/EssayKeys";

export function generateStaticParams() {
  return getAllEssayParams();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shelf: string; slug: string }>;
}) {
  const { shelf, slug } = await params;
  const essay = getEssay(shelf, slug);
  if (!essay) return {};
  return {
    title: `${essay.meta.name} — George Lu`,
    description: essay.meta.title,
  };
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ shelf: string; slug: string }>;
}) {
  const { shelf, slug } = await params;
  const essay = getEssay(shelf, slug);
  if (!essay) notFound();

  const { meta, body, prev, next, index, count } = essay;
  const frame = `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;

  return (
    <article className="essay">
      <EssayKeys
        prev={prev ? `/${shelf}/${prev.slug}` : null}
        next={next ? `/${shelf}/${next.slug}` : null}
      />
      <header className="essay-bar">
        <BackButton />
        <span className="frame-no">{frame}</span>
      </header>

      <h1 className="essay-title">{meta.title}</h1>
      {meta.dek && <p className="essay-dek">{meta.dek}</p>}

      <div className="prose">
        <MDXRemote source={body} />
      </div>

      <footer className="essay-foot">
        {prev ? (
          <Link href={`/${shelf}/${prev.slug}`} replace>
            ← {prev.name.toLowerCase()}
          </Link>
        ) : (
          <span className="spacer">·</span>
        )}
        {next ? (
          <Link href={`/${shelf}/${next.slug}`} replace>
            {next.name.toLowerCase()} →
          </Link>
        ) : (
          <span className="spacer">·</span>
        )}
      </footer>
    </article>
  );
}
