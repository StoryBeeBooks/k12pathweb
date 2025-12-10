import Hero from "@/components/sections/Hero";
import PainPoints from "@/components/sections/PainPoints";
import Features from "@/components/sections/Features";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import landingContent from "@/data/landing-content.json";
import type { LandingContentData } from "@/types";

const content = landingContent as LandingContentData;

export default function Home() {
  return (
    <>
      <Hero data={content.hero} />
      <PainPoints data={content.painPoints} />
      <Features data={content.features} />
      <Testimonials data={content.testimonials} />
      <CTA data={content.cta} />
    </>
  );
}
