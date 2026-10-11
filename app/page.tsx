import Hero from "./_components/hero/Hero";
import Intro from "./_components/intro/Intro";
import Benefits from "./_components/benefits/Benefits";
import Compare from "./_components/compare/Compare";
import Packages from "./_components/packages/Packages";
import Faq from "./_components/faq/Faq";
import Cta from "./_components/cta/Cta";
import BranchStorySection from "./_components/storye/BranchStorySection";
import StudyCaseSection from "./_components/Portfolio/view";
import Pain from "./_components/Pain/view";
import Story from "./_components/story/storySection";
import About from "./_components/About/view";
import InteractiveBook from "@/components/interactiveBook/ebook2";
export default function Page() {
  return (
    <>
      <Hero />
      <main className="mx-5 flex flex-col gap-18">
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
        <StudyCaseSection />
        <Packages />
        <Faq />
        <Cta />
      </main>
    </>
  );
}
