'use client';

import { MagicText } from "@/components/ui/magic-text";
import { LightRays } from "@/components/ui/light-rays"
import RightDotsDecoration from "@/components/right-dots-decoration";

import { ScrollStackDeck } from "@/components/scroll-stack-deck";
import { showcaseProjects } from "@/data/case-studies";

/**
 * Pasang di halaman mana pun: <ShowcaseSection />
 * id="karya" dipakai sebagai target tautan "/#karya".
 */
export function ShowcaseSection() {
  
  return (
    <section id="karya" className="lg:mt-8 scroll-mt-4">
      <div className="w-full relative text-center">
        <RightDotsDecoration />
        <MagicText className="text-6xl text-ink font-bebas text-shadow-4xl/60 font-black text-center mb-4 md:text-8xl">
          Featured Work
        </MagicText>
        <p className="w-full mx-auto text-lg text-muted">
          Explore our latest projects and see how we different from other agencies.
        </p>
      </div>
      <ScrollStackDeck
        projects={showcaseProjects}
        scrollIndicatorText="Scroll"
      />
      <LightRays />
    </section>
  );
}

export default ShowcaseSection;