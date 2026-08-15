import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EssayView } from "@/components/EssayView";
import { getAllEssayParams, getSiblings, renderEssay } from "@/lib/content";

type PageProps = {
  params: Promise<{ shelf: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllEssayParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shelf, slug } = await params;
  const { current } = getSiblings(shelf, slug);
  if (!current) return {};
  return {
    title: current.name,
    description: current.dek ?? current.blurb ?? current.title,
  };
}

export default async function EssayPage({ params }: PageProps) {
  const { shelf, slug } = await params;
  const siblings = getSiblings(shelf, slug);
  const body = await renderEssay(shelf, slug);

  if (!siblings.current || !body) notFound();

  return (
    <EssayView current={siblings.current} prev={siblings.prev} next={siblings.next}>
      {body}
    </EssayView>
  );
}
