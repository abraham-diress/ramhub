import Hero from "@/features/marketing/Hero";
import PhaseOverview from "@/features/marketing/PhaseOverview";
import FeatureGrid from "@/features/marketing/FeatureGrid";
import FinalCta from "@/features/marketing/FinalCta";
import { getPaperwork, type PaperworkItem } from "@/lib/api";

export default async function Home() {
  let items: PaperworkItem[] = [];
  try {
    items = await getPaperwork();
  } catch {
    // The landing page still reads fine without live counts, so a backend blip shouldn't 500 it.
  }

  return (
    <>
      <Hero />
      <PhaseOverview items={items} />
      <FeatureGrid />
      <FinalCta />
    </>
  );
}
