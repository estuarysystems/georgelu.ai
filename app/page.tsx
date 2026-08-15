import { getShelves } from "@/lib/content";
import { Home } from "@/components/Home";

export default function Page() {
  const shelves = getShelves();
  return <Home shelves={shelves} />;
}
