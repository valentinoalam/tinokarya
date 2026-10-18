import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Hero from "@/components/homesections/hero/Hero";
import Intro from "@/components/homesections/intro/Intro";
import Benefits from "@/components/homesections/benefits/Benefits";
import Compare from "@/components/homesections/compare/Compare";
import Packages from "@/components/homesections/packages/Packages";
import Faq from "@/components/homesections/faq/Faq";
import Cta from "@/components/homesections/cta/Cta";
import BranchStorySection from "@/components/homesections/storye/BranchStorySection";
import ShowcaseSection from "@/components/homesections/Portfolio/showcase-section";
import Pain from "@/components/homesections/Pain/view";
import Story from "@/components/homesections/story/storySection";
import About from "@/components/homesections/About/view";
import InteractiveBook from "@/components/interactiveBook/InteractiveBook";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function Page() {
  return (
    <>
      <Hero />
      <main className="mx-5 mt-16 flex flex-col gap-18">
        <Intro />
        <div className="container relative mx-auto h-max px-6 py-20" >
          <About />
        </div>
        <Pain />
        <Benefits />
        <div id='cerita' className="wrap">
          <InteractiveBook />
          <Story />
          <BranchStorySection />
        </div>
        <Compare />
        <ShowcaseSection />
        <Packages />
        <Faq />
        <Cta />
      </main>
    </>
  );
}