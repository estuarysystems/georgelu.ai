import { HomeStage } from "@/components/HomeStage";
import { getCatalog } from "@/lib/content";

export default function HomePage() {
  return <HomeStage catalog={getCatalog()} />;
}
