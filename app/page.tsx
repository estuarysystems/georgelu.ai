import { HomeStage } from "@/components/HomeStage";
import { getCatalog } from "@/lib/content";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  return (
    <HomeStage
      catalog={getCatalog()}
      initialShelf={firstParam(params.shelf)}
      initialItem={firstParam(params.item)}
    />
  );
}
