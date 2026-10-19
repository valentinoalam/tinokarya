import { routing } from '@/i18n/routing';
import Hero from "@/components/homesections/hero/Hero";
import Intro from "@/components/homesections/intro/Intro";
import Benefits from "@/components/homesections/benefits/Benefits";
import Compare from "@/components/homesections/compare/Compare";
import Faq from "@/components/homesections/faq/Faq";
import Cta from "@/components/homesections/cta/Cta";
import BranchStorySection from "@/components/homesections/storye/BranchStorySection";
import ShowcaseSection from "@/components/homesections/Portfolio/showcase-section";
import Pain from "@/components/homesections/Pain/view";
import About from "@/components/homesections/About/view";
import InteractiveBook from "@/components/interactiveBook/InteractiveBook";
import StoriesSection from '@/components/homesections/story/view';
import PackageSection from '@/components/homesections/packages/view';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function Page() {
  return (
    <>
      <Hero />
      <main className="mx-5 mt-16 flex flex-col gap-8">
        <Intro />
        <div className="container relative mx-auto h-max px-6 py-20" >
          <About />
        </div>
        <Pain />
        <Benefits />
        <div id='cerita' className="wrap">
          <InteractiveBook />
          <StoriesSection />
          <BranchStorySection />
        </div>
        <Compare />
        <ShowcaseSection />
        <PackageSection />
        <Faq />
        <Cta />
      </main>
    </>
  );
}