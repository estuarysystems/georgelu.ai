import { Suspense } from "react";
import { HomeStage } from "@/components/HomeStage";
import { getCatalog } from "@/lib/content";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="stage" />}>
      <HomeStage catalog={getCatalog()} />
    </Suspense>
  );
}
